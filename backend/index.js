import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import {dbService} from "./services/db-service.js";
import {router} from "./routers/router.js";
import {errorMiddleware} from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

const corsOptions = {
    // origin: [process.env.ORIGIN, 'http://localhost:4200', 'http://localhost:4200/', 'https://sakina-jet.vercel.app/', 'https://sakina-jet.vercel.app'],
    origin: 'https://sakina-jet.vercel.app',
    // origin: 'http://localhost:4200',
    methods: 'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}


app.use(cors(corsOptions));

app.use(express.json({limit: '250mb'}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await dbService();
        app.listen(process.env.PORT, () => console.log('Server started on port ' + process.env.PORT));
    } catch (error) {
        console.log(error);
    }
};

start();

export default app
