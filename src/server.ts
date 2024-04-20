import express from "express";
import cors from "cors"
import * as dotenv from 'dotenv';
import routes from "./routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes)

const PORT = process.env.PORT


app.listen(PORT || 3000, () => (
    console.log("Http server running! on port " + PORT)
));