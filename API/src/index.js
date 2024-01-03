const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const rateLimiter = require('./middlewares/ratelimitMiddleware')
const statusMiddleware = require('./middlewares/statusMiddleware');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => {
    res.json("System API stworzony dla DailyRPG - Ten system nie jest dostępny dla zwykłych użytkowników")
})

const paymentRoute = require('./routes/paymentRoute');
app.use('/payment', rateLimiter(30), paymentRoute)

app.use(statusMiddleware.handleBadRequest);
app.use(statusMiddleware.handleInternalServerError);
app.use(statusMiddleware.handleServiceUnavailable);
app.use(statusMiddleware.handleNotFound);

const PORT = process.env.PORT || 2137;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});