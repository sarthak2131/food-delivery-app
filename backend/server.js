import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; 
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


import authRoutes from './routes/auth.js';
import menuRoutes from './routes/menu.js';
import orderRoutes from './routes/order.js';
import errorHandler from './middleware/errorHandler.js';
app.use('/api', authRoutes);
app.use('/api', menuRoutes);
app.use('/api', orderRoutes);



app.use(errorHandler);
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
