import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import session from 'express-session';
import { renameFile, uploadMiddleware } from './upload';
import { Routes } from './routes';
import { AppDataSource } from './data-source';

dotenv.config();
AppDataSource.initialize().then(async () => {
    const app: Express = express();

    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        optionsSuccessStatus:200
    }));

    app.use(session({
        secret: 'adsfdghsgearfsgrdthftehetrt',
        resave: false,
        saveUninitialized: false,
        cookie: {
            sameSite: 'none',
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            secure: true
        }
    }))

    app.post('/upload', uploadMiddleware, renameFile, (req, res) => {
        res.json({
            fileUrl: (req as any).fileUrl
        })
    })

    app.use('/img',express.static('img', {
        extensions: ['png', 'jpg', 'jpeg']
    }))
    
    app.get('/', (req: Request, res: Response) => {
        res.send('Radi');
    });

    for (let route of Routes) {
        app[route.method](route.url, ...route.handler);
    }

    const port = process.env.PORT || 8000

    app.listen(8000, () => {
        console.log(`Running on ${port}`);
    });
    
}).catch(error => console.log(error))
