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

let connectionStatus;



let serialNumber;
let fwVersion;

let USBconnectionStatus;

let confirmation;

let nrOfIO;

let synth;

//import { sleep } from "/util/sleep";

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

  //serial number from html
  compilationDate = document.getElementById("compilationDate");

  //wifiStatus field from html
  ssidBox = document.getElementById("wifiSSID");

  //IP
  localIPtxt = document.getElementById("localIPtxt");

  //IP
  RSSItxt = document.getElementById("RSSItxt");

  //USB conn satus
  USBconnectionStatus = document.getElementById("USBconnectionStatus");

  const textInput = document.getElementById("wifiPass");
  textInput.addEventListener("keyup", readTextInput);


  //listen for IO mode changes
  const setModeIO10 = document.getElementById("modeIO10");
  setModeIO10.addEventListener("change", updateSettingsElements.bind(null, "IO10"));

  const setModeIO13 = document.getElementById("modeIO13");
  setModeIO13.addEventListener("change", updateSettingsElements.bind(null, "IO13"));

  const setModeIO12 = document.getElementById("modeIO12");
  setModeIO12.addEventListener("change", updateSettingsElements.bind(null, "IO12"));

  const setModeIO14 = document.getElementById("modeIO14");
  setModeIO14.addEventListener("change", updateSettingsElements.bind(null, "IO14"));

  const setModeIO16 = document.getElementById("modeIO16");
  setModeIO16.addEventListener("change", updateSettingsElements.bind(null, "IO16"));


  
  
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

     resetButton = document.getElementById("resetButton");
     resetButton.addEventListener("click", deviceReset);    

     homekitEraseButton = document.getElementById("homekitEraseButton");
     homekitEraseButton.addEventListener("click", homekitErase);    
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


  //reset device and put it into configuration mode
  
  deviceReset();
  await sleep(500);
  webserial.sendSerial("startConf;");


  
}

function serialRead(event) {
  readingsSpan.innerHTML += event.detail.data;
  readingsSpan.scrollTop = readingsSpan.scrollHeight 

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


  //listen for firmware version
  if (event.detail.data.startsWith("fwVer:")){
    fwVersion.innerHTML = event.detail.data.substring(6);
  }

  //listen for compilation date
  if (event.detail.data.startsWith("compDate:")){
    compilationDate.innerHTML = event.detail.data.substring(9);
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
    document.getElementById("USBconnectionStatus").style.color = "rgb(0, 204, 34)"; ioDbgAvi
    USBconnectionStatus.innerHTML = ("connected");
    connectionStatus = 1;
    
  }

  //get aviable io
  if (event.detail.data.startsWith("availableIO:")){
    //document.getElementById("USBconnectionStatus").style.color = "rgb(0, 204, 34)";
    //USBconnectionStatus.innerHTML = ("connected");

    nrOfIO = event.detail.data.substring(12);


    //debug only
    document.getElementById("ioDbgAvi").innerHTML = nrOfIO;
    
  }

  // confirmation
  if (event.detail.data.startsWith("CFM")){
    confirmation = 1;
  }
}



function updateSettingsElements(IOnr, event) {
  //console.log("updates" + this.options[this.selectedIndex].value);


  makeSettings(document.getElementById("mode" + IOnr).value, IOnr);
  
 
  //webserial.sendSerial("setModeIO16:"+event.target.value+";");
}


