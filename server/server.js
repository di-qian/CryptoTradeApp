require('dotenv').config();
const express = require('express');
const app = express();
const cryptoRoutes = require('./routes/cryptoRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

app.use('/api/v1/cryptos', cryptoRoutes);
app.use('/api/v1/users', userRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is running in ${process.env.NODE_ENV} on port ${PORT}`);
});
