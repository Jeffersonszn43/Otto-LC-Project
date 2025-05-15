// Written by: Corey Chang and Jefferson Charles
// This program is responsible for providing all of the controls logic for Max (Robot 1) to interact with the web application.
// Note: Have to install the Adafruit SSD1306, OttoDIYLib, and the EspSoftwareSerial (ESP Board has to be version: 2.0.17, in the board manager) libraries.

//Here are the libraries needed to control Max (Robot 1).
#include <Otto.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>


Otto Max;   // This variable will be the object used for the movement commnds.

//Here are the servo and buzzer connection pins. 
#define LeftLeg 2
#define RightLeg 17
#define LeftFoot 4
#define RightFoot 16
#define Buzzer 4

// Pins for the Ultrasonic Distance Sensor (HC-SR04)
#define Triggerpin 14
#define Echopin 13

// Here are the UUIDs of the BLE service and characteristic.
#define service_uuid  "126b5985-42b7-42dc-8503-ce1ea5ab29d6"
#define characteristic_uuid  "292065c8-e04b-4b2a-807f-f9616a9dc230"

// Here are the global objects for the BLE service and characteristic
BLEServer *pserver = NULL;
BLECharacteristic *pcharacteristic = NULL;

void setup() 
{
  //put your setup code here, to run once:
  Max.init(LeftLeg, RightLeg, LeftFoot, RightFoot, true, Buzzer);
  Max.home();  // Puts the servos in the home position. 

}

void loop() 
{
  //put your main code here, to run repeatedly:
  Max.walk(4, 2000, 1);   // Otto will walk 2 steps forward forward for 2000ms.
  delay(1000);  // delay is in milliseconds.
  Max.walk(4, 2000, -1);  // Otto will walk 2 steps backward for 2000ms.
  delay(1000);
  Max.moonwalker(4, 2000, 25, 1);
  Max.home(); // To reset the servos.
}

