/*
  This code was developed by Corey Chang and Jefferson Charles.
  Inspiration:
  Ebedded System Disign:
  Professor:

1) Include all libaries that will be used in this code.
*/

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_GFX.h>
#include <Wire.h>
#include <Otto.h>
#include <NewPing.h>
/*
2) Begin initialization for all the Pin variable connections
   and object declaration from the library.
*/
#define LeftLeg 2
#define RightLeg 17
#define LeftFoot 4
#define RightFoot 16
#define Buzzer 5
#define TRIG_PIN 14
#define ECHO_PIN 13
#define MAX_DISTANCE 100

#define SERVICE_UUID "059c8d82-5664-4997-b54d-4d860bc5acf6"
#define CHARACTERISTIC_UUID "8649501e-f8be-4203-96a8-611c67fdecf2"

String current_mode = "idle";
String current_dance = "none";
//String obstacle_Detection ="none";

int autonomus_state =0;

bool connected = false;

BLEServer *pServer = NULL; //The BLE server (ESP32)
BLECharacteristic *pCharacteristic = NULL; //The BLE characteristics (data point client can read/write)
BLEDescriptor *pDescr_1;// Pointer to Descriptor of Characteristic 1
BLE2902 *pBLE2902_1;// Pointer to BLE2902 of Characteristic 1
bool deviceConnected = false;

Adafruit_SSD1306 display(128, 32, &Wire, -1); //Initializing display object for Display
NewPing sonar(TRIG_PIN, ECHO_PIN, MAX_DISTANCE);

Otto Max; //This initialize object as Max!

// --- BLE Callbacks ---
class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("Web App connected via BLE");
    Max.sing(S_connection);
  }

  void onDisconnect(BLEServer* pServer) {
    deviceConnected = false;
    Serial.println("Web App disconnected");
    Max.sing(S_disconnection);
    BLEDevice::startAdvertising();  // keep advertising
  }
};
void direct_Control(String cmd){
  if (cmd == "forward"){
    Max.walk(2,1000,1);
    delay(10);
  }
  else if (cmd == "left") {
    Max.turn(3,1000,1);//3 steps turning LEFT
    delay(10);
  }
  else if (cmd == "right") {
    Max.turn(3,1000,-1);//3 steps turning RIGHT
    delay(10);
  }
  else if (cmd == "stop") {
    Max.walk(2,1000,-1);
    delay(10);
  }
  Max.home();
}
// --- Dance Command from Web App ---
void dance_Mode(String cmd) {
  if (cmd == "Moon Walker") {
    current_mode = "dance";
    current_dance = "Moon Walker";
    updateDisplay();
    playStatusSound();
    Max.moonwalker(3, 1000, 25,1); //LEFT
    delay(10);
    Max.moonwalker(3, 1000, 25,-1); //RIGHT
    delay(10);
  } else if (cmd == "Crusaito") {
    current_mode = "dance";
    current_dance = "Crusaito";
    updateDisplay();
    playStatusSound();
    Max.crusaito(2, 1000, 20,1);
    delay(10);
    Max.crusaito(2, 1000, 20,-1);
    delay(10);
  } else if (cmd == "Flapping") {
    current_mode = "dance";
    current_dance = "Flapping";
    updateDisplay();
    playStatusSound();
    Max.flapping(2, 1000, 20,1);
    delay(10);
    Max.flapping(2, 1000, 20,-1);
    delay(10);
  } else if (cmd == "Tip Toe Swing") {
    current_mode = "dance";
    current_dance = "Tip Toe Swing";
    updateDisplay();
    playStatusSound();
    Max.tiptoeSwing(2, 1000, 20);
    delay(10);
  } else {
    current_mode = "idle";
    Max.home();
  }
  current_mode = "idle";
  updateDisplay(); //move this in if statements
  Max.home(); // try this spot for home.
  danceStatusToWeb();
}

// --- OLED Display Update ---
void updateDisplay() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Mode: " + current_mode);
  display.println("Dance: " + current_dance);
  display.display();
}

// --- Buzzer Status Sound ---
void playStatusSound() {
  if (current_mode == "dance") Max.sing(S_happy);
  else if (current_mode == "autonomous") Max.sing(S_surprise);
  else if (current_mode == "interrupt") Max.sing(S_confused);
  else Max.sing(S_connection);
}

// --- BLE Data Receive Handler ---
class MyCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    std::string rxValue = pCharacteristic->getValue();
    if (rxValue.length() > 0) {
      String cmd = String(rxValue.c_str());
      Serial.println("Command from Web: " + cmd);
      dance_Mode(cmd);
      direct_Control(cmd);
      autonomous_Mode();
      //interupt(cmd);
    }
  }
};

// --- Sensor Data Send ---
// void sendStatusToWeb() {
//   if (deviceConnected) {
//     int distance = sonar.ping_cm();
//     String data = "mode:" + current_mode + ";dance:" + current_dance + ";distance:" + String(distance);
//     pCharacteristic->setValue(data.c_str());
//     pCharacteristic->notify(); // Send update to client
//   }
// }

// --- Sensor Data Send ---
// void sensorStatusToWeb() {
//   if (deviceConnected) {
//     int distance = sonar.ping_cm();
//     String data = distance:"+ String(distance)";
//     pCharacteristic->setValue(data.c_str());
//     pCharacteristic->notify(); // Send update to client
//   }
// }

//Dance Data
void danceStatusToWeb() {
  if (deviceConnected) {
    String data = current_dance;
    pCharacteristic->setValue(data.c_str());
    pCharacteristic->notify(); // Send update to client
  }
}


// --- Obstacle Avoidance Logic ---
void autonomous_Mode() {
  int distance = sonar.ping_cm();
  if (distance > 0 && distance < 20) {
    Max.sing(S_surprise);
    delay(10);
    Max.playGesture(OttoConfused);
    delay(10);
    Max.walk(2, 1000, -1); // Move back
    delay(10);
    Max.turn(3, 1000, 1);  // Turn right
    delay(10);
  } else {
    Max.walk(1, 1000, 1);  // Walk forward
    delay(10);
    
  }
  //current_mode = "autonomus";
}



void setup() {
  Serial.begin(115200);

  // BLE
  BLEDevice::init("MAX");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService* pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE |
    BLECharacteristic::PROPERTY_NOTIFY
  );
  // Create a BLE Descriptor  
  pDescr_1 = new BLEDescriptor((uint16_t)0x2901);
  pDescr_1->setValue("A very interesting variable");
  pCharacteristic->addDescriptor(pDescr_1);

  // Add the BLE2902 Descriptor because we are using "PROPERTY_NOTIFY"
  pBLE2902_1 = new BLE2902();
  pBLE2902_1->setNotifications(true);                 
  pCharacteristic->addDescriptor(pBLE2902_1);

  pCharacteristic->setCallbacks(new MyCallbacks());
  pCharacteristic->setValue("Ready");
  pService->start();

  BLEAdvertising* pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);  // set value to 0x00 to not advertise this parameter
  BLEDevice::startAdvertising();
  Serial.println("Waiting a client connection to notify...");

  // Display
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  updateDisplay();

  // Otto Init
  Max.init(LeftLeg, RightLeg, LeftFoot, RightFoot, true, Buzzer);
  Max.home();
  Max.sing(S_connection);
}


void loop() {
  if (current_mode == "autonomous") {
    autonomous_Mode();
  }
  //sensorStatusToWeb();
  delay(1000);
}
