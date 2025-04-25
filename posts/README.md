# 5 channel I2C PWM switch

<img src="../assets/images/garlics.jpeg"
     alt="Markdown Monster icon"
     style="float: left; margin-right: 10px;" />


### Overview
This board connects over a the two wire I2C bus and provides a 5 PWM low side switches. This can be handy if you are running low on GPIO (eg. ESP8266) or just want a simple solution.




### Usage
- Arduino - I made a super simple library for arduino:

```c++
//include the I2C PWM library you can download from mnux.xyz
#include <I2CPWM.h>

//creates an expander called "myExpander"
I2CPWM myExpander(8); // selects an expander connected on adress 8

void setup(){
  // to set a PWM value:
  // myExpander.setPWM(channel, value);
  myExpander.setPWM(1,128); // sets channel 1 to 50% duty
}

void loop(){
  
}
```


- ESP Home (Home Assistant) - You can easily use it from ESP Home without any custom libraries:

```yaml
i2c:
  sda: 4  # GPIO4
  scl: 5  # GPIO5
  scan: true

# Define the I2C device
i2c_device:
  - id: i2cdev
    address: 0x08  # Change to match your device address

# Create a light entity that uses our brightness output
light:
  - platform: monochromatic
    name: "I2C Brightness Light1"
    output: I2Cchannel1

    
    # Optional: Set default transition length for smooth brightness changes
    default_transition_length: 1s

  - platform: monochromatic
    name: "I2C Brightness Light2"
    output: I2Cchannel2
    
    # Optional: Set default transition length for smooth brightness changes


#I2C switch CHANNEL 1    
output:
  - platform: template
    id: I2Cchannel1
    type: float
    write_action:
      - lambda: |-
          float brightness = state * 255.0;  // Convert 0.0-1.0 to 0-255
          uint8_t brightness_byte = static_cast<uint8_t>(brightness);
          id(i2cdev).write_byte(0x01, brightness_byte);
#I2C switch CHANNEL 2    
  - platform: template
    id: I2Cchannel2
    type: float
    write_action:
      - lambda: |-
          float brightness = state * 255.0;  // Convert 0.0-1.0 to 0-255
          uint8_t brightness_byte = static_cast<uint8_t>(brightness);
          id(i2cdev).write_byte(0x02, brightness_byte);
```


### Component choice 

- IO expander - i wanted to use a purpose made I2C PWM expander however i couldn't find a suitable one so in the end i decided to use a WCH general purpose MCU and write my own firmware for it.

- for the mosfets i just used a few from modules i had lying on

  

### Circuitboard layout
As always i used kicad, however this being a circuit with a lot of repeating layout I got to utilize some of its more advanced features and plugins.

### Applications 
- I connected it to a led strip light bar i and printed a magnetic mount for it so it can be mounted</w>