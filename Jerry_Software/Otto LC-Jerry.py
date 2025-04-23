# Here is the software that will allow users to have control over the Otto LC robot(Jerry) using the web application.
# Written By: Corey Chang and Jefferson Charles

# Here are the libraries needed for the program
import otto9, time
from machine import Pin, ADC, time_pulse_us
import bluetooth
import struct
import ujson
from micropython import const

# Here we are initializing the Servo and Buzzer pins
LeftLeg = 3
RightLeg = 7
LeftFoot = 12
RightFoot = 10
Buzzer = 20

# Here is where we are initializing and defining all of the pins of the sensors on the robot
LDR_Pin = ADC(28)  # ADC pin for the Photoresistor.

Trig_Pin = Pin(22, Pin.OUT) # Trigger pin on UltraSonic Distance Sensor.
Echo_Pin = Pin(21, Pin.IN)  # Echo pin on the UltraSonic Distance Sensor.

# Here we are initializing the 8x8 LED Matrix that will be used for displaying the different emotions of the robot.
Din = 19
SCLK = 18
CS = 17

# This is the orientation on the 8x8 LED Matrix. This will allow the LEDs on the Matrix to display things in a normal orientation on the robot.
Orientation = 3

# Here are the global variables needed
current_mode = "idle"
current_dance = "none"
previous_mode = "idle"
mode = None
autonomous_state = 0

# This global variable is responsible for storing the connection handle when the device made a connection over Bluetooth
conn_handle = None

# Here we are defining the variables for the BLE IRQ constants that will have important events that will happen between the robot and the web application
_IRQ_CENTRAL_CONNECT = const(1)
_IRQ_CENTRAL_DISCONNECT = const(2)
_IRQ_GATTS_WRITE = const(3)

# Here is where we are initializing the Otto LC Robot (Jerry) along with the 8x8 LED Matrix
Jerry = otto9.Otto9()
Jerry.init(3, 7, 12, 10, True, 20, 22, 21, 19)
Jerry.initMATRIX(Din, CS, SCLK, Orientation)
Jerry.home()

# Add a part here that makes Jerry do the connected buzzer sound when the user connects to Jerry
# Here is where we are setting up BLE for the robot
ble = bluetooth.BLE()
ble.active(True)
DEVICE_NAME = "Jerry_BLE"
ble.config(gap_name=DEVICE_NAME)


def adv_payload(name):
    # Here we are creating an advertisement payload
    name_bytes = name.encode()
    return struct.pack("BB", len(name_bytes) + 1, 0x09) + name_bytes

# Here is where we are setting up the BLE service
SERVICE_UUID = bluetooth.UUID("fb483dbf-6b8d-4719-9290-624ec26d8bf3")
CHARACTERISTIC_UUID = bluetooth.UUID("5c79fdd4-8db4-4d78-8122-04a67455f527")

# This will be a tuple of registered services. This will also allow us to send notification data from the web application. 
service = ble.gatts_register_services(((SERVICE_UUID, ((CHARACTERISTIC_UUID, bluetooth.FLAG_WRITE | bluetooth.FLAG_NOTIFY),)),))

# Here is where we are properly unpacking data
((handle,),) = service

# Here is a function that will handle the connection and disconnection to the robot from the web application.
def bt_irq(event, data):
    global conn_handle, mode
    if event == _IRQ_CENTRAL_CONNECT:
        conn_handle = data[0]  # Here is where we are saving the connection handle after the connection is made via Bluetooth
        print("Connected!, conn_handle =", conn_handle)  # Status data debugging
        Jerry.sing(0)
        time.sleep_ms(500)
        Jerry.playGesture(1)
        time.sleep_ms(500)
        Jerry.home()
    elif event == _IRQ_CENTRAL_DISCONNECT:
        conn_handle = None # Here we are resetting the connection handle
        Jerry.sing(1)
        time.sleep_ms(500)
        Jerry.playGesture(2)
        time.sleep_ms(500)
        Jerry.home()
        
        # Here we are advertising Jerry for users to reconnect to if they get disconnected to Jerry.
        ble.gap_advertise(100, adv_payload(DEVICE_NAME))
    # This means we are saving the commands coming from the web application to a variable that     
    elif event == _IRQ_GATTS_WRITE:
        mode = ble.gatts_read(handle).decode().strip()

ble.irq(bt_irq)

# Here is the start of where users able to see and connect to jerry after 100us.
ble.gap_advertise(100, adv_payload(DEVICE_NAME))


# Here are the functions that will be responsible for the functionalities of the sensors.
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

# Function responsible for displaying the emotions of the robot on the 8x8 LED Matrix
def status_emotions(emotion):
    if emotion == "happy": 
        Jerry.putMouth(10)
    elif emotion == "surprise": 
        Jerry.putMouth(14)
    elif emotion == "happyopen": 
        Jerry.putMouth(11)
        Jerry.playGesture(1)
    elif emotion == "angry":  
        Jerry.putMouth(30)
    elif emotion == "smallsurprise": 
        Jerry.putMouth(15)
    

# Function that will be used to play status noises depending the robot's emotion
def buzzer_status(status_noise):
    if status_noise == "Happy": 
        Jerry.sing(7)
    elif status_noise == "Surprise": 
        Jerry.sing(2)
    elif status_noise == "superhappy":
        Jerry.sing(8)
    elif status_noise == "Angry": 
        Jerry.sing(4)
    elif status_noise == "SmallSurprise":
        Jerry.sing(17)

