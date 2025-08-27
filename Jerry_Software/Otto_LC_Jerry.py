# Here is the software that will have the control logic for the Otto LC robot(Jerry) for the Raspberry Pi Pico.
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
        return "dark"
        
    elif sensor_value <= 45 - deadzone:
        return "bright"
        
    
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
        # This will make Jerry walk back a little bit and turn once it detects an object in front of it
        Jerry.walk(2, 1000, -1)
        Jerry.turn(2, 1000, 1)
        time.sleep_ms(500)
    else:
        print("No object in front of me")
            

# Here are the functions for the main control logic for Jerry

# This function will be responsible for the movement options the robot can perform, while implementing obstacle avoidance
def jerry_movements():
    Jerry.walk(4, 1000, 1) # Walking forward
    time.sleep_ms(200)
    Jerry.walk(4, 1000, -1) # Walking backwards
    time.sleep_ms(200)
    Jerry.turn(2, 1000, 1) # Turning to the left
    time.sleep_ms(200)
    Jerry.turn(2, 1000, -1) # Turning to the right
    time.sleep_ms(200)
    Jerry.bend(1, 500, 1) # Bending the left foot
    time.sleep_ms(200)
    Jerry.bend(1, 2000, -1) # Bending the right foot
    time.sleep_ms(200)
    Jerry.home() # Makes the robot go to its default position
    time.sleep_ms(100)

# This function will be responsible for the robot dancing
def jerry_dances():
    Jerry.shakeLeg(1, 1500, 1) # Left
    Jerry.shakeLeg(1, 2000, -1) # Right
    Jerry.moonwalker(4, 1000, 25, 1) # Left
    Jerry.moonwalker(4, 1000, 25, -1) # Right
    Jerry.crusaito(3, 1000, 20, 1) # Left
    Jerry.crusaito(3, 1000, 20, -1) # Right
    time.sleep_ms(100)
    Jerry.flapping(3, 1000, 20, 1) # Left
    Jerry.flapping(3, 1000, 20, -1) # Right
    time.sleep_ms(100)
    Jerry.swing(3, 1000, 20)
    Jerry.tiptoeSwing(3, 1000, 20)
    Jerry.jitter(3, 1000, 20)
    Jerry.updown(3, 1500, 20)
    Jerry.ascendingTurn(3, 1000, 50)
    Jerry.jump(1, 2000)
    Jerry.home()
    time.sleep_ms(100)

# This function is responsible for sounds that the robot can produce
def jerry_sounds():
    Jerry.sing(0) # Connection sound
    Jerry.sing(1) # Disconnection sound
    Jerry.sing(3) # OHOOH sound
    Jerry.sing(18) # Buttonpressed sound

# This function is responsible for gestures performed by the robot
def jerry_gestures():
    Jerry.playGesture(0) # Happy gesture
    time.sleep_ms(600)
    Jerry.playGesture(2) # Sad gesture
    time.sleep_ms(600)
    Jerry.playGesture(11) # Victory gesture
    time.sleep_ms(600)
    Jerry.playGesture(3) # Sleeping gesture
    time.sleep_ms(600)

# This function is responsible for displaying the emotions of the robot
def jerry_emotions():
    Jerry.putMouth(10) # Smile emotion
    time.sleep_ms(700)
    Jerry.putMouth(11) # Happyopen emotion
    time.sleep_ms(700)
    Jerry.putMouth(22) # Sad emotion
    time.sleep_ms(700)
    Jerry.putMouth(20) # Confused emotion
    time.sleep_ms(700)    
    
# This loop will be responsible for 
while True:
    Jerry.home() # Sets the robot in its neutral position
    time.sleep(1)
    
    current_light = light_levels() # Here will be the light sensor values produced by the robot
    
    # If the room the robot is in is dark, then the robot will perform these actions instead
    if current_light == "dark":
        Jerry.putMouth(24) # Sadclosed emotion
        Jerry.sing(2) # Surprise sound
        Jerry.playGesture(5) # Confused gesture
        
    # If there is enough light in the room the robot is currently in, then it will perform its movements    
    elif current_light == "bright":
        # This function call is responsible for the implementation of obstacle avoidance on the robot
        obstacle_avoidance()
        
        jerry_movements()
        time.sleep(1)
        jerry_dances()
        time.sleep(1)
        jerry_sounds()
        time.sleep(1)
        jerry_gestures()
        time.sleep(1)
        jerry_emotions()
        time.sleep(1)
    
    # Here we have a 500ms delay in the loop
    time.sleep_ms(500)
    

