import "dotenv/config";
import fs from "fs";
import admin from "firebase-admin";
//const { GoogleAuth } = 'google-auth-library';
const raw = process.env.SECRETS_PATH;
const rtdbUrl = process.env.DATABASE_URL;
const credentialFileName = process.env.CREDENTIAL_FILE_NAME;
const adminTokenFileName = process.env.ADMIN_TOKEN_FILENAME;
const rtdbDir = process.env.REALTIME_DATABASE_DIR;

function initializeFirebase() {
    console.log(`${raw}/${credentialFileName}`);
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(`${raw}/${credentialFileName}`),
            databaseURL: rtdbUrl
        });
    }
}

const firebase = {

    async sendDatabase(data) {
        initializeFirebase();
        const db = admin.database();
        const postsRef = db.ref(rtdbDir);
        await postsRef.set(data);
        //console.log("Firebase realtime database sent.");
    },

    async sendMessage(data) {
        var jsonData = {};
        Object.entries(data).forEach(([key, value]) => {
            jsonData[`${key}`] = `${value}`;
        });
        const destineToken = await fs.readFileSync(`${raw}/${adminTokenFileName}`, 'utf8');
        const message = {
            "token": destineToken,
            "android": {
                "priority": "HIGH",
                "ttl": 60000,
                "data": jsonData
            }
        };
        initializeFirebase();
        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    },

    async isExpired() {
        if (!fs.existsSync(`${raw}data.json`)) return true;
        const data = await fs.readFileSync(`${raw}/token.json`);
        const jsonObject = JSON.parse(data);
        return jsonObject["expires_in"] <= Date.now() / 1000;
    }
}

export default firebase;