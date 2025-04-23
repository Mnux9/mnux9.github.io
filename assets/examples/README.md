<style>
w { color: White }
o { color: Orange }
g { color: Green }
</style>


# <w>5 channel I2C PWM switch

### Overview

This board connects over a the two wire I2C bus and provides a 5 PWM low side switches. This can be handy if you are running low on GPIO (eg. ESP8266) or just want a simple solution.



### USAGE

- ARDUINO - I made a super simple library for arduino:

  `\#include <Wire.h>`

  `int led = 9;         // the PWM pin the LED is attached to`

  `int brightness = 0;  // how bright the LED is`

  `int fadeAmount = 1;  // how many points to fade the LED by`

  `void setup(){`

    `Wire.begin(); // join i2c bus (address optional for master)`

  `}`

  `int channel = 1;`

  `int value = 0;`

  `String ch = "CH01";`

  `void loop(){`

    `Wire.beginTransmission(8); // transmit to device #4`

    `Wire.write(channel);`

    `Wire.write(brightness);`

    `Wire.endTransmission();    // stop transmitting`

    `Wire.beginTransmission(8); // transmit to device #4`

    `Wire.write(2);`

    `Wire.write(map(brightness, 0, 130, 130, 0));`

    `Wire.endTransmission();    // stop transmitting`

    `// change the brightness for next time through the loop:`

    `brightness = brightness + fadeAmount;`

    `// reverse the direction of the fading at the ends of the fade:`

    `if (brightness <= 0 || brightness >= 128) {`

  ​    `fadeAmount = -fadeAmount;`

    `}`

  `}`

- ESP Home (Home Assistant) - You can easily use it from ESP Home without any custom libraries:

### Component choice 

- IO expander - i wanted to use a purpose made I2C PWM expander however i couldn't find a suitable one so in the end i decided to use a WCH general purpose MCU and write my own firmware for it.

- for the mosfets i just used a few from modules i had lying on

  

### Circuitboard layout
As always i used kicad, however this being a circuit with a lot of repeating layout I got to utilize some of its more advanced features and plugins.

### <w>Applications 
- I connected it to a led strip light bar i and printed a magnetic mount for it so it can be mounted

</w>