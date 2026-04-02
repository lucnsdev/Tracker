import express from "express";
import dataRoutes from "./data.routes.js";

const app = express();
const homePageContent = { 'status': 'unauthorized' };

app.use(express.json());
app.get('/', (request, response) => response.status(401).json(homePageContent));
app.post('/', (request, response) => response.status(401).json(homePageContent));
app.use("/data", dataRoutes);

export default app;