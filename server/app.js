import express from "express";
import cors from "cors";

import morgan from "morgan";
import houseRoutes from "./routes/api/house";
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.get("/");
app.use("/api/house", houseRoutes);

export default app;
