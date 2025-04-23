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