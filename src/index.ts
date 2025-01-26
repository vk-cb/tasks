import express from 'express';
import db from './config/db';
import dotenv from 'dotenv';
import router from './routes/routes';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT
db();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/v1/api', router);

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
});