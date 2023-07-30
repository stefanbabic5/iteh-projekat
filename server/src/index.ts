import * as express from 'express';
import * as dotenv from "dotenv";
import * as cors from "cors";
import * as session from 'express-session';
import { renameFile, uploadMiddleware } from './upload';
import { Routes } from './routes';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import * as fs from 'fs';
import * as https from 'https';
import "reflect-metadata";
import { UserHandler } from './handler/userHandler';
import * as jwt from 'jsonwebtoken';

//dotenv.config();
AppDataSource.initialize().then(async () => {
    //const key = fs.readFileSync('./key.pem', 'utf8');
    //const cert = fs.readFileSync('./cert.pem', 'utf8');
    const app = express();

    app.use(express.json());
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        optionsSuccessStatus:200
    }));

    const userHandler = new UserHandler();
    app.post('/login', userHandler.login);
    app.post('/register', userHandler.register);

    app.use(async (request, response, next) => {
        const authorization = request.headers.authorization;
        if (!authorization) {
            response.sendStatus(400);
            return
        }
        const splited = authorization.split(' ');
        if (splited.length != 2 || splited[0] !== 'Bearer') {
            response.sendStatus(400);
            return;
        }
        try {
            const value = jwt.verify(splited[1], 'token123', {maxAge: 3600}) as {id:number}
            const user = await AppDataSource.getRepository(User).findOne({
                where: {
                    id: value.id
                }
            })
            if (!user) {
                response.sendStatus(401);
                return;
            }
            (request as any).user = user;
            next();
        } catch(error) {
            response.sendStatus(401);
        }
        
    });

    app.get('/check', userHandler.check);

    app.post('/logout', async (req, res) => {
        req.session.destroy(err => {})
        res.sendStatus(204);
    })

    app.post('/upload', uploadMiddleware, renameFile, (req, res) => {
        res.json({
            fileUrl: (req as any).fileUrl
        })
    })

    app.use('/img',express.static('img', {
        extensions: ['png', 'jpg', 'jpeg']
    }))
    

    for (let route of Routes) {
        app[route.method](route.url, ...route.handler);
    }

    // const server = https.createServer({
    //     key: key,
    //     cert: cert,
    // }, app)

    app.listen(8000, () => {
        console.log(`Running on 8000`);
    });
    
}).catch(error => console.log({error: error}))