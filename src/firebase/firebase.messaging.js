import fs from "fs";
import admin from "firebase-admin";
//const { GoogleAuth } = 'google-auth-library';

function initializeFirebase() {
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert('./raw/esp32-firebase-5a830-firebase-adminsdk-fbsvc-b40e836e4a.json'),
            databaseURL: "https://esp32-firebase-5a830-default-rtdb.firebaseio.com/"
        });
    }
}

const firebase = {

    async sendDatabase(data) {
        initializeFirebase();
        const db = admin.database();
        const postsRef = db.ref("tracker/data");
        await postsRef.set(data);
        console.log("Firebase realtime database sent.");
    },

    async sendMessage(data) {
        var jsonData = {};
        Object.entries(data).forEach(([key, value]) => {
            jsonData[`${key}`] = `${value}`;
        });
        const destineToken = await fs.readFileSync('./raw/admim-messaging-token.txt', 'utf8');
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
        if (!fs.existsSync('./raw/data.json')) return true;
        const data = await fs.readFileSync('./raw/token.json');
        const jsonObject = JSON.parse(data);
        return jsonObject["expires_in"] <= Date.now() / 1000;
    }
}

export default firebase;