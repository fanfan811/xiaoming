const express = require('express');
const cors = require('cors');
const app = express();

// 允许所有来源
app.use(cors());

// 或者指定允许的来源
app.use(cors({
    origin: ['https://fanfan811.github.io', 'http://127.0.0.1:5500']
}));