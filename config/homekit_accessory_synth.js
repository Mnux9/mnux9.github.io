let hubSn = "\"001\"";
let fw = "\"0.1\"";
let termination = "NULL        }),";

let chaon = "&cha_switch_on,";


// "\" backslashes are not included in the final output
let hubAccessory = "HOMEKIT_ACCESSORY(.id=1, .category=homekit_accessory_category_bridge, .services=(homekit_service_t*[]) {\
        HOMEKIT_SERVICE(ACCESSORY_INFORMATION, .characteristics=(homekit_characteristic_t*[]) {\
            HOMEKIT_CHARACTERISTIC(NAME, \"mnux.xyz hub i1\"),\
            HOMEKIT_CHARACTERISTIC(MANUFACTURER, \"mnux.xyz\"),\
            HOMEKIT_CHARACTERISTIC(SERIAL_NUMBER, \"0001\"),\
            HOMEKIT_CHARACTERISTIC(MODEL, \"i1revA\"),\
            HOMEKIT_CHARACTERISTIC(FIRMWARE_REVISION, \"0.1\"),\
            HOMEKIT_CHARACTERISTIC(IDENTIFY, my_accessory_identify),\
            NULL\
        }),\
        NULL\
        }),";


let thermometerAccessory = "HOMEKIT_ACCESSORY(.id=2, .category=homekit_accessory_category_sensor, .services=(homekit_service_t*[]) {\
        HOMEKIT_SERVICE(ACCESSORY_INFORMATION, .characteristics=(homekit_characteristic_t*[]) {\
            HOMEKIT_CHARACTERISTIC(NAME, \"Temperature Sensor\"),\
            HOMEKIT_CHARACTERISTIC(IDENTIFY, my_accessory_identify),\
            NULL\
        }),\
        HOMEKIT_SERVICE(TEMPERATURE_SENSOR, .primary=true, .characteristics=(homekit_characteristic_t*[]) {\
            HOMEKIT_CHARACTERISTIC(NAME, \"Temperature\"),\
            &cha_temperature,\
            NULL\
        }),\
        NULL\
        }),"

        
let switchAccessory = "HOMEKIT_ACCESSORY(.id=4, .category=homekit_accessory_category_switch, .services=(homekit_service_t*[]) {\
        HOMEKIT_SERVICE(ACCESSORY_INFORMATION, .characteristics=(homekit_characteristic_t*[]) {\
            HOMEKIT_CHARACTERISTIC(NAME, \"switch\"),\
            HOMEKIT_CHARACTERISTIC(IDENTIFY, my_accessory_identify),\
            NULL\
        }),\
        HOMEKIT_SERVICE(SWITCH, .primary=true, .characteristics=(homekit_characteristic_t*[]) {\
            HOMEKIT_CHARACTERISTIC(NAME, \"Switch\"),\
            &cha_switch_on,\
            NULL\
        }),\
        NULL\
        }),"




// this variable is synthesized like this : hubAccessory + all other accessories + termination

function synthesize(){
    textBox.innerHTML = ("connected");
    //var x = "hi";
    document.getElementById("textBox").value = (hubAccessory + thermometerAccessory + thermometerAccessory+switchAccessory+"NULL");
}   