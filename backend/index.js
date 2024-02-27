import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.ORIGIN,
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));


const start = async () => {
    try {
        app.listen(process.env.PORT, () => console.log('Server started on port ' + process.env.PORT));
    } catch (error) {
        console.log(error);
    }
};

start();
