import express from 'express';
import db from './config/db';
import dotenv from 'dotenv';
import router from './routes/routes';
dotenv.config();
const app = express();
const port = process.env.PORT
db();

app.use(express.json());
app.use('/v1/api', router);

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});