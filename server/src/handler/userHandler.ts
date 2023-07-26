import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import * as jwt from "jsonwebtoken";

export class UserHandler {
    public async login(req: Request, res: Response) {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: {
                email: req.body.email,
                password: req.body.password
            }
        });
        if (!user) {
            res.status(400).json({
                error: 'Ne postoji user'
            });
            return;
        }
        (req as any).user = user;
        const token = jwt.sign({ id: user.id }, 'token123')
        res.json({
            ...user,
            token
        });
    }

    public async register(req: Request, res: Response) {
        const userRepository = AppDataSource.getRepository(User);
        let user = await userRepository.findOne({
            where: {
                email: req.body.email
            }
        });
        if (user) {
            res.status(400).json({
                error: 'Vec postoji nalog sa mailom'
            });
            return;
        }
        const insertResult = await userRepository.insert({
            ...req.body,
            category: 'user'
        });
        const id = insertResult.identifiers[0].id;
        user = await userRepository.findOne({
            where: {
                id
            }
        });
        (req as any).user = user;
        const token = jwt.sign({ id: user.id }, 'token123')
        res.json({
            ...user,
            token
        });
    }

    public async check(req: Request, res: Response) {
        const user = (req as any).user;
        res.json(user)
    }
}