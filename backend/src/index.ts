import express from 'express';
import cors from 'cors';
import rootRouter from './routes/index'
import cookieParser from 'cookie-parser'
import { createClient } from 'redis';
const app = express();

app.use(cors({origin: "http://localhost:5173",credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],   allowedHeaders: ['Content-Type', 'Authorization']}));


app.use(cookieParser());
app.use(express.json());

app.use('/api',rootRouter);


export const client = createClient();
async function startServer(){
try {
    await client?.connect();
console.log("connected sucessfully to the Redis");
} catch (error) {
   console.log("Failed to connected to redis"); 
}

app.listen(3000,()=>{
    console.log("Server is listening on port 3000");
})
}

startServer();