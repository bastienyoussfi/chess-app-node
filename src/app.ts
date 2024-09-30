import express from 'express';
import cors from 'cors';
import { CONFIG } from './config';

const app = express();

app.use(cors({
  origin: CONFIG.CORS_ORIGIN
}));

app.use(express.json());

export default app;