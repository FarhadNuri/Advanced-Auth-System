import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './utils/connection.util.js';
import authRoutes from './routes/auth.route.js';

const app =express();
dotenv.config();

app.use(express.json());
app.use("/api/auth",authRoutes)
app.listen(5000, () => {
    connectDB();
    console.log('Server is running on port 5000');
})
app.get('/', (req, res) => {
    res.send('Welcome to the Advanced Auth System');
});