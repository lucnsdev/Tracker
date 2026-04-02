import { Router } from "express";
import dataController from "./data.controller.js";

const routers = Router(); // url path: /data
routers.post("/", dataController.putData);
routers.get("/", dataController.getData);

export default routers;