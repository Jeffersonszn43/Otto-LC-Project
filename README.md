## Otto LC Robotic Control Platform

##### This is a web application that will allow users to control the two Otto LC robots that we designed based on the Otto LC. The web application was built using the SB Admin Bootstrap template. The web application uses Bluetooth Low Energy to allow the robots to connect to the web application allowing users to have control over the robots. The web application allows for:

- Direct control using (W/A/S/D or arrow keys) on your keyboard.
- Dance Mode, where users can select a dance from a predefined list.
- Autonomous Mode, where the robots will perform self-guided obstacle-avoiding movements.
- Interrupt Mode, where the robots will do a short dance while in autonomous or direct control mode and will return to one of those two modes once the dance is finished.
- A status dashborad that will display different status data about the robots. This includes the mode the robots are, light sensor status data from Jerry, obstacle detection from the robots, and the emotional status of the robots. 

##### The goal of this project was to design a custom robotic platform that will allow users to control our Otto LC robots - Max and Jerry. 

## Team Members:
##### Corey Chang
##### Jefferson Charles

## Project Components:

##### The project was built into two parts:

- Software for the web application for the control of the two Otto LC robots - Max and Jerry.
- Software that will be built to showcase the basic capabilities that the Otto LC robot is able to do. This part will be included in the final products that will be used to help students learn more about engineering.

##### The main software for the robots can be found in the `Jerry_Software` and `Max_Software` directories in the repository. The software written for Jerry was written in MicroPython and the software under development for Max will be written in C++. The software that will allow users to have control over the two robots using the web application is completed for the Otto LC Jerry robot and the software for the Otto LC Max robot is under development. 

##### The design of Jerry included a Photoresistor that will be responisble for when Jerry will do its movements. If the room Jerry is in is dark, then the robot will do a certain gesture and display a certain emotion. When the room Jerry is in is bright, then the robot will do its walking and dancing movements along with displaying its different emotions with emotional gestures. 

## Hardware Compatibility:

##### The software we created for both parts of the project was designed to work on the Microcontrollers below:
- ESP32 NodeMCU 32s
- Raspberry Pi Pico W (For web application)
- Raspberry Pi Pico H (For Otto movements showcase)

#### Robots:
- Max: Based on the ESP32 NodeMCU 32s
- Jerry: Based on the Raspberry Pi Pico Microcontrollers 

## Setup:

#### Note: This section must have one or both of the robots wired and fully built to proceed with the steps below.

##### This section will contain information on how to setup your environment for working with the robots. This information will be included in the sections below:

#### Otto LC Max robot:

1. First, you must install Arduino Ide to run the web application or the robot movement showcase software for Max. You can download Arduino IDE using this link: [Arduino IDE](https://www.arduino.cc/en/software/) 
2. Then, you will need to install all of the required libraries below needed to flash and run the programs on the Otto LC Max robot. 
3. Once you have installed all of the libraries listed in the required libraries section below, you can now run either the web application code or the showcase demo code on Max.
4. Next, you must navigate to the `Max_Software` directory and download the `Otto LC-Max.ino` to run on Max. If you wish to work with the web application to control Max, you can download the `Max_Software.ino` file to control Max on the web application. 
5. Now, you can create a workspace in your Arduino IDE and run the program to have Max do it's fun movements. 

#### Otto LC Jerry robot:

1. First, you have to install the Thonny Python IDE to work with the Otto LC Jerry robot to run MicroPython programs on the robot. You can download the IDE using this link: [Thonny](https://thonny.org/)
2. Once you have installed Thonny, you must make sure you downloaded the OttoDIYPython library zip file from below that contains all of the files that were built for the library. Note: Since the library was designed to run on the ESP8266 Microcontroller, some of the files had to be modified to work with the Pi Pico Microcontrollers. 
3. Next, you must setup MicroPython on the Raspberry Pi Pico H by downloading the MicroPython firmware file from this link: https://www.raspberrypi.com/documentation/microcontrollers/micropython.html
4. Once you are on the webpage, you must go down to where it says: `Download the correct MicroPython UF2 file for your board` and select Pico and that will download the MicroPython firmware file into your downloads folder.
5. Next, you have to connect the Raspberry Pi Pico H to your computer via USB while holding on to the BOOTSEL button on the board. This will open up the mass storage of the Pico where you will take the MicroPython firmware file that you just installed and put the file into the mass storage device of the Pico. After completing this, MicroPython should be setup on your Raspberry Pi Pico H board. Now when you go to the Thonny IDE, you should see the Raspberry Pi Pico as an option to choose for the COM port that is used for the Pico on the bottom right corner.
6. Now that you have MicroPython setup on your Raspberry Pi Pico H, you must open the file explorer for the Pico and bring the contents of the OttoDIYPython library that you downloaded earlier to the file emplorer of the Pico. Before you continue, you must make sure that the contents of the folder is unzipped and able to be brought over to the file explorer of the Pico. To open up the file explorer of the Pico you must go to View -> Files. If you opened up the com port of the Pico on the bottom right, you should see a split window that shows the file explorer of the directory that you are in in your local computer on top and the file explorer of the Pico on the bottom. Locate where you downloaded the OttoDIYPython library and you are going to select all of the files in that folder. With all of the files selected, right click and select `Upload to /` to bring all of the files of the library to the file explorer of the Pico. 
7. Now, you should be setup to start running the MicroPython Otto showcase movement program on Jerry. Go to `Jerry_Software` and download the `Otto LC-Jerry.py` program and bring the file to the file explorer of the Pico using the same method used for bringing the files of the Otto MicroPython library over from your local computer. Once that is completed, you should be ready to work with the Otto LC Jerry robot.    

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

##### The files in the zip folder must be in the same directory as the Micropython program for the Otto LC Jerry robot. Instructions on how to bring the files over from your local file explorer to the file explorer of the Raspberry Pi Pico W or H can be found in the setup section above.

## Screenshots:

##### The Otto LC - Max and Jerry robots


## Acknowledgements:

##### All of the software written and our Otto LC designs are based off OttoDIYLib, OttoDIYPython, and Otto LC below:

- [OttoDIYLib](https://github.com/OttoDIY/OttoDIYLib)
- [OttoDIYPython](https://github.com/OttoDIY/OttoDIYPython)
- [Otto LC](https://hackaday.io/project/26244-otto-lc)