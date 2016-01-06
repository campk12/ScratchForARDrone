# ScratchForARDrone

ScratchForARDrone is an HTTP extension for Scratch 2.0 Offline that allows Scratch to communicate with and receive updates from a connected Parrot AR Drone 2.0.

It consists of a Node.js local server that Scratch communicates with over HTTP. The Node server connects to and communicates with a drone via UDP protocol over WiFi using the node-ar-drone library. 

ScratchForARDrone is developed by Anshul from [Camp K12](http://campk12.com), based on [documentation for HTTP Extensions](http://wiki.scratch.mit.edu/wiki/Scratch_Extension#HTTP_Extensions) provided by the Scratch team.

Updates to this extension are not guaranteed to be on a regular basis – you may modify and customize as you see fit.

### Pre-Requisites
- Get yourself a [Parrot AR Drone 2.0](http://ardrone2.parrot.com/), duh.. 
- Install Scratch Offline 2.0, following instructions at https://scratch.mit.edu/scratch2download/
- Install Node.js on your system, following instructions at https://nodejs.org/

### The Important Elements

Clone this repository on your system or download as .zip. Here are the important pieces:
- **ScratchForARDrone.s2e**: This is the HTTP extension file for Scratch Offline. It contains a JSON object that you can load into Scratch once you've got it up and running in order to access all the custom blocks for communicating with your drone.
- **server.js**: This is your node.js server that functions as a 'helper app' for Scratch Offline. Scratch polls this server 30 times a second with a "/poll" request and sends requests like "/takeoff", "/land", and "/clockwise/40" as drone blocks are executed from the Scratch environment.

### Setup Instructions

**Connect to Drone's WiFi network**

AR Drone's have their own WiFi hotspot. You will need to connect to this network in order to be able to communicate with the drone.

**Run the server**

Install the ar-drone node module, your server will need to this to connect with a Parrot AR Drone:

```sh
$ npm install ar-drone
```
or if you want the latest version, you can install via GitHub:

```sh
$ npm install git://github.com/felixge/node-ar-drone.git
```

Then run the server
```sh
$ node server.js
```

**Import HTTP Extension into Scratch Offline**

1. Run the Scratch 2 offline editor.
2. While holding the shift key on your keyboard, click on the "File" menu in Scratch. You should see "Import Experimental Extension" at the bottom of the menu. Click on it.
3. Navigate to the directory containing ScratchForARDrone and select the ScratchForARDrone.s2e file. 
4. You should see the ScratchForARDrone extension and blocks appear in the "More Blocks" category in the Scratch editor. If the node js server ("helper app") is running and responding to poll requests sent by Scratch, there will be a green dot next to the "ScratchForARDrone" title in the Scratch window.

### Watch the Video

Watch this Scratch extension in action on YouTube here: [https://www.youtube.com/watch?v=Oldw0ruI0Cs] (https://www.youtube.com/watch?v=Oldw0ruI0Cs)

### Questions?

Get in touch with the Camp K12 team at info@campk12.com if you have any questions about this extension or about the organization's work in bringing Drone Programming to students in middle school and high school.
