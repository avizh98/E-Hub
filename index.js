require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('GoForMe backend is running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gofor-me', time: new Date().toISOString() });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`GoForMe backend listening on http://localhost:${port}`);
});