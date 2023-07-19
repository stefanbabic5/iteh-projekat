import { Request, Response } from "express";
import multer from "multer";
import * as path from "path";
import { v4 } from "uuid";
import * as fs from "fs";

export const uploadMiddleware = multer({
    dest: '/img'
}).fields([
    {
        name: 'img',
        maxCount: 1
    }
])

export function renameFile(request: Request, res: Response, next?: any) {
    
        if (!request.files) {
            next();
            return;
        }
        //@ts-ignore
        if (!request.files.img) {
            next();
            return;
        }
        //@ts-ignore
        const file = request.files.img[0];
        const tempPath = file.path;
        const imgName = 'img/' + v4() + '-' + file.originalname;
        const targetPath = path.resolve(imgName);
        console.log(targetPath);
        (request as any).fileUrl = 'https://localhost:8000/' + imgName;
        fs.rename(tempPath, targetPath, (err) => {
            console.log(err);
        })
        next();
    
}