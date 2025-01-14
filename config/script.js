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

let confirmation;

let nrOfIO;


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

  //wifiSSID = document.getElementById("wifiSSID");

  // span for random value:
  randomValueArduino = document.getElementById("randomValueArduino");

  // span for incoming serial messages:
  timeSpan = document.getElementById("seconds");

  //serial number from html
  serialNumber = document.getElementById("serialNumber");

  fwVersion = document.getElementById("firmwareVersion");

  fwVersion = document.getElementById("firmwareVersion");

  //wifiStatus field from html
  ssidBox = document.getElementById("wifiSSID");

  //IP
  localIPtxt = document.getElementById("localIPtxt");

  //IP
  RSSItxt = document.getElementById("RSSItxt");

  //USB conn satus
  USBconnectionStatus = document.getElementById("USBconnectionStatus");

  const setModeIO16 = document.getElementById("modeIO16");
  setModeIO16.addEventListener("change", updateModeIO16);


  
  
  webserial = new WebSerialPort();
  if (webserial) {
    webserial.on("data", serialRead);
     // port open/close button:
     portButton = document.getElementById("portButton");
     portButton.addEventListener("click", openClosePort);

     //temp connect button
     connectButton = document.getElementById("connectButton");
     connectButton.addEventListener("click", connect);  

     WifiConnectButton = document.getElementById("WifiConnectButton");
     WifiConnectButton.addEventListener("click", WifiConnect);  

     saveButton = document.getElementById("saveButton");
     saveButton.addEventListener("click", saveConfig);  

     discardButton = document.getElementById("discardButton");
     discardButton.addEventListener("click", discardConfig); 
     //wifi connect button
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
  webserial.sendSerial("startConf;");
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
    //change serial number field
    serialNumber.innerHTML = event.detail.data.substring(6);
  }


  //listen for fimware version
  if (event.detail.data.startsWith("fwVer:")){
    fwVersion.innerHTML = event.detail.data.substring(6);
  }

  //listen for wifiSSID
  if (event.detail.data.startsWith("wifiSSID:")){
    ssidBox.value = event.detail.data.substring(9);

  }

  //listen for IP
  if (event.detail.data.startsWith("IP:")){
    localIPtxt.innerHTML = event.detail.data.substring(4);
    

  }

  //listen for RSSI
  if (event.detail.data.startsWith("RSSI:")){
    RSSItxt.innerHTML = event.detail.data.substring(6);

  }

  //listen for wifi SSID error
  if (event.detail.data.startsWith("errWifiSSID")){
    document.getElementById("wifiStatus").style.color = "rgb(255, 0, 0)";
    wifiStatus.innerHTML = ("no AP found");

  }

  if (event.detail.data.startsWith("errWifi")){
    document.getElementById("wifiStatus").style.color = "rgb(255, 0, 0)";
    wifiStatus.innerHTML = ("can't connect");

  }

  if (event.detail.data.startsWith("okWifiConn")){
    document.getElementById("wifiStatus").style.color = "rgb(0, 204, 34)";
    wifiStatus.innerHTML = ("connected");

  }




  //USB connok
  if (event.detail.data.startsWith("connOK")){
    document.getElementById("USBconnectionStatus").style.color = "rgb(0, 204, 34)";
    USBconnectionStatus.innerHTML = ("connected");
    
  }

  //get aviable io
  if (event.detail.data.startsWith("availableIO:")){
    //document.getElementById("USBconnectionStatus").style.color = "rgb(0, 204, 34)";
    //USBconnectionStatus.innerHTML = ("connected");

    nrOfIO = event.detail.data.substring(12);


    //debugonly
    document.getElementById("ioDbgAvi").innerHTML = nrOfIO;
    
    
  }


  // confirmation
  if (event.detail.data.startsWith("CFM")){
    confirmation = 1;
  }
}



function updateModeIO16(event) {
  // send the range input's value out the serial port:
  
  webserial.sendSerial("setModeIO16:"+event.target.value+";");
}

function connect(event) {

  webserial.sendSerial("startConf;");
}

async function WifiConnect(event) {

  webserial.sendSerial("wifiSSID:"+document.getElementById('wifiSSID').value+";");

  for (let i = 0; i < 5; i++) {//5 attempts for the device to give back confirmation about save, otherwise display error
    await sleep(500);
    //wifiStatus.innerHTML = ("saving SSID " + i);
    //if it gets confirmation debug field will be set
    if (confirmation == 1){
      wifiStatus.innerHTML = ("SSID SAVED!");
      confirmation == 0;
      break;

    }

  }

  webserial.sendSerial("wifiPWD:"+document.getElementById('wifiPass').value+";");

  for (let i = 0; i < 5; i++) {//5 attempts for the device to give back confirmation about save, otherwise display error
    await sleep(500);
    //wifiStatus.innerHTML = ("saving SSID " + i);
    //if it gets confirmation debug field will be set
    if (confirmation == 1){
      wifiStatus.innerHTML = ("Password SAVED!");
      confirmation == 0;
      break;

    }

  }
  wifiStatus.innerHTML = ("connecting...");
  webserial.sendSerial("wifiConnect;");
}

function saveConfig(event) {
  webserial.sendSerial("saveConf;");
}

function discardConfig(event) {
  webserial.sendSerial("discardConf;");
}

// function for sleep
function sleep(ms) {cc
  return new Promise(resolve => setTimeout(resolve, ms));
}

// run the setup function when all the page is loaded:
document.addEventListener("DOMContentLoaded", setup);