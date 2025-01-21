let hubSn = "\"001\"";
let fw = "\"0.1\"";
let termination = "NULL        }),";

let chaon = "&cha_switch_on,";

let hubAccessory = "HOMEKIT_ACCESSORY(.id=1, .category=homekit_accessory_category_bridge, .services=(homekit_service_t*[]) {        HOMEKIT_SERVICE(ACCESSORY_INFORMATION, .characteristics=(homekit_characteristic_t*[]) {            HOMEKIT_CHARACTERISTIC(NAME, \"mnux.xyz hub\"),            HOMEKIT_CHARACTERISTIC(MANUFACTURER, \"mnux.xyz\"),            HOMEKIT_CHARACTERISTIC(SERIAL_NUMBER, "+hubSn+"),            HOMEKIT_CHARACTERISTIC(MODEL, \"rev. A\"),            HOMEKIT_CHARACTERISTIC(FIRMWARE_REVISION, " +fw+ "),            HOMEKIT_CHARACTERISTIC(IDENTIFY, my_accessory_identify),            "+termination;

let switchAccessory = "HOMEKIT_ACCESSORY(.id=8, .category=homekit_accessory_category_switch, .services=(homekit_service_t*[]) {        HOMEKIT_SERVICE(ACCESSORY_INFORMATION, .characteristics=(homekit_characteristic_t*[]) {            HOMEKIT_CHARACTERISTIC(NAME, \"switch\"),            HOMEKIT_CHARACTERISTIC(IDENTIFY, my_accessory_identify),"
// this variable is synthesized like this : hubAccessory + all other accessories + termination

function synthesize(){
    textBox.innerHTML = ("connected");
    //var x = "hi";
    document.getElementById("textBox").value = (hubAccessory + switchAccessory + chaon +termination + termination);
}   