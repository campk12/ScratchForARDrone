
require('path');

var drone = require("ar-drone").createClient();
drone.config('general:navdata_demo', 'TRUE');

var dataToTrack_keys = ["batteryPercentage", "clockwiseDegrees", "altitudeMeters", "frontBackDegrees", "leftRightDegrees", "xVelocity", "yVelocity", "zVelocity"];
var lastDroneDataReceived = null;

var PORT = 3001;

/**************** SET UP THE SERVER ******************/

/* Create the general server that will handle all requests sent to localhost:port/ */
var server = require("http").createServer(handleRequest);

//enable DroneStream node module to access video stream from drone and pipe it to the WebGL canvas on client
//require("dronestream").listen(server);


/* LAUNCH SERVER */
server.listen(PORT, function () {
    return console.log("HTTP server listening on port " + PORT);
});

drone.on('navdata', function (data) {
    lastDroneDataReceived = data;
});


/** 
 * Listen for drone commands that take a speed parameter 
 * @param speed is a number between 0 to 100, convert to number between 0 and 1
**/
/*
app.get("/drone/:cmd/:speed", function (req, res) {
    var cmd = req.params['cmd'];
    var speed = req.params['speed'];
    
    //ignore this command if speed is outside the allowed range
    if (speed < 0 || speed > 100)
        return;

    //convert speed to something between 0 and 1, which is what the ar-drone library commands need
    speed = speed / 100;

    res.send('Command received: ' + cmd + ' with speed ' + speed);
    console.log('Command received: ' + cmd + ' with speed ' + speed);
});
*/

/** Listen for drone commands that do not take a speed **/
/*
app.get("/drone/takeoff", function (req, res) {
    res.send('Command received: takeoff');
    console.log('Command received: takeoff');
});

app.get("/drone/land", function (req, res) {
    res.send('Command received: land');
    console.log('Command received: land');
});

app.get("/drone/stopEverything", function (req, res) {
    res.send('Command received: Stop everything, hover in place');
    console.log('Command received: Stop everything, hover in place');
});

app.get("/drone/disableEmergency", function (req, res) {
    res.send('Command received: disable emergency mode');
    console.log('Command received: disable emergency mode');
});
*/

//We need a function which handles requests and send response
function handleRequest(request, response){
    //console.log('It Works!! Path Hit: ' + request.url);
    
    var url_params = request.url.split('/');

    //url_params length 0 means [ ]
    //url_params length 1 means [""], if only a "/" was passed
    //url_params length 2 or more means we have some commands, so handle only in this case
    if (url_params.length < 2)
        return;

    var command = url_params[1];
    var speed;
    var duration;

    if (!drone) return;

    switch (command){

        case 'takeoff':
        case 'land':
        case 'stop':
        case 'disableEmergency':
            
            console.log("DRONE command: " + command);
            response.end('DRONE command: ' + command);

            if (typeof drone[command] === "function") 
                drone[command]();
            break;

        case 'up': case 'down': case 'front': case 'back': case 'clockwise': case 'counterClockwise': case 'left': case 'right':
            
            //extract 'speed' from the url params
            speed = (url_params.length >= 3) ? url_params[2] : 0;

            //convert from 0-100 to 0-1
            speed /= 100;

            console.log("DRONE command " + command + " with speed " + speed);
            response.end("DRONE command " + command + " with speed " + speed);

            if (typeof drone[command] === "function") 
                drone[command](speed);

            break;

        case 'flipAhead': case 'flipLeft': case 'yawShake': case 'wave':
            //extract 'duration' from the url params
            duration = (url_params.length >= 3) ? url_params[2] : 0;

            console.log("DRONE command " + command + " with duration " + duration);
            response.end("DRONE command " + command + " with duration " + duration);


            drone.animate(command, duration);
            
            break;

        case 'poll':
            respondToPoll(response);
            break;

        case 'reset_all':
            console.log('reset_all command received from Scratch. execute a \'stop\' on the drone and then a \'land\'.')
            response.end('reset_all received');

            drone.stop();
            drone.land();
            
            break;

        default:
            console.log('Unknown Command: ' + request.url);
            response.end('Unknown Command: ' + request.url);
            break;
    }
}

function respondToPoll(response){

    var noDataReceived = (!drone || !lastDroneDataReceived) ? true : false;
    //console.log("drone: " + drone);
    //console.log("lastDroneDataReceived: " + lastDroneDataReceived);
    var resp = "";
    var i;
    for (i = 0; i < dataToTrack_keys.length; i++){
        resp += dataToTrack_keys[i] + " ";
        resp += (!lastDroneDataReceived || !lastDroneDataReceived.demo) ? "-1" : Math.round(lastDroneDataReceived.demo[dataToTrack_keys[i]], 4);
        resp += "\n";
    }

    response.end(resp);
    //console.log("\n"+resp+"\n");
}
