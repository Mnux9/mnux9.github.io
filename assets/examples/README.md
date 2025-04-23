# 5 channel I2C PWM switch

### Overview

This board connects over a the two wire I2C bus and provides a 5 PWM low side switches. This can be handy if you are running low on GPIO (eg. ESP8266) or just want a simple solution.



### USAGE

- ARDUINO - I made a super simple library for arduino:

  `\#include <I2CPWM.h>`

  `//creates an expander called "myExpander"`

  `I2CPWM myExpander(8); // selects an expander connected on adress 8`

  `void setup(){`

    `// to set a PWM value:`

    `// myExpander.setPWM(channel, value);`

    `myExpander.setPWM(1,128); // sets channel 1 to 50% duty`

  `}`

  `void loop(){`

  `}`

- ESP Home (Home Assistant) - You can easily use it from ESP Home without any custom libraries:

### Component choice 

- IO expander - i wanted to use a purpose made I2C PWM expander however i couldn't find a suitable one so in the end i decided to use a WCH general purpose MCU and write my own firmware for it.

- for the mosfets i just used a few from modules i had lying on

  

### Circuitboard layout
As always i used kicad, however this being a circuit with a lot of repeating layout I got to utilize some of its more advanced features and plugins.

### <w>Applications 
- I connected it to a led strip light bar i and printed a magnetic mount for it so it can be mounted</w>