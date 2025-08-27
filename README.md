## Otto LC Robotic Control Platform

##### This is a web application that will allow users to control the Otto LC robot that we designed based on the Otto LC robot platform. The web application was built using the SB Admin Bootstrap template. The web application uses Bluetooth Low Energy to allow the robot to connect to the web application allowing users to have control over the robot. The web application allows for:

- Direct control using the arrow keys on your keyboard.
- Dance Mode, where users can select a dance from a predefined list.
- Autonomous Mode, where the robot will perform self-guided obstacle-avoiding movements.
- Interrupt Mode, where the robot will do a short dance while in autonomous or direct control mode and will return to one of those two modes once the dance is finished.
- A status dashboard that will display different status data about the robot. This includes the mode the robot is in, light sensor status data from the robot, obstacles detected by the robot, and the emotional status of the robot. 

##### The goal of this project was to design a custom robotic platform that will allow users to control our Otto LC robot-Jerry. 

## Team Members
##### Corey Chang
##### Jefferson Charles

## Project Components

##### The project was built into two parts:

- Software for the web application for the control of the Otto LC robot-Jerry.
- Software that will be built to showcase the basic capabilities that the Otto LC robot is able to do.

##### The software that was created to allow users to control Jerry using the web application and to showcase the capabilites of the Otto LC-Jerry robot can be found in the `Jerry_Software` folder in the repository, and both were written in MicroPython. 

#### Otto LC Jerry Showcase Software:

##### The design of Jerry included a Photoresistor that will be responisble for when Jerry will do it's movements in the showcase program. If the room Jerry is in is dark, then the robot will do a certain gesture and display a certain emotion on the 8x8 LED Matrix included in the design of the robot. When the room Jerry is in is bright, then the robot will do it's walking and dancing movements along with displaying it's different emotions on the LED Matrix, and the robot will do emotional gestures. This program will be `Otto_LC_Jerry.py` in the `Jerry_Software` folder.

#### Otto LC Jerry Web Application Software:

##### This will be the MicroPython program that will allow users to connect to Jerry using Bluetooth Low Energy and control the robot using the web application. This program will be `Jerry_Software.py` in the `Jerry_Software` folder.

## Hardware Compatibility

##### The software we created for both parts of the project was designed to work on the Microcontrollers below:
- Raspberry Pi Pico W (Works with the web application program and the Otto LC movement showcase program)
- Raspberry Pi Pico H (Works only with the Otto LC movement showcase program)

#### Robot:
- Jerry: Based on the Raspberry Pi Pico Microcontrollers 

## Setup

##### This section will contain information on how to setup your environment for working with the robot. The instruction are shown below:

1. First, you have to install the Thonny Python IDE to work with the Otto LC Jerry robot to run MicroPython programs on the robot. You can download the IDE using this link: [Thonny](https://thonny.org/)
2. Once you have installed Thonny, you must make sure you downloaded the OttoDIYPython library zip file from below that contains all of the files that were built for the library. Note: Since the library was designed to run on the ESP8266 Microcontroller, some of the files had to be modified to work with the Pi Pico Microcontrollers. 
3. Next, you must setup MicroPython on the Raspberry Pi Pico H by downloading the MicroPython firmware file from this link: https://www.raspberrypi.com/documentation/microcontrollers/micropython.html
4. Once you are on the webpage, you must go down to where it says: `Download the correct MicroPython UF2 file for your board` and select Pico and that will download the MicroPython firmware file into your downloads folder.
5. Next, you have to connect the Raspberry Pi Pico H to your computer via USB while holding on to the BOOTSEL button on the board. This will open up the mass storage of the Pico where you will take the MicroPython firmware file that you just installed and put the file into the mass storage device of the Pico. After completing this, MicroPython should be setup on your Raspberry Pi Pico H board. Now when you go to the Thonny IDE, you should see the Raspberry Pi Pico as an option to choose for the COM port that is used for the Pico on the bottom right corner.
6. Now that you have MicroPython setup on your Raspberry Pi Pico H, you must open the file explorer for the Pico and bring the contents of the OttoDIYPython library that you downloaded earlier to the file explorer of the Pico. Before you continue, you must make sure that the contents of the folder is unzipped and able to be brought over to the file explorer of the Pico. To open up the file explorer of the Pico you must go to View -> Files. If you selected the com port of the Pico on the bottom right, you should see a split window that shows the file explorer of the directory that you are in in your local computer on top and the file explorer of the Pico on the bottom. Locate where you downloaded the OttoDIYPython library and you are going to select all of the files in that folder. With all of the files selected, right click and select `Upload to /` to bring all of the files of the library to the file explorer of the Pico. 
7. Now, you should be setup to start running the MicroPython Otto LC movement showcase program or the web application program on Jerry. Go to `Jerry_Software` and download the `Otto LC-Jerry.py` or the `Jerry_Software.py` program and bring the file to the file explorer of the Pico using the same method used for bringing the files of the Otto MicroPython library over from your local computer. Once that is completed, you should be ready to work with the Otto LC-Jerry robot.    

## Required Libraries
##### This is the library that will be needed to operate the robot:

- [OttoDIYPython](https://github.com/Jeffersonszn43/Otto-LC-Project/releases/download/v1.0.0/OttoLCMicroPythonLibrary.zip)

##### The files in the zip folder must be in the same directory as the MicroPython program that you are using for the Otto LC-Jerry robot. Instructions on how to bring the files over from your local file explorer to the file explorer of the Raspberry Pi Pico W or H can be found in the setup section above.

## Screenshot

##### The Otto LC - Max and Jerry robots
![image](https://github.com/Jeffersonszn43/Otto-LC-Project/blob/main/assets/img/Otto%20LC-Jerry.jpg)

## Acknowledgements

##### All of the software written and our Otto LC design are based off the OttoDIY, OttoDIYLib, OttoDIYPython, and the Otto LC robot platform and libraries below:

- [OttoDIY](https://www.ottodiy.com/)
- [OttoDIYLib](https://github.com/OttoDIY/OttoDIYLib)
- [OttoDIYPython](https://github.com/OttoDIY/OttoDIYPython)
- [Otto LC](https://hackaday.io/project/26244-otto-lc)