# Function that will allow the robot to implement obstacle avoidance in direct control and autonomous mode.
def obstacle_avoidance(status_only=False):
    detected_object = get_distance()
    
    if detected_object != -1 and detected_object <= 30:
        # This makes sure that the function will correctly send this string as status data for the dashboard
        if status_only:
            return "Object in front of me"
        
        Jerry.putMouth(20)
        Jerry.playGesture(5)
        time.sleep_ms(500)
        #Make Jerry turn another direction and let the user continue to control it using direct control or autonomous mode.
        Jerry.turn(2, 1000, 1)
        time.sleep_ms(500)
        #print("Object in front of me!")
    else:
        if status_only:
            return "No object in front of me"
    
    # This makes sure a string is also sent as status data to avoid "None" breaking the BLE connection
    if status_only:
        return "No object in front of me"
        
                
       
# Functions for the different modes on the web application
def direct_control(command):
    if command == "forward":
        obstacle_avoidance()
        Jerry.walk(2, 1200, 1)
        
    elif command == "left":
        obstacle_avoidance()
        Jerry.turn(2, 1200, 1)
        
    elif command == "right":
        obstacle_avoidance()
        Jerry.turn(2, 1200, -1)
        
    elif command == "stop":
        Jerry.home()

def dance_mode(dance_name):
    Dance_Name = dance_name.lower().replace(" ", "")
    global current_dance
    
    current_dance = Dance_Name
    
    if Dance_Name == "moonwalker":
        Jerry.moonwalker(4, 1000, 25, 1)
        Jerry.moonwalker(4, 1000, 25, -1)
    elif Dance_Name == "crusaito":
        Jerry.crusaito(3, 1000, 20, 1)
        Jerry.crusaito(3, 1000, 20, -1)
    elif Dance_Name == "flapping":
        Jerry.flapping(3, 1000, 20, 1)
        Jerry.flapping(3, 1000, 20, -1)
    elif Dance_Name == "tiptoeswing":
        Jerry.tiptoeSwing(3, 1000, 20)

def autonomous_mode():
    
    global autonomous_state
    
    if autonomous_state == 0:
        obstacle_avoidance()

        Jerry.walk(10, 1200, 1) # 10 steps forward
    elif autonomous_state == 1:
        Jerry.turn(2, 1200, 1) # Turning left
    elif autonomous_state == 2:
        Jerry.playGesture(11) # Victory gesture
    elif autonomous_state == 3:
        Jerry.walk(5, 1200, 1) # 5 steps forward
    elif autonomous_state == 4:
        Jerry.turn(2, 1200, -1) # Turning right
    elif autonomous_state == 5:
        Jerry.playGesture(11) # Victory gesture
    elif autonomous_state == 6:
        Jerry.walk(6, 1200, 1) # 6 steps forward
    elif autonomous_state == 7:
        Jerry.turn(2, 1200, -1) # Turning right
    elif autonomous_state == 8:
        Jerry.playGesture(11) # Victory gesture
    elif autonomous_state == 9:
        Jerry.playGesture(10) # Wave gesture
        Jerry.home()
        autonomous_state = -1
    
    autonomous_state += 1
    
def interrupt_mode():
    global current_mode, previous_mode
    
    previous_mode = current_mode
    current_mode = "interrupt"
    
    status_emotions("angry")
    buzzer_status("Angry")
    dance_mode("moonwalker")
    time.sleep_ms(400)
    current_mode = previous_mode
    
    
# Add a way to show status conditions from here to the web application
def show_status():
    status = {
        "mode": current_mode,
        "dance": current_dance,
        "light": light_levels() or "Unknown",
        "object": obstacle_avoidance(status_only=True) or "Unknown" # This makes sure that we are only getting the status string
    }
    
    
    if conn_handle is not None:
        try:
            status_data = ujson.dumps(status)
            print("Sending status payload:", status_data)  # Status data debugging
            ble.gatts_notify(conn_handle, handle, bytes(status_data, 'utf-8'))
        except Exception as e:
            print("Failed to send status over BLE", e)
            

# Here we are performing the corresponding actions when the user selects a mode on the web application
while True:
        
    if mode:
        command = mode.lower().replace(" ", "")
        # Here is the control logic where the robot will be in the different modes the web application offers depending on the mode chosen by the user.
        if command == "forward" or command == "left" or command == "right" or command == "stop":
            current_mode = "direct"
            status_emotions("happy")
            Jerry.sing("Happy")
            direct_control(command)
            
        elif mode == "autonomous":
            current_mode = "autonomous"
            status_emotions("smallsurprise")
            buzzer_status("SmallSurprise")
            autonomous_mode()
            current_mode = "idle"
            
        elif mode == "interrupt":
            current_mode = "interrupt"
            status_emotions("angry")
            buzzer_status("Angry")
            interrupt_mode()
            current_mode = "idle"
        else:
            current_mode = "dance"
            status_emotions("happyopen")
            buzzer_status("superhappy")
            dance_mode(command)
            current_mode = "idle"
        
        # Here we are resetting the variable to make sure that no commands comming from the user repeats
        command = None
    
            
    # Here is where the the status data of Jerry will be shown on the web application dashboard  
    show_status()
    
    # Here we have a 500ms delay in the loop
    time.sleep_ms(500)
    
