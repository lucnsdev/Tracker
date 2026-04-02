import { dataSchema } from "./data.schema.js";
import dataService from "./data.service.js";
import firebase from "./firebase/firebase.messaging.js";

const dataController = {
    async putData(req, res, next) {
        try {
            const parsedJsonObject = dataSchema.safeParse(req.body);
            if (!parsedJsonObject.success) {
                return res.status(400).json({ status: "invalid_data", errors: parsedJsonObject.error.flatten() });
            }
            await firebase.sendDatabase(parsedJsonObject.data);
            const lastStatus = await dataService.getLastStatus();
            if ((parsedJsonObject.data["status"] === "power_up" && parsedJsonObject.data["status"] !== lastStatus)) {
                //console.log("Send \"power up\" status message over firebase messaging.");
                await firebase.sendMessage(parsedJsonObject.data);
            } else if (parsedJsonObject.data["status"].startsWith("power_down") && lastStatus === "power_up") {
                //console.log("Send \"power down\" status message over firebase messaging.");
                await firebase.sendMessage(parsedJsonObject.data);
            }
            await dataService.putData({
                data: parsedJsonObject.data
            });
            return res.sendStatus(204);
        } catch (err) {
            return next(err);
        }
    },

    async getData(req, res, next) {
        try {
            const data = await dataService.getData();
            return res.json({ data });
        } catch (err) {
            return next(err);
        }
    },
};

export default dataController;