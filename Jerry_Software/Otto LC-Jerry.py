# Here is the software that will have the control logic for the Otto LC robot(Jerry).
# Written By: Jefferson Charles

# Here are the libraries needed for the program
import otto9, time
from machine import Pin, ADC, time_pulse_us

# Here we are initializing the Servo and Buzzer pins
LeftLeg = 3
RightLeg = 7
LeftFoot = 12
RightFoot = 10
Buzzer = 20

# Here is where we are initializing and defining all of the pins of the sensors on the robot
LDR_Pin = ADC(28)  # ADC pin for the Photoresistor.

Trig_Pin = Pin(22, Pin.OUT) # Trigger pin on Ultrasonic Distance Sensor.
Echo_Pin = Pin(21, Pin.IN)  # Echo pin on the Ultrasonic Distance Sensor.

# Here we are initializing the 8x8 LED Matrix that will be used for displaying the different emotions of the robot.
Din = 19
SCLK = 18
CS = 17

# This is the orientation on the 8x8 LED Matrix. This will allow the LEDs on the Matrix to display things in a normal orientation on the robot.
Orientation = 3

# Here is where we are initializing the Otto LC Robot (Jerry) along with the 8x8 LED Matrix.
# The values 1 and 2 are dummy values used to initalize the trigger and echo pins of the Ultrasonic Distance Sensor.
Jerry = otto9.Otto9()
Jerry.init(3, 7, 12, 10, True, 20, 1, 2, 19) 
Jerry.initMATRIX(Din, CS, SCLK, Orientation)
Jerry.home()

# This function is responsible for the light sensor integration on Jerry
def light_levels():
    sensor_value = LDR_Pin.read_u16()  # Here we are reading the ADC value (0 - 65535)
    
    # Here we are showing the ADC value as a 12-bit scale (0 - 4095)
    sensor_value = sensor_value >> 4
    
    # Here we are computing the deazone that will be 5% from the sensor value of the light sensor
    deadzone = int(sensor_value * 0.05)
    
    # Here we are observing the light levels of the room Jerry is in
    if sensor_value >= 56 + deadzone:
        return "It is dark in this room!"
    elif sensor_value <= 45 - deadzone:
        return "This room is bright!"
    
# This function will be responsible for getting the distance values of the distance sensor
def get_distance ():
    # Here we are sending a 10us pulse to trigger the sensor
    Trig_Pin.low()
    time.sleep_us(2)
    Trig_Pin.high()
    time.sleep_us(10)
    Trig_Pin.low()
    
    # Here is where we are measuring the duration of the echo signal with a 50ms timeout
    duration = time_pulse_us(Echo_Pin, 1, 50000)
    
    # Here is a test to see if we get an echo signal
    if duration < 0:
        print("There is an error in getting an echo signal.")
        return -1
    
    # Here we are converting the echo signal to distance in cm using the speed of sound (343 m/s or 0.0343 cm)
    distance = (duration * 0.0343) / 2
    return distance


# Function that will allow the robot to implement obstacle avoidance during its movements
def obstacle_avoidance():
    detected_object = get_distance()
    
    if detected_object != -1 and detected_object <= 30:
        print("Object in front of me")
        Jerry.putMouth(20)
        Jerry.playGesture(5)
        time.sleep_ms(500)
        # This will make Jerry turn once it detects an object in front of it
        Jerry.turn(2, 1000, 1)
        time.sleep_ms(500)
    else:
        print("No object in front of me")
    
    
# This function is responsible for displaying status data from Jerry
def show_status():
    light = light_levels() or "Unknown"
    
    # This print statement will print how the robot interprets the light levels in the room it is in
    print(light)
    
    # This function call is responsible for displaying the response of the robot when it encounters an obstacle
    obstacle_avoidance()
            

# Here we are performing the corresponding actions when the user selects a mode on the web application
while True:
    
    # Here is where the the status data of Jerry will be shown on the web application dashboard  
    show_status()
    
    # Here we have a 500ms delay in the loop
    time.sleep_ms(500)
    


