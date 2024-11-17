import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import mfaRoutes from './routes/mfaRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser())

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Final Project API',
      version: '1.0.0',
      description: 'API for the final project of the backend course',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
  },
  apis: ['./routes/*.js'],
}

app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDoc(swaggerOptions)));
app.use('/api/auth', authRoutes);
app.use('/api/mfa', mfaRoutes);
app.use('/api/portfolios', portfolioRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
})