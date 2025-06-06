## Otto LC Robotic Control Platform

##### This is a web application that will allow users to control the two Otto LC robots that we designed based on the Otto LC. The web application was built using the SB Admin Bootstrap template. The web application uses Bluetooth Low Energy to allow the robots to connect to the web application allowing users to have control over the robots. The web application allows for:

- Direct control using (W/A/S/D or arrow keys) on your keyboard.
- Dance Mode, where users can select a dance from a predefined list.
- Autonomous Mode, where the robots will perform self-guided obstacle-avoiding movements.
- Interrupt Mode, where the robots will do a short dance while in autonomous or direct control mode and will return to one of those two modes once the dance is finished.

##### The goal of this project was to design a custom robotic platform that will allow users to control our Otto LC robots - Max and Jerry. 

## Team Members:
##### Corey Chang
##### Jefferson Charles

## Project Components:

##### The project was built into two parts:

- Designs for the web application for the control of the two Otto LC robots (Max and Jerry).
- Designs that will be built to showcase the basic capabilities that the Otto LC robot is able to do. This part will be included in the final products that will be used to help students learn more about engineering.

##### The software that will allow users to have control over the two robots using the web application is completed for the Otto LC Jerry robot and the software for the Otto LC Max robot is under development. The software development for the basic movements of the Otto LC robots (Max and Jerry) is completed for Jerry and is also under development for Max. 

## Hardware Compatibility:

##### The software we created for both parts of the project was designed to work on the Microcontrollers below:
- ESP32 NodeMCU 32s
- Raspberry Pi Pico W (For web application)
- Raspberry Pi Pico H

#### Robots:
- Max: Based on the ESP32 NodeMCU 32s
- Jerry: Based on the Raspberry Pi Pico Microcontrollers 

## Setup:

## Required Libraries:
##### These are the libraries that will be needed to operate both robots:

#### For the ESP32 NodeMCU 32s (Arduino IDE):

- `esp32` board version: 2.0.17 by Espressif Systems
- `Adafruit SSD1306` version: 2.5.13 
- `Adafruit GFX Library` version: 1.11.11
 
##### Here is the link to download the zip file needed to setup the ESP32Servo library in Arduino IDE: [ESP32Servo](https://github.com/Jeffersonszn43/Otto-LC-Project/releases/download/v3.0.6/ESP32Servo.zip)

##### Next, you will upload the zip file to Arduino IDE by going to Sketch -> Include Library -> then click on Add .ZIP Library. Then make sure in your Library Manager tab, you have the exact ESP32 servo library below:

- `ESP32Servo` version: 3.0.6 by Kevin Harrington, John K. Bennett
- `ESPSoftwareSerial` version: 8.1.0 
- `NewPing` version: 1.9.7
- `OttoDIYLib` version: 13.0.0

#### For the Raspberry Pi Pico Microcontrollers (Thonny):

- [OttoDIYPython](https://github.com/Jeffersonszn43/Otto-LC-Project/releases/download/v1.0.0/OttoLCMicroPythonLibrary.zip)

##### The files in the zip folder must be in the same directory as the Micropython program for the Otto LC (Jerry) robot. Instructions on how to bring the files over from your local file explorer to the file explorer of the Raspberry Pi Pico W or H can be found in the setup section above.

## Project Structure:

## Acknowledgements:
