var express = require('express');
var app = express();
var request = require('request');
console.log(process.env.LIFXKEY);

//setup template engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'))

app.get('/', function(req, res) {
  var lightState = null;
  const options = {
    url: 'https://api.lifx.com/v1/lights/all',
    headers: {
      'Authorization': 'Bearer ' + process.env.LIFXKEY
    }
  };

  request(options, function(error, response, body) {
    if (error) {
      console.log("ERROR");
      return;
    }
    lightState = JSON.parse(body)[0]; //only handling one light right now
    if (lightState.power === 'off') {
      console.log('light is off!')
    } else {
      console.log('light is on!')
    }
    res.render('index', {power : lightState.power});
  });
});




//listening on port 3000
app.listen(3000);
