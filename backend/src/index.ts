import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';

import auth from './routes/auth';
import user from './routes/user';
import room from './routes/room';
import booking from './routes/booking';
import roomtype from './routes/roomType';
import filtering from './routes/filtering';
import bookingDetail from './routes/bookingDetail';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(auth);
app.use(user);
app.use(room);
app.use(booking);
app.use(roomtype);
app.use(filtering);
app.use(bookingDetail);

app.use(errorHandler);

app.listen(process.env.PORT, () => console.log(`Server listening at http://localhost:${process.env.PORT}`));
