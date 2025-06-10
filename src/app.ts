import express from 'express';
import dotenv from 'dotenv';
import shopifyAuth from './shopify/auth';
import orderSync from './shopify/orderSync';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/shopify', shopifyAuth);
app.use('/shopify', orderSync);

app.get('/', (req, res) => {
  res.send('RocketPress API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
