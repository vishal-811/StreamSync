import {Request, Response, NextFunction } from "express";
import Jwt  from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

export async function authMiddleware(req : Request , res : Response, next : NextFunction){
    const token  = req.cookies.token ;
    console.log(token)
    if(!token){
        res.status(401).json({msg :"No token is provided"});
        return;
    }
    try {
        const verifyToken = Jwt.verify(token, 'HELLO') as string
        if(!verifyToken){
            res.status(401).json({msg :"Invalid Token"});
            return;
        }
        req.userId  = verifyToken;
        next();
    } catch (error) {
       res.status(401).json("Unauthorized"); 
       return;
    }
}