require('dotenv').config()

const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("dist"));

// will need api paths to query google with the api key
app.get('/api/getKey', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY);
})

app.listen(port, () => {
  console.log(`Example app listening to port ${port}`);
});
