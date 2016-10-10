// Requires
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser')


// Setup
// setup template engine
app.set('view engine', 'ejs');
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// State Variables
var options = {
    url: undefined,
    headers: {
        'Authorization': 'Bearer ' + process.env.LIFX
    }
};
console.log(process.env.LIFX)
var lightState = null;
var stateManager = {
    timerId: 0,
    timers : {},
    alarms: []
}

// Helper Functions
function extractLightStatus() {
    if (lightState) {
        return "on";
    } else {
        return "off";
    }
}

function endTimer() {
    options.url = 'https://api.lifx.com/v1/lights/all/effects/pulse';
    stateManager.timerId += 1;
    body = {
        color: 'blue',
        cycles: 3.0,
        period: .5,
        power_on: true
    }
    var timerOptions = {
        method: 'post',
        body: body, // Javascript object
        json: true, // Use,If you are sending JSON data
        url: options.url,
        headers: options.headers
    }
    request.post(timerOptions, function(error, response, body) {
        if (error) {
            console.log("ERROR");
            return;
        }
        console.log('success');
        // @todo, respond to the client that the timer happened
    });
}


// API Endpoints

app.get('/', function(req, res) {
    options.url = 'https://api.lifx.com/v1/lights/all';
    //getting light state
    request(options, function(error, response, body) {
        if (error) {
            console.log("ERROR");
            return;
        }
        lightState = JSON.parse(body)[0].power;
        if (lightState === 'off') {
            lightState = false;
        } else {
            lightState = true;
        }
        console.log('light is on: ' + lightState);
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
            console.log('light is on: ' + lightState);
            res.render('index', {power : extractLightStatus()});
        }
    });
});

app.post('/api/set_timer', function(req, res) {
    console.log('received');
    options.url = "https://api.lifx.com/v1/lights/all/toggle";
    var time = req.body.time * 60000; //convert to milliseconds
    console.log(time)
    setTimeout(endTimer, time);

    var response = {
        status: 200,
        success: 'Updated Successfully',
        timerId: stateManager.timerId
    }

    res.end(JSON.stringify(response));
});

app.post('/api/set_color', function(req, res) {
    console.log('hi')
    options.url = "https://api.lifx.com/v1/lights/all/state";
    options.json = {
        color: 'green'
    };
    request.put(options, function(error, response, body) {
        if (error) {
            console.log("ERROR");
            return;
        }
        // status = JSON.parse(body).results[0].status;
        // console.log(status)
        // if (status === "ok") {
        //     var response = {
        //         status: 200,
        //     };
        //
        //     res.end(JSON.stringify(response));
        // }
    });
});




// Listen
app.listen(3000);
console.log('Bright Light Running!')
