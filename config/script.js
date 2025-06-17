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
let heartBeatsLost = 0;
let heartBeatRun = 0;
let connectionStatus;
function setup() {
  // get the DOM elements and assign any listeners needed:
  // user text input:

  // user range input:
  const slider = document.getElementById("dim");
  slider.addEventListener("change", readRangeInput);

  // span for incoming serial messages:
  readingsSpan = document.getElementById("readings");

  // span for connectionLabel:
  connectionLabel = document.getElementById("connectionLabel");

  testShutterButton = document.getElementById("testShutterButton");


  // span for incoming serial messages:
  timeSpan = document.getElementById("seconds");
  
  webserial = new WebSerialPort();
  if (webserial) {
    webserial.on("data", serialRead);
     // port open/close button:
     portButton = document.getElementById("portButton");
     portButton.addEventListener("click", openClosePort);

     testShutterButton.addEventListener("click", testShutter);  
   }
}

async function closeSerial(params) {
  await webserial.closePort();
  let buttonLabel = "Open port";
  portButton.innerHTML = buttonLabel;
  document.getElementById("connectionLabel").style.color = "gray"; 
  connectionLabel.innerHTML = "Disconnected";
}


async function openClosePort() {
  // label for the button will change depending on what you do:
  let buttonLabel = "Open port";
  document.getElementById("connectionLabel").style.color = "gray"; 
  connectionLabel.innerHTML = "Disconnected";
  heartBeatRun = 0;
  // if port is open, close it; if closed, open it:
  if (webserial.port) {
    await webserial.closePort();
  } else {
    await webserial.openPort();
    buttonLabel = "Close port";
    webserial.sendSerial("ConnLT;"); //asking
  }
  // change button label:
  portButton.innerHTML = buttonLabel;
}

function serialRead(event) {
  readingsSpan.innerHTML = event.detail.data;

  //STUFF HERE HAPPENS ON SUCCESSFUL CONN
  if (event.detail.data.startsWith("LTConn;")){ //anwser
    connectionLabel.innerHTML = "Connected";
    heartBeatRun = 1;
    connectionStatus = 1;
    heartBeatsLost = 0;
    document.getElementById("connectionLabel").style.color = "rgb(0, 255, 42)"; 
    document.getElementById("testShutterButton").disabled=false;
  }

}


//heartbeat keeping
const interval = setInterval(function() {

  if (heartBeatRun==1){
    if (connectionStatus == 1){
      webserial.sendSerial("ConnLT;");
      connectionStatus = 0;
    }
    else{
      heartBeatsLost = heartBeatsLost +1;
      console.log("hearbeat not rxd");
      webserial.sendSerial("ConnLT;");
    }

    if (heartBeatsLost>3){
      console.log("hearbeat LOST!!!!");
      heartBeatRun = 0;
      closeSerial();
    }
  }
}, 400);


function readRangeInput(event) {
  // send the range input's value out the serial port:
  webserial.sendSerial(event.target.value);
}


function testShutter(){
  webserial.sendSerial("TriggerShutterNow;");
}


// run the setup function when all the page is loaded:
document.addEventListener("DOMContentLoaded", setup);

