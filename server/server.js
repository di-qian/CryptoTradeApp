require('dotenv').config();
const express = require('express');
const app = express();
const cryptoRoutes = require('./routes/cryptoRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoute');

app.use(express.json());

app.use('/api/v1/cryptos', cryptoRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/transactions', transactionRoutes);

// app.get('/api/config/paypal', (req, res) =>
//   res.send(process.env.PAYPAL_CLIENT_ID)
// );

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running in ${process.env.NODE_ENV} on port ${PORT}`);
});