//universal function for generating settings elements (eg. is dimmable chekbox...) (settings generator)
function makeSettings(mode, IOnr){
  if(document.getElementById("SettingsDiv"+IOnr)){ //checks if "SettingsDiv"+IOnr exists and if yes removes it to clear
    document.getElementById("SettingsDiv"+IOnr).remove(); 
  }
  if(mode == "switch"){
    
    //display settings for a switch accessory
    // wipe the gray "unused" label
    //document.getElementById("unusedPlaceholder").innerHTML = "";

    document.getElementById("title"+IOnr).style.color = "white";

    const switchSettings = document.createElement("a");
    switchSettings.setAttribute("id", "SettingsDiv"+IOnr);
    //switchSettings.setAttribute("class", "checkBox");
    // Append the "checkbox" node to the list:
    document.getElementById("div"+IOnr).appendChild(switchSettings);

    //checkbox birth
    const checkBox = document.createElement("INPUT");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("class", "checkBox");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(checkBox);

    //checkbox description
    const checkBoxLabel = document.createElement("a");
    checkBoxLabel.innerText = "inverted";
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(checkBoxLabel);

    // on boot description
    const onBootLabel = document.createElement("a");
    onBootLabel.innerText = "on start";
    onBootLabel.setAttribute("class", "checkBox");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(onBootLabel);
    
    // drop down
    const onBootDropDown = document.createElement("select");
    onBootDropDown.innerText = "on Boot";
    onBootDropDown.setAttribute("class", "dropDown");
    onBootDropDown.setAttribute("id", "onBootDropDown");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(onBootDropDown); 

    //create test label
    const testLabel = document.createElement("a");
    testLabel.innerText = "test";
    testLabel.setAttribute("class", "");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(testLabel);

    //create on button
    const onButton = document.createElement("button");
    onButton.innerText = "on";
    onButton.setAttribute("class", "button");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(onButton);

    //create off button
    const offButton = document.createElement("button");
    offButton.innerText = "off";
    offButton.setAttribute("class", "button");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(offButton);
    
    //add things to dropbox
    let elmts = ["on", "off",];
    let select = document.getElementById("onBootDropDown");        

    // this adds options to the dropbox        
    for (let i = 0; i < elmts.length; i++) {
      let optn = elmts[i];
      let el = document.createElement("option");
      el.textContent = optn;
      el.value = optn;
      select.appendChild(el);
    }
    
    
  }




  if(mode == "light"){
        
    //display settings for a switch accessory
    // wipe the gray "unused" label
    //document.getElementById("unusedPlaceholder").innerHTML = "";

    document.getElementById("title"+IOnr).style.color = "white";

    const switchSettings = document.createElement("a");
    switchSettings.setAttribute("id", "SettingsDiv"+IOnr);
    //switchSettings.setAttribute("class", "checkBox");
    // Append the "checkbox" node to the list:
    document.getElementById("div"+IOnr).appendChild(switchSettings);

    //checkbox birth
    const dimmableCheckBox = document.createElement("INPUT");
    dimmableCheckBox.setAttribute("type", "checkbox");
    dimmableCheckBox.setAttribute("class", "checkBox");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(dimmableCheckBox);

    //checkbox description
    const dimmableDescription = document.createElement("a");
    dimmableDescription.innerText = "dimmable";
    dimmableCheckBox.setAttribute("id", "dimmableCheckBox");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(dimmableDescription);

    document.getElementById("dimmableCheckBox").addEventListener("click", deviceReset);  

    //dimmable checkbox birth
    const checkBox = document.createElement("INPUT");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("class", "checkBox");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(checkBox);

    //checkbox description
    const checkBoxLabel = document.createElement("a");
    checkBoxLabel.innerText = "inverted";
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(checkBoxLabel);

    // on boot description
    const onBootLabel = document.createElement("a");
    onBootLabel.innerText = "on start";
    onBootLabel.setAttribute("class", "checkBox");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(onBootLabel);
    
    // drop down
    const onBootDropDown = document.createElement("select");
    onBootDropDown.innerText = "on Boot";
    onBootDropDown.setAttribute("class", "dropDown");
    onBootDropDown.setAttribute("id", "onBootDropDown");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(onBootDropDown); 

    //create test label
    const testLabel = document.createElement("a");
    testLabel.innerText = "test";
    testLabel.setAttribute("class", "");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(testLabel);

    //create on button
    const onButton = document.createElement("button");
    onButton.innerText = "on";
    onButton.setAttribute("class", "button");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(onButton);

    //create off button
    const offButton = document.createElement("button");
    offButton.innerText = "off";
    offButton.setAttribute("class", "button");
    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(offButton);
    
    //add things to dropbox
    let elmts = ["on", "off",];
    let select = document.getElementById("onBootDropDown");        

    // this adds options to the dropbox        
    for (let i = 0; i < elmts.length; i++) {
      let optn = elmts[i];
      let el = document.createElement("option");
      el.textContent = optn;
      el.value = optn;
      select.appendChild(el);
    }

    const brightnessSlider = document.createElement("input");
    brightnessSlider.innerText = "off";
    brightnessSlider.setAttribute("type", "range");
    brightnessSlider.setAttribute("disabled", "");
    brightnessSlider.setAttribute("class", "slider");

    // Append the "checkbox" node to the list:
    document.getElementById("SettingsDiv"+IOnr).appendChild(brightnessSlider);
    
  }

  

  if(mode == "disabled"){
    document.getElementById("title"+IOnr).style.color = "rgba(204, 204, 204, 0.349)";
    //document.getElementById("unusedPlaceholder").innerHTML = "unused";   

  }

}
















function connect(event) {

  webserial.sendSerial("startConf;");
}

function deviceReset(event) {
  webserial.deviceReset();
}

async function WifiConnect(event) {

  webserial.sendSerial("wifiSSID:"+document.getElementById('wifiSSID').value+";");
  webserial.sendSerial("wifiSSID:"+document.getElementById('wifiSSID').value+";");


  webserial.sendSerial("wifiPWD:"+document.getElementById('wifiPass').value+";");


  wifiStatus.innerHTML = ("connecting...");
  webserial.sendSerial("wifiConnect;");
}

function saveConfig(event) {
  webserial.sendSerial("saveConf;");
}

function discardConfig(event) {
  webserial.sendSerial("discardConf;");
}

function homekitErase(event) {
  webserial.sendSerial("homekitErase;");
}


function readTextInput(event) {
  // this function is triggered with every keystroke in the input field.
  // listen for the enter key (keyCode = 13) and skip the rest of
  // the function if you get any other key:
  if (event.keyCode != 13) {
    return;
  }
  // if you do get an enter keyCode, send the value of the field
  // out the serial port:
  WifiConnect();
}

// function for sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// run the setup function when all the page is loaded:
document.addEventListener("DOMContentLoaded", setup);