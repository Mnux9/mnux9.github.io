/*
WebSerial example
Reads from a webSerial serial port, and writes to it.
Works on Chrome and Edge and Opera browsers. 

created 28 Jan 2022
modified 15 May 2022
by Tom Igoe
*/


// the DOM elements that might be changed by various functions:
let portButton;   // the open/close port button
let readingsSpan; // DOM element where the incoming readings go
let timeSpan;     // DOM element for one special reading
let webserial;
let sliderValueArduino;
let randomValueArduino;
let compilationDateArduino;

let serialNumber;
let fwVersion;

let USBconnectionStatus;


function setup() {
  // get the DOM elements and assign any listeners needed:
  // user text input:

  // user range input:
  
  // span for incoming serial messages:
  readingsSpan = document.getElementById("readings");

  // span for random value:
  compilationDateArduino = document.getElementById("compilationDateArduino");

  // span for slider value:
  sliderValueArduino = document.getElementById("sliderValueArduino");

  // span for random value:
  randomValueArduino = document.getElementById("randomValueArduino");

  // span for incoming serial messages:
  timeSpan = document.getElementById("seconds");

  //serial number
  serialNumber = document.getElementById("serialNumber");

  fwVersion = document.getElementById("firmwareVersion");

  //USB conn satus
  USBconnectionStatus = document.getElementById("USBconnectionStatus");

  const setModeIO16 = document.getElementById("modeIO16");
  setModeIO16.addEventListener("change", readRangeInput);
  
  
  webserial = new WebSerialPort();
  if (webserial) {
    webserial.on("data", serialRead);
     // port open/close button:
     portButton = document.getElementById("portButton");
     portButton.addEventListener("click", openClosePort);

     connectButton = document.getElementById("connectButton");
     connectButton.addEventListener("click", connect);
     offButton.addEventListener("click", ledOff);

     
     randomValueArduinoButton.addEventListener("click", getRandomValue);
   }
}


//runs after connecting to serial
async function openClosePort() {
  // label for the button will change depending on what you do:
  let buttonLabel = "Open port";
  // if port is open, close it; if closed, open it:
  if (webserial.port) {
    await webserial.closePort();
  } else {
    await webserial.openPort();
    buttonLabel = "Close port";
  }
  // change button label:
  portButton.innerHTML = buttonLabel;

  //
  webserial.sendSerial("connect");
}

function serialRead(event) {
  readingsSpan.innerHTML = event.detail.data;

  if (event.detail.data.startsWith("slider")){
    compilationDateArduino.innerHTML = event.detail.data.substring(10);
  }  

  if (event.detail.data.startsWith("slider")){
    sliderValueArduino.innerHTML = event.detail.data.substring(6);
  }

  if (event.detail.data.startsWith("random")){
    randomValueArduino.innerHTML = event.detail.data.substring(6);
  }

  //gets stuff on connect
  //gets serial number
  if (event.detail.data.startsWith("serNr:")){
    serialNumber.innerHTML = event.detail.data.substring(6);
  }

  if (event.detail.data.startsWith("fwVer:")){
    fwVersion.innerHTML = event.detail.data.substring(6);
  }
  

  if (event.detail.data.startsWith("connOK")){
    USBconnectionStatus.innerHTML = ("Connected!");
  }
}



function readRangeInput(event) {
  // send the range input's value out the serial port:
  
  webserial.sendSerial("setModeIO16:"+event.target.value+";");
}


function ledOn(event) {
  // this function is triggered with every keystroke in the input field.
  // listen for the enter key (keyCode = 13) and skip the rest of
  // the function if you get any other key:
  webserial.sendSerial("LED ON");
  
}

function ledOff(event) {
  // this function is triggered with every keystroke in the input field.
  // listen for the enter key (keyCode = 13) and skip the rest of
  // the function if you get any other key:
  webserial.sendSerial("LED OFF");
}

function getRandomValue(event) {
  // this function is triggered with every keystroke in the input field.
  // listen for the enter key (keyCode = 13) and skip the rest of
  // the function if you get any other key:
  webserial.sendSerial("random");
}


function connect(event) {

  webserial.sendSerial("startConf;");
}


// run the setup function when all the page is loaded:
document.addEventListener("DOMContentLoaded", setup);