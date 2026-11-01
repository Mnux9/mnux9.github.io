#include <Wire.h>
#include <MIDI.h>


// array where data if keys were pressed are stored
int KeysPressed[26]={0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, }; //module 1



// basically a translation table for notes
int MidiNr[26]={60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74 , 75 , 76 , 77, 78, 79, 80, 81 , 82, 83, 84, 85, };


// Simple tutorial on how to receive and send MIDI messages.
// Here, when receiving any message on channel 4, the Arduino
// will blink a led and play back a note for 1 second.

MIDI_CREATE_DEFAULT_INSTANCE();



void setup() {
  Wire.begin();
  Serial.begin(31250);
}

int ReadRegister(int RegisterNr, int Adress) {
  Wire.beginTransmission(Adress);
  Wire.write(RegisterNr);
  Wire.endTransmission(false);

  if (Wire.requestFrom(Adress, 1) == 1) {
    return Wire.read();
  }

  return -1;
}




void CheckAndPlayKey(int Key, int OctaveAddress, int shift) {
    int keyIndex = Key + shift;

    if (ReadRegister(Key, OctaveAddress) == 0) {
        if (KeysPressed[keyIndex] == 0) {
            KeysPressed[keyIndex] = 1;
            MIDI.sendNoteOn(MidiNr[keyIndex], 100, 1);
        }
    }
    else {
        if (KeysPressed[keyIndex] == 1) {
            KeysPressed[keyIndex] = 0;
            MIDI.sendNoteOff(MidiNr[keyIndex], 0, 1);
        }
    }
}




void loop() {
    //CheckAndPlayKey(1, 3); // Key, Adress of octave

    for (int i = 0; i <= 4; i++) { // Check keys 0-4 on first 5 key module adress 0x15
        CheckAndPlayKey(i, 0x15, 0);

    }


    for (int i = 0; i <= 6; i++) { // Check keys 0-6 on octave adress 0x15
        CheckAndPlayKey(i, 0x14, 5);

    }

    // second octave module
    for (int i = 0; i <= 4; i++) { // Check keys 0-6 on octave adress 0x15
        CheckAndPlayKey(i, 0x13, 12);

    }


    for (int i = 0; i <= 6; i++) { // Check keys 0-6 on octave adress 0x15
        CheckAndPlayKey(i, 0x12, 17);

    }


  // read C on first octave
 
    
}



