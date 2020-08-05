"use strict";

const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const { exp } = require("@tensorflow/tfjs-core");
const app = express();
const PORT = process.env.PORT;

// app.use(bodyParser.json());

app.use(
  express.json({
    inflate: true,
    limit: "50mb",
    reviver: null,
    strict: true,
    type: "application/json",
    verify: undefined,
  })
);

require("./routers")(app);
// var jsonParser       = bodyParser.json({limit:'200mb', type:'application/json'});
// var urlencodedParser = bodyParser.urlencoded({ extended:false,limit:'200mb',type:'application/x-www-form-urlencoded' })

// app.use(jsonParser);
// app.use(urlencodedParser);

app.use("/images", express.static("images/"));
app.listen(PORT, () => {
  console.log(`Server started on http://192.168.207.194:${PORT}`);
});
