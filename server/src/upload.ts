import { Request, Response } from "express";
import * as multer from "multer";
import * as path from "path";
import { v4 } from "uuid";
import * as fs from "fs";

export const uploadMiddleware = multer({
    dest: path.resolve('./img')
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
        if (!request.files['img']) {
            next();
            return;
        }
        //@ts-ignore
        const file = request.files['img'][0];
        const tempPath = file.path;
        //+ v4() + '-'
        const imgName = 'img/' + v4() + '-' + file.originalname;
        const targetPath = path.resolve(imgName);
        console.log(targetPath);
        (request as any).fileUrl = 'http://localhost:8080/projekatIteh/server/' + imgName;
        fs.rename(tempPath, targetPath, (err) => {
            if (err) {
                console.error('Error naming the file: ', err);
                res.sendStatus(500).json({error: "File rename failed"});
                //return;
            } else {
                next();
            }
        })
        
}