# 5 channel I2C PWM switch
<img src="../assets/images/I2C PWM/IMG_1627.jpg"
     alt="Markdown Monster icon"
     style="float: left; margin-right: 10px; width:100%" />




### Overview
This board connects over a the two wire I2C bus and provides a 5 PWM low side switches. This can be handy if you are running low on GPIO (eg. ESP8266) or just want a simple solution.




### Usage
- Arduino - I made a super simple library for arduino: [Download](https://github.com/Mnux9/i2c-PWM-expander/tree/main/I2C-PWM-FIRMWARE)

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
    name: "channel 1"
    output: I2Cchannel1

  - platform: monochromatic
    name: "channel 2"
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

- MCU - I wanted to use a purpose made I2C PWM expander however i couldn't find a suitable one so in the end i decided to use a WCH general purpose MCU and write my own firmware for it. It is a really cheap mcu and comes in a simple to solder package so i choose it even tho i have never used it before.

- I used the D4814 mosfets which are cheap on ali.

- For the optocouplers i used a THT version because they have a smaller footprint than their SMD counterparts.

### Firmware
- I used the openwch core for arduino IDE and made a simple firmware. On start it check for the address jumpers and starts an i2c with the appropriate address. After that it just waits for i2c traffic which triggers a function that interprets the messages and sets PWM outputs.
- A big problem with my first time trying to program a WCH chip was that i had no idea there were multiple kinds of programmers. The one i bought was just a WCH-Link, however for the CH32v003 i need a WCH-Link*E*. Oh well I ordered the right one and just developed the code on an UNO in the mean time.

### Circuitboard layout
As always i used kicad, however this being a circuit with a lot of repeating layout I got to utilize some of its more advanced features and plugins.

### Mistakes
- This was my first time I used this microcontroller I expected there to be a few mistakes and ofc, on channels 2 and 4 i used a non PWM pins.
- For some reason I also swapped the SCL and SDA... lol
- While testing what component values to use and probing around, i noticed there is no voltage on the output + terminals (which there should be because the switching is done through the negative). Turns out i reversed the silkscreen on the input.

### Usecase
- I setup a second revision of my universal IOT board (now the IOT friend :3) with ESPHome on a top of my rack and connected this expander to it.
- Discovering that my Prusa 3D printer has support in home assistant i setup a little light for it which can blink once a print finishes.


<img src="../assets/images/I2C PWM/IMG_19062.jpg"
     alt="Markdown Monster icon"
     style="float: left; margin-left: 3%; margin-right: 3 %; width:45%" />

<img src="../assets/images/I2C PWM/IMG_1679.jpeg"
     alt="Markdown Monster icon"
     style="float: left; width:45%" />


### Conclusion
Even tho the end device isnt really that interesting i thought it was still worth it making a blog post about it because of all the little techniques used that i never used in any other project.
- As somebody who always used pre-made libraries for i2c devices it was very fun to learn how it works and make my own library.



### offtopic (blog update)
I have made this blog post into a mark down file which just embeds in HTML instead of just writing it in HTML like i used to. Sadly it kindof reminds me of the style how chat bots write (or one of my teachers exams who uses AI to make them).
So i wanted to say that I dont use any generative AI.