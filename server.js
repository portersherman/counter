var express = require("express");
var app = express();
var server = app.listen(8000);
app.use(express.static("public"));