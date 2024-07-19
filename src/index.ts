import express from 'express';
import dotenv from 'dotenv';
import { AccountController } from './controller/bank.controller';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const accountController = new AccountController();

app.post('/reset', accountController.reset);
app.get('/balance', accountController.getBalance);
app.post('/event', accountController.handleEvent);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
