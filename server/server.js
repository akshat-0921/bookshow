import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectBD from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'

const app = express();
await connectBD();
// Middleware
app.use(cors());
app.use(express.json());
app.use(ClerkMiddleware());
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
})




app.listen(port, ()=> console.log(`Server listening at http://localhost:${port}`));


