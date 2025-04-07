# Here is the software that will allow users to have control over the Otto LC robot(Jerry) using the web application.
# Written By: Corey Chang and Jefferson Charles

# Here are the libraries needed for the program
import otto9, time
from machine import Pin, PWM, ADC, I2C, SPI
import max7219
import bluetooth
import struct

# Here we are initializing the Servo and Buzzer pins
LeftLeg = 3
RightLeg = 7
LeftFoot = 12
RightFoot = 10
Buzzer =

# Here is where we are initializing and defining all of the pins of the sensors on the robot
LDR_Pin = ADC(28)  # ADC pin for the Photoresistor.

Trig_Pin = Pin(22, Pin.OUT) # Trigger pin on UltraSonic Distance Sensor.
Echo_Pin = Pin(21, Pin.IN)  # Echo pin on the UltraSonic Distance Sensor.

# Here we are setting up the SPI pins on the 8x8 LED Matrix
spi = SPI(0, baudrate=10000000, polarity=0, phase=0, sck=Pin(18), mosi=Pin(19))
cs = Pin(17, Pin.OUT)

matrix = max7219.Matrix8x8(spi, cs, 1)

# Here we are initially clearing the LED Matrix display
matrix.fill(0)
matrix.show()

# Here is where we are initializing the Otto LC robot (Jerry)
Jerry = otto9.Otto9()
Jerry.init(3, 7, 12, 10, True, Buzzer, 22, 21, 28)
Jerry.home()

# Here is where we are setting up BLE for the robot
ble = bluetooth.BLE()
ble.active(True)
DEVICE_NAME = "Jerry_BLE"
ble.config(gap_name=DEVICE_NAME)

def adv_payload(name):
    # Here we are creating an advertisement payload
    name_bytes = name.encode()
    return struct.pack("BB", len(name_bytes) + 1, 0x09) + name_bytes

ble.gap_advertise(100, adv_payload(DEVICE_NAME))

# Here are the functions that will be responsible for getting various sensor data
def light_levels():
    sensor_value = LDR_Pin.read_u16()  # Here we are reading the ADC value (0 - 65535)
    
    # Here we are showing the ADC value as a 12-bit scale (0 - 4095)
    sensor_value = sensor_value >> 4
    
    # Here we are computing the deazone that will be 5% from the sensor value of the light sensor
    deadzone = int(sensor_value * 0.05)
    
    # Here is the if statement that will show if the room is dark or not
    if sensor_value >= 56 + deadzone:
        print("It is dark in this room!")
    elif sensor_value <= 45 - deadzone:
        print("This room is bright!")

def get_distance ():
    # Here we are sending a 10us pulse to trigger the sensor
    Trig_Pin.low()
    time.sleep_us(2)
    Trig_Pin.high()
    time.sleep_us(10)
    Trig_Pin.low()
    
    # Here is where we are measuring the duration of the echo signal with a 30ms timeout
    duration = time_pulse_us(Echo_Pin, 1, 30000)
    
    # Here is a test to see if we get an echo signal
    if duration < 0:
        return -1
    
    # Here we are converting the echo signal to distance in cm using the speed of sound (343 m/s or 0.0343 cm)
    distance = (duration * 0.0343) / 2
    return distance

def status_emotions(emotion):
    # add logic on how the emotions will be displayed depending on the mode the robot is in
    # Here we are displaying different patterns that will correlate to emotions that Jerry will feel on the LED Matrix
    
    # Happy
    matrix.pixel(1,1,1)
    matrix.pixel(6,1,1)
    matrix.pixel(3,5,1)
    matrix.pixel(4,5,1)
    
    # Sad
    matrix.pixel(1,1,1)
    matrix.pixel(6,1,1)
    matrix.pixel(3,6,1)
    matrix.pixel(4,6,1)
    
    # Surprised (For when user does an interrupt)
    matrix.pixel(2,2,1)
    matrix.pixel(5,2,1)
    matrix.pixel(3,4,1)
    matrix.pixel(4,4,1)
    
    matrix.show()
    

# Add function for the buzzer to also display a robotic noise that will play sounds depending on the mode the robot is in
    
# Add functions for the different modes on the web application

# Add an obstacle avoidance function

# Add a BLE function that will communicate with the web application

# Add a way to show status conditions from here to the web application

# Implement in the while True loop how the code will operate to control the robot from the web application


