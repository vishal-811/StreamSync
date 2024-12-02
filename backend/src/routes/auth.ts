import {  Router } from 'express';
import { z } from 'zod';
import  bcrypt  from 'bcrypt'
import Jwt from 'jsonwebtoken'

const router = Router();
import prisma from '../lib/index'

const signupSchema = z.object({
    email : z.string(),
    username : z.string(),
    password : z.string()
})

const signinSchema = z.object({
    email : z.string(),
    password : z.string()
})

router.post('/signup', async(req,res)=>{
    const signupPayload = signupSchema.safeParse(req.body);
    if(!signupPayload.success){
      res.status(401).json({msg :"Invalid data"});
      return;  
    }

   try {
    const { username , email , password } = signupPayload.data;
    const isalreadyExist = await prisma.user.findFirst({
        where :{
            username : username
        }
    })
    if(isalreadyExist){
        res.json({msg :"user already exist with this username"});
        return;
    }

    const hashedPassword =await  bcrypt.hash(password, 10);
    const user =  await prisma.user.create({
        data:{
            email : email,
            username : username,
            password : hashedPassword
        }
    })
    const token = Jwt.sign(user.id.toString(),"HELLO");
    res.cookie('token', token);
    res.status(201).json({msg :"User signup sucess"});
   } catch (error) {
     res.status(500).json({msg :"Internal server error"});
     return;
   }
})

router.post('/signin',async(req,res)=>{
  const signinpayload = signinSchema.safeParse(req.body);
  if(!signinpayload.success){
    res.status(401).json({msg :"Invalid inputs"});
    return;
  }
  
   try {
    const { email , password } = signinpayload.data;
   const userDetails = await prisma.user.findFirst({
      where :{
          email : email
      }
   })
   if(!userDetails){
    res.status(401).json({msg :"No user exist with this credentials"});
    return;
   }

   const isValidPassword = bcrypt.compare(password,userDetails.password);
   if(!isValidPassword){
    res.status(401).json({msg :"Invalid password"});
    return;
   }
   const token = Jwt.sign(userDetails.id.toString(), 'HELLO')
   
   res.cookie('token', token);
   res.status(200).json({msg :"User signin sucess"});
   return;
   } catch (error) {
    res.status(500).json({msg :"Internal server Error"});
    return;
   }

})

export default router;