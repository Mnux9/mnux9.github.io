#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27, 16, 2); // I2C address 0x27, 16 column and 2 rows


#define TXLED 4
#define RXLED 5
//Transmit/receive status (0=RX, 1=TX)
int trStatus = 0;

static String buffer;
//Default frequency in Hz (doesnt really matter JWST-X will change it anyways)
String freq = "00007000000";
//human frequency
String freqMHz = "07" ;
String freqHz = "00000" ;


void setup() {
  lcd.init(); // initialize the lcd
  lcd.backlight();

  Serial.begin(9600);
  //Serial.print(" "); for wokwi
  
  pinMode(TXLED, OUTPUT);
  pinMode(RXLED, OUTPUT);

  digitalWrite(TXLED, LOW);
  digitalWrite(RXLED, HIGH);

  lcd.clear();
  lcd.setCursor(1, 0);
  lcd.print("READY");
  lcd.setCursor(0, 1);
  lcd.print("Conn CAT");

}



void loop() {  
    while (Serial.available() > 0) {
        char rx = Serial.read();
        buffer += rx;
        if (rx != ';') { // THIS IS IMPORTANT!!! -M
            continue;
        }
        buffer.trim();
        
        //This is where the arduino anwsers the requests sent from WSJT-X
        //Static anwsers that dont change in my usecase (see kenwood ts-480 cat datasheet for more info)
        //Radio ID (TS-480) 
        if (buffer.equals("ID;")) {
            Serial.print("ID020;");
        }
        //Power status (Power ON)
        else if (buffer.startsWith("PS")) {
            Serial.print("PS1;");
            lcd.clear();
            lcd.print(freqMHz);
            lcd.print(",");
            lcd.print(freqHz);
            lcd.setCursor(0,1);
            lcd.print("MHz");
            lcd.setCursor(6,1);
            lcd.print("RX");
        }
        //Automatic status reporting (Disabled)
        else if (buffer.equals("AI;")) {
            Serial.print("AI0;");
        }
        //VFO B frequency
        else if (buffer.equals("FB;")) {
            Serial.print("FB00007000000;");
        }
        //Operating mode (USB)
        else if (buffer.equals("MD;")) {
            Serial.print("MD2;");
        }
        //DSP filtering bandwith (0)
        else if (buffer.equals("FW;")) {
            Serial.print("FW0000;");
        }

        //Dynamic anwsers that get changed
        //Radio status
        else if (buffer.equals("IF;")) {
            Serial.print("IF");
            Serial.print(freq);
            Serial.print("     +00000000002000000 ;");
        }
        //VFO A frequency
        else if (buffer.equals("FA;")) {
            Serial.print("FA");
            Serial.print(freq);
            Serial.print(";");
        }

    
        //This is where the arduino acknowledges commands frm WSJT-X    
        //WSJT-X wants to change the VFO A freq
        else if (buffer.startsWith("FA0")) {
            freq = buffer.substring(2,13);
            freqMHz = buffer.substring(5,7);
            freqHz = buffer.substring(7,12);
            lcd.setCursor(0,0);
            lcd.print(freqMHz);
            lcd.print(",");
            lcd.print(freqHz);
        }


        //TEST STUFF
        else if (buffer.startsWith("READ;")) {
            Serial.print(freqMHz);
            Serial.print(",");
            Serial.print(freqHz);
        }



        //Transmitt
        else if (buffer.equals("TX;")) {
            digitalWrite(RXLED, LOW);
            digitalWrite(TXLED, HIGH);
            trStatus = 1;            
            lcd.setCursor(6,1);
            lcd.print("TX");
        }
        //Receive
        else if (buffer.equals("RX;")) {
            digitalWrite(TXLED, LOW);
            digitalWrite(RXLED, HIGH);
            trStatus = 0; 
            lcd.setCursor(6,1);
            lcd.print("RX");
        }

        buffer = "";


        
    }
    

    
}