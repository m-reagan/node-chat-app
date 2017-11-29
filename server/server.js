const path = require('path');
const express = require ('express');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(port,  () => {
  console.log(`Server started successfully at port ${port}`);
});
