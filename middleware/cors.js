const cors = require("cors");

const allowedIP = [undefined];

const corsConifg = cors({
  origin: (originIP, callback) => {
    const isAllowed = allowedIP.includes(originIP);
    const notAllowerErr = new Error("CORS Reject, IP not whitelisted!");
    if (isAllowed) {
      callback(undefined, true);
    } else {
      callback(notAllowerErr, undefined);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200,
});

module.exports = corsConifg;
