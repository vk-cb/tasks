import express from 'express';
import db from './config/db';
import dotenv from 'dotenv';
import router from './routes/routes';
dotenv.config();
const app = express();
db();

app.use(express.json());
app.use('/v1/api', router);

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});