//----------------------------------------------------------------
//-- Otto All moves test
//-- Otto DIY invests time and resources providing open source code and hardware, 
//-- please support by purchasing kits from https://www.ottodiy.com/
//-- Make sure to have installed all libraries: https://github.com/OttoDIY/OttoDIYLib
//-----------------------------------------------------------------

//Edited by Corey Chang

#include <Otto.h>
Otto Max;  //This is Max!

#define LeftLeg 2
#define RightLeg 17
#define LeftFoot 4 
#define RightFoot 16 
#define Buzzer  5 

///////////////////////////////////////////////////////////////////
//-- Setup ------------------------------------------------------//
///////////////////////////////////////////////////////////////////
void setup(){
  Max.init(LeftLeg, RightLeg, LeftFoot, RightFoot, true, Buzzer); //Set the servo pins and Buzzer pin
  // Max.initMATRIX( DIN, CS, CLK, Orientation);
  Max.sing(S_connection); //Max wake up!
  Max.home();
    delay(50);
  Max.playGesture(OttoHappy);
}

///////////////////////////////////////////////////////////////////
//-- Principal Loop ---------------------------------------------//
///////////////////////////////////////////////////////////////////
void loop() { 
  Max.walk(2,1000,1); //2 steps, "TIME". IF HIGHER THE VALUE THEN SLOWER (from 600 to 1400), 1 FORWARD
  Max.walk(2,1000,-1); //2 steps, T, -1 BACKWARD 
  Max.turn(2,1000,1);//3 steps turning LEFT
  Max._tone(10, 3, 1);
  Max.bendTones (100, 200, 1.04, 10, 10);
    Max.home();
    delay(100);  
  Max.turn(2,1000,-1);//3 steps turning RIGHT 
  Max.bend (1,500,1); //usually steps =1, T=2000
  Max.bend (1,2000,-1);     
  Max.shakeLeg (1,1500, 1);
    Max.home();
    delay(100);
  Max.shakeLeg (1,2000,-1);
  Max.moonwalker(3, 1000, 25,1); //LEFT
  Max.moonwalker(3, 1000, 25,-1); //RIGHT  
  Max.crusaito(2, 1000, 20,1);
  Max.crusaito(2, 1000, 20,-1);
    delay(100); 
  Max.flapping(2, 1000, 20,1);
  Max.flapping(2, 1000, 20,-1);
    delay(100);        
  Max.swing(2, 1000, 20);
  Max.tiptoeSwing(2, 1000, 20);
  Max.jitter(2, 1000, 20); //(small T)
  Max.updown(2, 1500, 20);  // 20 = H "HEIGHT of movement"T 
  Max.ascendingTurn(2, 1000, 50);
  Max.jump(1,500); // It doesn't really jumpl ;P
  Max.home();
     delay(100); 
  Max.sing(S_cuddly);
  Max.sing(S_OhOoh);
  Max.sing(S_OhOoh2);
  Max.sing(S_surprise);
  Max.sing(S_buttonPushed);       
  Max.sing(S_mode1);        
  Max.sing(S_mode2);         
  Max.sing(S_mode3);  
  Max.sing(S_sleeping);
  Max.sing(S_fart1);
  Max.sing(S_fart2);
  Max.sing(S_fart3);
  Max.sing(S_happy);
  Max.sing(S_happy_short);                   
  Max.sing(S_superHappy);   
  Max.sing(S_sad);               
  Max.sing(S_confused);
  Max.sing(S_disconnection);
    delay(100);  
  Max.playGesture(OttoHappy);
  Max.playGesture(OttoSuperHappy);
  Max.playGesture(OttoSad);
  Max.playGesture(OttoVictory); 
  Max.playGesture(OttoAngry); 
  Max.playGesture(OttoSleeping);
  Max.playGesture(OttoFretful);
  Max.playGesture(OttoLove);
  Max.playGesture(OttoConfused);        
  Max.playGesture(OttoFart);
  Max.playGesture(OttoWave);
  Max.playGesture(OttoMagic);
  Max.playGesture(OttoFail);
    Max.home();
    delay(100);  
}
