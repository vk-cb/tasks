import express, {Request, Response} from 'express';
import db from './config/db';
import dotenv from 'dotenv';
import routes from './routes/routes';
dotenv.config();
const app = express();
db();

app.use(express.json());
app.use('/api', routes);

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});