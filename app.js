const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const initializeDatabase = require('./config/initializeDB');
const app = express();

app.use(cors());

app.use(bodyParser.json());

initializeDatabase();

app.use('/api', userRoutes);
app.use('/api/transaction', transactionRoutes);

app.listen(3000, () => {
    console.log('Server is running on 3000');
});