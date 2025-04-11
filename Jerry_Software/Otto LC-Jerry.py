# Here is the software that will allow users to have control over the Otto LC robot(Jerry) using the web application.
# Written By: Corey Chang and Jefferson Charles

# Here are the libraries needed for the program
import otto9, time
from machine import Pin, ADC, time_pulse_us
import bluetooth
import struct
import ujson

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

# Here is how the orientation will go on the 8x8 LED Matrix. This will allow the LEDs on the Matrix to display things in a normal orientation on the robot.
Orientation = 3

# Here is where we are initializing the Otto LC robot (Jerry)
Jerry = otto9.Otto9()
Jerry.init(LeftLeg, RightLeg, LeftFoot, RightFoot, True, Buzzer, Trig_Pin, Echo_Pin, Din)
Jerry.home()

# Add a part here that makes Jerry do the connected buzzer sound when the user connects to Jerry
# Here is where we are setting up BLE for the robot
ble = bluetooth.BLE()
ble.active(True)
DEVICE_NAME = "Jerry_BLE"
ble.config(gap_name=DEVICE_NAME)

# These will track the current state of Jerry
current_mode = "idle"
current_dance = "none"
previous_mode = "idle"


def adv_payload(name):
    # Here we are creating an advertisement payload
    name_bytes = name.encode()
    return struct.pack("BB", len(name_bytes) + 1, 0x09) + name_bytes

# Here is a function that will handle the connection and disconnection to the robot from the web application.
def bt_irq(event, data):
    if event == bluetooth.IRQ_CENTRAL_CONNECT:
        Jerry.sing(0)
        time.sleep_ms(500)
        Jerry.playGesture(1)
        time.sleep_ms(500)
        Jerry.home()
    elif event == bluetooth.IRQ_CENTRAL_DISCONNECT:
        Jerry.sing(1)
        time.sleep_ms(500)
        Jerry.playGesture(2)
        time.sleep_ms(500)
        Jerry.home()
        
        # Here we are advertising Jerry for users to reconnect to if they get disconnected to Jerry.
        ble.gap_advertise(100, adv_payload(DEVICE_NAME))

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
    
    # Here we will show if the room is dark or not
    return "It is dark in this room!" if sensor_value >= 56 + deadzone elif sensor_value <= 45 - deadzone "This room is bright!"
    

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
    if emotion == "happy":
        Jerry.putMouth(10)
    elif emotion == "sad":
        Jerry.putMouth(22)
    elif emotion == "surprise":
        Jerry.putMouth(14)
    elif emotion == "confused":
        Jerry.putMouth(20)
    elif emotion == "angry":
        Jerry.putMouth(30)
    

# Add function for the buzzer to also display a robotic noise that will play sounds depending on the mode the robot is in
def buzzer_status(status_noise):
    if status_noise == "happy":
        Jerry.sing(7)
    elif status_noise == "sad":
        Jerry.sing(10)
    elif status_noise == "surprise":
        Jerry.sing(2)
    elif status_noise == "confused":
        Jerry.sing(11)
    elif status_noise == "angry":
        Jerry.sing(4)
    elif status_noise == "connected":
        Jerry.sing(0)

# Add an obstacle avoidance function
def obstacle_avoidance():
    detected_object = get_distance()
    
    if detected_object != -1 and detected_object <= 30:
        Jerry.putMouth(20)
        Jerry.playGesture(5)
        time.sleep_ms(500)
        #Make Jerry turn another direction and let the user continue to control it using direct control or autonomous mode.
        Jerry.turn(2, 1000, 1)
        time.sleep_ms(500)
        print("Object in front of me!")
    else:
        print("No object in front of me.")
                
       
# Functions for the different modes on the web application
def direct_control(command):
    if command == "forward":
        Jerry.walk(5, 1200, 1)
        pass
    elif command == "left":
        Jerry.turn(3, 1200, 1)
        pass
    elif command == "right":
        Jerry.turn(3, 1200, -1)
        pass
    elif command == "stop":
        Jerry.home()

def dance_mode(dance_name):
    global currentDance
    
    currentDance = dance_name
    
    if dance_name == "moonwalker":
        Jerry.moonwalker(4, 1000, 25, 1)
        Jerry.moonwalker(4, 1000, 25, -1)
    elif dance_name == "crusaito":
        Jerry.crusaito(3, 1000, 20, 1)
        Jerry.crusaito(3, 1000, 20, -1)
    elif dance_mane == "flapping":
        Jerry.flapping(3, 1000, 20, 1)
        Jerry.flapping(3, 1000, 20, -1)
    elif dance_name == "tiptoeswing":
        Jerry.tiptoeSwing(3, 1000, 20)

def autonomous_mode():
    while current_mode == "autonomous":
        obstacle_avoidance()
        
        Jerry.walk(10, 1200, 1)
        time.sleep_ms(500)
        Jerry.turn(2, 1200, 1)
        time.sleep_ms(500)
        Jerry.playGesture(11)
        time.sleep(500)
        Jerry.walk(5, 1200, 1)
        time.sleep_ms(500)
        Jerry.turn(2, 1200, -1)
        Jerry.playGesture(11)
        time.sleep_ms(500)
        Jerry.walk(6, 1200, 1)
        time.sleep_ms(500)
        Jerry.turn(2, 1200, -1)
        time.sleep_ms(500)
        Jerry.playGesture(11)
        time.sleep_ms(500)
        Jerry.playGesture(10)
        time.sleep_ms(500)
        Jerry.home()
    
def interrupt_mode():
    global current_mode, previous_mode
    
    previous_mode = current_mode
    
    current_mode = "interrupt"
    
    status_data = f"{current_mode},{light_levels()},{obstacle_avoidance()},dancing"
    ble.gatts_notify(0, handle, status_data.encode())
    
    dance_mode("moonwalker")
    
    time.sleep_ms(2000)
    
    current_mode = previous_mode
    
    status_data = f"{current_mode},{light_levels()},{get_distance()},{current_dance}"
    ble.gatts_notify(0, handle, status_data.encode())
    
    
# Add a BLE function that will communicate with the web application
def web_control(command):
    global current_mode, current_dance
    
    if command == "forward" or command == "left" or command == "right" or command == "stop":
        if command == "direct":
            direct_control(command)
    elif command.startswith("dance"):
        current_mode = "dance"
        dance_mode(command)
    elif command == "autonomous":
        current_mode = "autonomous"
        autonomous_mode()
    elif command == "interrupt":
        interrupt_mode()
    

# Add a way to show status conditions from here to the web application
def show_status():
    status = {
        "mode": current_mode,
        "dance": current_dance,
        "light": light_levels(),
        "obstacle detection": obstacle_avoidance()
    }
    
    status_data = ujson.dumps(status)
    
    if status_chracteristic is not None:
        try:
            status_chracteristic.notify(status_data)
        except:
            print("Staus failed to send over BLE.")
            
# Here is where we are setting up the service for status data
service_uuid = bluetooth.UUID("003f2c2b-53ce-4721-bff3-4b034f76ab2e")
characteristic_uuid = bluetooth.UUID("db926a24-90e2-48dc-8637-977763f66d43")

service = ble.gatts_register_services((
    (service_uuid, ( (characteristic_uuid, bluetooth.FLAG_WRITE), )),
))

handle = service[0][1][0]

def bt_rx_callback(event, data):
    value = ble.gatts_read(handle).decode("utf-8")
    web_control(value)

ble.gatts_set_buffer(handle, 100)
ble.irq(bt_rx_callback)

# Implement in the while True loop how the code will operate to control the robot from the web application
while True:
    # implement further logic here
    show_status()
    

