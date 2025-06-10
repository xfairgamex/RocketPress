import express from 'express';
import dotenv from 'dotenv';
import shopifyAuth from './shopify/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/shopify', shopifyAuth);

app.get('/', (req, res) => {
  res.send('RocketPress API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
