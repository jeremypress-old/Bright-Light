var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser')

//setup template engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'))


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var options = {
  url: undefined,
  headers: {
    'Authorization': 'Bearer ' + process.env.LIFX
  }
};

var lightState = null;

function extractLightStatus() {
  if (lightState) {
    return "on";
  } else {
    return "off";
  }
}

app.get('/', function(req, res) {
  options.url = 'https://api.lifx.com/v1/lights/all';
  //getting light state
  request(options, function(error, response, body) {
    if (error) {
      console.log("ERROR");
      return;
    }
    console.log(body)
    lightState = JSON.parse(body)[0].power;
    console.log(lightState)
    if (lightState === 'off') {
      lightState = false;
    } else {
      console.log('light is on')
      lightState = true;
    }
    res.render('index', {power : extractLightStatus()});
  });
});

app.post('/api/toggle_power', function(req, res) {
  console.log('received');
  options.url = "https://api.lifx.com/v1/lights/all/toggle";

  request.post(options, function(error, response, body) {
    if (error) {
      console.log("ERROR");
      return;
    }
    status = JSON.parse(body).results[0].status;
    if (status === "ok") {
      lightState = !lightState;
      console.log(lightState)
      res.render('index', {power : extractLightStatus()});
    }
  });
});




//listening on port 3000
app.listen(3000);
