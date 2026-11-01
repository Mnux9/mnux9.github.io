#include "ch32fun.h"
#include "i2c_slave.h"
#include <stdio.h>

#define LED PC4

// this replaced #Define for each key so it can be read in a loop
int KeyMap[7]={PC0,PC3,PD7,PC4,PD6,PC6,PD5};

// The I2C slave library uses a one byte address so you can extend the size of this array up to 256 registers
// note that the register set is modified by interrupts, to prevent the compiler from accidently optimizing stuff
// away make sure to declare the register array volatile

volatile uint8_t i2c_registers[8 ] = {0x09}; // here you enter the number of registers you are using for some reason

void onWrite(uint8_t reg, uint8_t length) {
    // Called from the interrupt when an I2C write operation completes
    // Put one-off operations involving changes to i2c_registers here,
    // but you can also just read i2c_registers from main().
}

int main() {
    SystemInit();
    funGpioInitAll();

    // Initialize I2C slave
    funPinMode(PC1, GPIO_CFGLR_OUT_10Mhz_AF_OD); // SDA
    funPinMode(PC2, GPIO_CFGLR_OUT_10Mhz_AF_OD); // SCL
    SetupI2CSlave(0x14, i2c_registers, sizeof(i2c_registers), onWrite, NULL, false);


    // Set all keys as inputs with pullup
    for (int i = 0; i <= 6; i++){
        funPinMode(KeyMap[i], GPIO_CFGLR_IN_PUPD); 
        GpioOf(KeyMap[i])->OUTDR |= 1 << ((KeyMap[i]) & 0xf); 
    }

    // all registers set 0 at start
    for (int i = 0; i <= 6; i++) { // Put 00 to register 0-6
        i2c_registers[i] = 0x00;
    }

    //infinite loop
    while (1) {
        /*
        i2c_registers[1] = funDigitalRead(key1);
        i2c_registers[2] = funDigitalRead(key2);
        i2c_registers[3] = funDigitalRead(key3);
        i2c_registers[4] = funDigitalRead(key4);
        */

        for (int i = 0; i <= 6; i++) { // Put 00 to register 0-6
            i2c_registers[i] = funDigitalRead(KeyMap[i]);
        }
        
    }
}
