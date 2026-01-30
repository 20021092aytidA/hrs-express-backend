const express = require("express");
const app = express();
const env = require("dotenv").config();
const corsConfig = require("./middleware/cors");

app.use(corsConfig);
