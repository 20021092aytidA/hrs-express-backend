const express = require("express");
const app = express();
const env = require("dotenv").config();
const multer = require("multer");
const upload = multer();
const corsConfig = require("./middleware/cors");
const userRouter = require("./routes/userRoute");

app.use(corsConfig);
app.use("/hrs-be-api/user", upload.none(), userRouter);
app.listen(process.env.API_PORT, (err) => {
  console.log(!err ? "API Running!" : err);
});
