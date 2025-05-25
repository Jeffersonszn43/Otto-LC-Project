// This is the JavaScript code that is written to control the Otto LC Robots (Max and Jerry) with this robotic platform. 
//Written by: Jefferson Charles and Corey Chang

document.addEventListener("DOMContentLoaded", function () {
    // Here are global variables
    let currentMode = "none";   // Possibly have to change later when robot software is done
    let jerry_device = null;  // This will be the variable for the Bluetooth device for Max.
    let max_device = null;  // This will be the variable for the Bluetooth device for Jerry.
    let previousMode = "none"; // This will be the variable that holds the previous mode Otto was in when the user hits the interrupt button
    let jerry_characteristic = null;
    let max_characteristic = null;
    
    // Here are the variables for the UI elements on the webpage
    const connectButton = document.getElementById("connectButton");
    const disconnectButton = document.getElementById("disconnectButton");
    const connectButton1 = document.getElementById("connectButton1");
    const disconnectButton1 = document.getElementById("disconnectButton1");
    const connectButton2 = document.getElementById("connectButton2");
    const disconnectButton2 = document.getElementById("disconnectButton2");
    const firstconnectionStatus = document.getElementById("connectionStatus1");
    const secondconnectionStatus = document.getElementById("connectionStatus2");
    const connectionStatus = document.getElementById("connectionStatus");
    const direct_Control = document.getElementById("directControl");
    const dance_Mode = document.getElementById("danceMode");
    const autonomous_Mode = document.getElementById("autoMode");
    const interrupt_Mode = document.getElementById("interruptButton");
    const danceSelection = document.getElementById("danceSelection");
    const danceList = document.getElementById("danceList");
    const start_Dance = document.getElementById("startDance");
    const keyboardControl = document.getElementById("keyboardControl");
    const arrowControl = document.getElementById("arrowControl");
    const allControl = document.getElementById("allControl");


    // Here this function will hide certain information on the webpage when different modes are selected
    function hide ()
    {
      if (keyboardControl)
      {
        keyboardControl.style.display = "none";
      }
      else if(danceSelection)
      {
        danceSelection.style.display = "none";
      }
      else if (arrowControl)
      {
        arrowControl.style.display = "none";
      }
      else if (allControl)
      {
        allControl.style.display = "none";
      }
      
    }

    // This function is responsible for changing the current mode the robot is in to a new mode
    function changeMode (newMode)
    {
      currentMode = newMode;
    }

    // This function will be responsible for the BLE notifications of status data coming from Jerry. 
    function jerryStatusUpdate(event) 
    {
      try {
        const value = new TextDecoder().decode(event.target.value).trim();

        if (!value)
        {
          console.warn("The notifications coming from Jerry are empty.");
        } 
        
        const status =JSON.parse(value);
        console.log("Here are the BLE notifications coming from Jerry: ", status);

        if(status.light !== undefined)
        {
          updateStatus("light", status.light);
        }
        
        if (status.object !== undefined)
        {
          updateStatus("object", status.object);
        }  

        if (status.dance !== undefined)
        {
          updateStatus("dance", status.dance);
        }  

      } catch(e) {
        console.error("There was an error parsing the BLE notification coming from Jerry: ", e);
      }
    }

    // This function will be responsible for the BLE notifications of status data coming from Max.
    function maxStatusUpdate (event) 
    {
      try {
        const value = new TextDecoder().decode(event.target.value).trim();

        if (!value)
        {
          console.warn("The notifications coming from Max are empty.");
        } 
        
        const status =JSON.parse(value);
        console.log("Here are the BLE notifications coming from Max: ", status);

        // if(status.light !== undefined)
        // {
          // updateStatus("light", status.light);
        // }
        
        if (status.object !== undefined)
        {
          updateStatus("object", status.object);
        }  

        if (status.dance !== undefined)
        {
          updateStatus("dance", status.dance);
        }  

      } catch(e) {
        console.error("There was an error parsing the BLE notifications coming from Max: ", e);
      }

    }

    // Here is the the BLE connection logic where users are able to connect to the robots to interact with them using the web application
    if (window.location.href.includes("BothRobots.html"))
    {
      connectButton1.addEventListener("click", async function () {
        try {
            max_device = await navigator.bluetooth.requestDevice ({
              acceptAllDevices: true,
              optionalServices: ["126b5985-42b7-42dc-8503-ce1ea5ab29d6"],  
            });

            // Here is a check to see if the GATT server is already connected.
            if (!max_device.gatt.connect)
            {
              await max_device.gatt.connect();
            }   
            
            // Here is where we are going to set up the GATT server that will have a profile with a service that has characteristics that has the status data we need for the dashboard.
            const server = max_device.gatt;
            const service = await server.getPrimaryService("126b5985-42b7-42dc-8503-ce1ea5ab29d6");
            max_characteristic = await service.getCharacteristic("292065c8-e04b-4b2a-807f-f9616a9dc230");

            // Here is where we are subscribing to notifications (status data) coming from Max for the status dashboard.
            await max_characteristic.startNotifications();
            max_characteristic.addEventListener("characteristicvaluechanged", maxStatusUpdate);


            firstconnectionStatus.textContent = "Max Connection Status: Connected to Max";

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Connected to Max!"
            });
        }
        catch(error)
        {
          console.error("Connection Error: ", error);
          firstconnectionStatus.textContent = "Max Connection Status: There was an error connecting to Max!";
        }
      
      });

      connectButton2.addEventListener("click", async function () {
        try {
          jerry_device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ["fb483dbf-6b8d-4719-9290-624ec26d8bf3"],  // Here is the service UUID for Jerry
  
          });

          // Here is where we are going to set up the GATT server that will have a profile with a service that has characteristics that has the status data we need for the dashboard.
          const server = await jerry_device.gatt.connect();
          const service = await server.getPrimaryService("fb483dbf-6b8d-4719-9290-624ec26d8bf3");
          jerry_characteristic = await service.getCharacteristic("5c79fdd4-8db4-4d78-8122-04a67455f527");
          
          // Here is where we are subscribing to notifications (status data) coming from Jerry for the status dashboard.
          await jerry_characteristic.startNotifications();
          jerry_characteristic.addEventListener("characteristicvaluechanged", jerryStatusUpdate);
          
          secondconnectionStatus.textContent = "Jerry Connection Status: Connected to Jerry";

          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "Connected to Jerry!"
          });

        }
        catch(error)
        {
          console.error("Connection Error: ", error);
          secondconnectionStatus.textContent = "Jerry Connection Status: There was an error connecting to Jerry!";
        }


        
      });

      // Here will be the logic for users to disconnect from the two robots.
      disconnectButton1.addEventListener("click", async function () {
        try {
          if(max_device && max_device.gatt.connected)
            {
              max_device.gatt.disconnect();

              firstconnectionStatus.textContent = "Max Connection Status: Disconnected from Max";
              
              // This will be the alert letting users know that they disconnected from Max.
              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Disconnected from Max!"
              });

              // This will clear the status dashboard of the web application once the user disconnects from the robot.
              document.getElementById("modeStatus").textContent = "Mode:";
              document.getElementById("emotionStatus").textContent = "Emotional Status:";
              //document.getElementById("lightStatus").textContent = "Room Light Level:";
              document.getElementById("objectStatus").textContent = "Obstacle Detection:";
              document.getElementById("danceStatus").textContent = "Current Dance:";
            }

        }
        catch (error)
        {
          console.error("Connection Error: ", error);
          firstconnectionStatus.textContent = "Max Connection Status: There was an error connecting to Max!";

        }
      });

      disconnectButton2.addEventListener("click", async function () {
        try {
          if(jerry_device && jerry_device.gatt.connected)
          {
            jerry_device.gatt.disconnect();
            secondconnectionStatus.textContent = "Jerry Connection Status: Disconnected from Jerry";

            // This will be the alert letting users know that they disconnected from Jerry.
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Disconnected from Jerry!"
            });

            // This will clear the status dashboard of the web application once the user disconnects from the robot.
            document.getElementById("mode_Status").textContent = "Mode:";
            document.getElementById("emotion_Status").textContent = "Emotional Status:";
            document.getElementById("light_Status").textContent = "Room Light Level:";
            document.getElementById("object_Status").textContent = "Obstacle Detection:";
            document.getElementById("dance_Status").textContent = "Current Dance:";
          }

        }
        catch(error)
        {
          console.error("Connection Error: ", error);
          secondconnectionStatus.textContent = "Jerry Connection Status: There was an error connecting to Jerry!";

        }
      });

    }
    else
    {
      connectButton.addEventListener("click", async function () {
        try {

          if (window.location.href.includes("index.html"))
          {
            max_device = await navigator.bluetooth.requestDevice ({
              acceptAllDevices: true,
              optionalServices: ["126b5985-42b7-42dc-8503-ce1ea5ab29d6"],
            });

            // Here is a check to see if the GATT server is already connected.
            if (!max_device.gatt.connected)
            {
              await max_device.gatt.connect();
            }  

            const server = max_device.gatt;
            const service = await server.getPrimaryService("126b5985-42b7-42dc-8503-ce1ea5ab29d6");
            max_characteristic = await service.getCharacteristic("292065c8-e04b-4b2a-807f-f9616a9dc230");

            // Here is where we are subscribing to notifications (status data) coming from Max for the status dashboard.
            await max_characteristic.startNotifications();
            max_characteristic.addEventListener("characteristicvaluechanged", maxStatusUpdate);

            connectionStatus.textContent = "Max Connection Status: Connected to Max";

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Connected to Max!"
            });

          }
          else if (window.location.href.includes("Robot2.html"))
          {
            jerry_device = await navigator.bluetooth.requestDevice({
              acceptAllDevices: true,
              optionalServices: ["fb483dbf-6b8d-4719-9290-624ec26d8bf3"],  // Service UUID for Jerry
            });

            // Here is where we are going to set up the GATT server that will have a profile with a service that has characteristics that has the status data we need for the dashboard.
            const server = await jerry_device.gatt.connect();
            const service = await server.getPrimaryService("fb483dbf-6b8d-4719-9290-624ec26d8bf3");
            jerry_characteristic = await service.getCharacteristic("5c79fdd4-8db4-4d78-8122-04a67455f527");

            // Here is where we are subscribing to notifications (status data) coming from Jerry for the status dashboard.
            await jerry_characteristic.startNotifications();
            jerry_characteristic.addEventListener("characteristicvaluechanged", jerryStatusUpdate);
        
            connectionStatus.textContent = "Jerry Connection Status: Connected to Jerry";

            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Connected to Jerry!"
            });

          }

        }

        // Here is where we are getting error messages from the GATT server
        catch(error) 
        {
          console.error("Connection Error: ", error);
          if (window.location.href.includes("index.html"))
          {
            connectionStatus.textContent = "Max Connection Status: There was an error connecting to Max!";
          }
          else if (window.location.href.includes("Robot2.html"))
          {
            connectionStatus.textContent = "Jerry Connection Status: There was an error connecting to Jerry!";
          }
            
        }

      });

      // Here is where we are creating the disconnect button giving users the option to disconnect from Jerry.
      disconnectButton.addEventListener("click", async function () {
        try {
          if (window.location.href.includes("index.html"))
          {
            if(max_device && max_device.gatt.connected)
            {
              max_device.gatt.disconnect();

              connectionStatus.textContent = "Max Connection Status: Disconnected from Max";

              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Disconnected from Max!"
              });

              //
              // keyboardControl.style.display = "none";
              // danceSelection.style.display = "none";
              // arrowControl.style.display = "none";
              // allControl.style.display = "none";


              // This will clear the status dashboard of the web application
              document.getElementById("modeStatus").textContent = "Mode:";
              document.getElementById("emotionStatus").textContent = "Emotional Status:";
              //document.getElementById("lightStatus").textContent = "Room Light Level:";
              document.getElementById("objectStatus").textContent = "Obstacle Detection:";
              document.getElementById("danceStatus").textContent = "Current Dance:";
            }  
            

          }
          else if (window.location.href.includes("Robot2.html"))
          {
            if(jerry_device && jerry_device.gatt.connected)
            {
              jerry_device.gatt.disconnect();

              connectionStatus.textContent = "Jerry Connection Status: Disconnected from Jerry";

              const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.onmouseenter = Swal.stopTimer;
                  toast.onmouseleave = Swal.resumeTimer;
                }
              });
              Toast.fire({
                icon: "success",
                title: "Disconnected from Jerry!"
              });

              // This will clear the status dashboard of the web application
              document.getElementById("modeStatus").textContent = "Mode:";
              document.getElementById("emotionStatus").textContent = "Emotional Status:";
              document.getElementById("lightStatus").textContent = "Room Light Level:";
              document.getElementById("objectStatus").textContent = "Obstacle Detection:";
              document.getElementById("danceStatus").textContent = "Current Dance:";
            }           

          }    

        }
        catch (error)
        {
          console.error("Connection Error: ", error);
          if (window.location.href.includes("index.html"))
          {
            connectionStatus.textContent = "Max Connection Status: There was an error disconnecting from Max!";
          }
          else if (window.location.href.includes("Robot2.html"))
          {
            connectionStatus.textContent = "Jerry Connection Status: There was an error disconnecting from Jerry!";
          }
        }
      });

    }

    // This function is to make sure that the web application is connected with the robots before any modes can be used.
    function bluetoothCheck ()
    {
      if (!max_device && !jerry_device)
      {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "error",
          title: "You must be connected to one of the robots or both robots to select a mode!"
        });
        return false;
      }
      return true;
    }

    // Here is the different control logic for the different modes users are able to choose from
    direct_Control.addEventListener("click", function () {

      // Here we are making sure that the user is connected to the robots via Bluetooth
      if (!bluetoothCheck())
      {
        return;
      }

      hide ();
      currentMode = "direct";

      //This will hide certain information on the webpage that is meant to not be shown in this instance
      if (window.location.href.includes("index.html"))
      {
        keyboardControl.style.display = "block";
        danceSelection.style.display = "none";
      }
      else if (window.location.href.includes("Robot2.html"))
      {
        arrowControl.style.display = "block";
        danceSelection.style.display = "none";

      }
      else if (window.location.href.includes("BothRobots.html"))
      {
        allControl.style.display = "block";
        danceSelection.style.display = "none";

      }

      updateStatus("mode", "Direct Control");
      updateStatus("emotion", "Happy"); 

      // Here is the toastr alert letting users know that they selected direct control mode
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Direct control mode was activated!"
      });

    });

    dance_Mode.addEventListener("click", function () {
      //Here we are making sure that the user is connected to the robots via Bluetooth
      if (!bluetoothCheck())
      {
        return;
      }

      hide ();
      currentMode = "dance";

      //This will hide certain information on the webpage that is meant to not be shown in this instance
      if (window.location.href.includes("index.html"))
      {
        keyboardControl.style.display = "none";
        danceSelection.style.display = "block";

      }
      else if (window.location.href.includes("Robot2.html"))
      {
        arrowControl.style.display = "none";
        danceSelection.style.display = "block";

      }
      else if (window.location.href.includes("BothRobots.html"))
      {
        allControl.style.display = "none";
        danceSelection.style.display = "block";

      }
      
      updateStatus("mode", "Dance");
      updateStatus("emotion", "Happy Open");

      // Here is the toastr alert letting users know that they selected dance control mode
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Dance mode was activated!"
      });

    });

    autonomous_Mode.addEventListener("click", function () {
      // Here we are making sure that the user is connected to the robots through Bluetooth
      if (!bluetoothCheck())
      {
        return;
      }

      hide ();
      currentMode = "autonomous";

      //This will hide certain information on the webpage that is meant to not be shown in this instance
      if (window.location.href.includes("index.html"))
      {
        keyboardControl.style.display = "none";
        danceSelection.style.display = "none";

      }
      else if (window.location.href.includes("Robot2.html"))
      {
        arrowControl.style.display = "none";
        danceSelection.style.display = "none";

      }
      else if (window.location.href.includes("BothRobots.html"))
      {
        allControl.style.display = "none";
        danceSelection.style.display = "none";

      }

      updateStatus("mode", "Autonomous");
      updateStatus("emotion", "Small Surprise");

      // Here we are sending the autonomous mode command specifically to Max.
      sendCommand("autonomous", 1);

      // Here we are sending the autonomous mode command specifically to Jerry.
      sendCommand("autonomous", 2);

      // Here is the toastr alert letting users know that they selected autonomous mode
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      Toast.fire({
        icon: "success",
        title: "Autonomous mode was activated!"
      });
    });

    interrupt_Mode.addEventListener("click", async function () {
      // Here we are making sure that the user is connected to the robots via Bluetooth
      if (!bluetoothCheck())
      {
        return;
      }

      // This if/else statement will be resopnsible for giving the user the option to make the robot dance while in direct control or autonomous mode
      if (currentMode === "direct" || currentMode === "autonomous")
      {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "success",
          title: "Interrupt mode was activated!"
        });

        previousMode = currentMode;
        changeMode("interrupt");
        updateStatus("mode", "Interrupt");
        updateStatus("emotion", "Angry");

        //This will hide certain information on the webpage that is meant to not be shown in this instance
        if (window.location.href.includes("index.html"))
        {
          keyboardControl.style.display = "none";
          danceSelection.style.display = "none";
  
        }
        else if (window.location.href.includes("Robot2.html"))
        {
          arrowControl.style.display = "none";
          danceSelection.style.display = "none";
  
        }
        else if (window.location.href.includes("BothRobots.html"))
        {
          allControl.style.display = "none";
          danceSelection.style.display = "none";

        }

        // Here we are sending the interrupt mode command to Max.
        sendCommand("interrupt", 1);

        // Here we are sending the interrupt mode command to Jerry.
        sendCommand("interrupt", 2);

        setTimeout(() => {

          if (previousMode === "direct")
          {
            changeMode("direct");

            // These are responsible for returning the status dashboard information to what it was before the interrupt.
            updateStatus("mode", "Direct Control");
            updateStatus("emotion", "Happy"); 

            // This line is to clear the dance performed before going back to the previous mode.
            document.getElementById("danceStatus").textContent = "Current Dance:";

            if (window.location.href.includes("index.html"))
            {
              keyboardControl.style.display = "block";
            }
            else if (window.location.href.includes("Robot2.html"))
            {
              arrowControl.style.display = "block";
            }
            else if (window.location.href.includes("BothRobots.html"))
            {
              allControl.style.display = "block";
            }
            // Toastr alert letting users know what mode the robot is returning back to
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: `Returning back to ${previousMode} control mode.`
            });
          }
          else if (previousMode === "autonomous")
          {
            changeMode("autonomous");

            // These are responsible for returning the status dashboard information to what it was before the interrupt.
            updateStatus("mode", "Autonomous");
            updateStatus("emotion", "Small Surprise");

            // This line is to clear the dance performed before going back to the previous mode.
            document.getElementById("danceStatus").textContent = "Current Dance:";

            // Here we are sending the autonomous mode command to Max to make sure Max is back in that mode after the interrupt dance.
            sendCommand("autonomous", 1);

            // Here we are sending the autonomous mode command to Jerry to make sure Jerry is back in that mode after the interrupt dance.
            sendCommand("autonomous", 2);

            if (window.location.href.includes("index.html"))
            {
              keyboardControl.style.display = "none";
            }
            else if (window.location.href.includes("Robot2.html"))
            {
              arrowControl.style.display = "none";
            }
            else if (window.location.href.includes("BothRobots.html"))
            {
              allControl.style.display = "none";
            }
            // Toastr alert letting users know what mode the robot is returning back to
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: `Returning back to ${previousMode} mode.`
            });
          }

        }, 17000);

      }
      else
      {
        //This lets users know which modes interrupt mode works in
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "warning",
          title: "Interrupt mode only works in direct control or autonomous mode!"
        });
      }
    });


    start_Dance.addEventListener("click", function () {
      if (currentMode === "dance") 
      {
        const selected_Dance = danceList.value;
        updateStatus("dance", selected_Dance);
        console.log("The dance selected is: ", selected_Dance);

        // Here we are sending the dance command via Bluetooth to Max
        sendCommand(selected_Dance, 1);

        // Here we are sending the dance command via Bluetooth to Jerry
        sendCommand(selected_Dance, 2);

      }
      else
      {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "warning",
          title: "Dance mode must be selected first!"
        });
      }
    
    });

    // Here is where we have the direct control options for users to control both robots
    document.addEventListener("keydown", function (event) {

      // This if statement will make sure that users are able to type in the search bar without interferance.
      if (event.target.tagName.toLowerCase() === "input" || event.target.tagName.toLowerCase() === "textarea")
      {
        return;
      }
      

      // This if statement will allow users to control the robots with the "WSAD" or arrow keys depending on the robot they want to control. Users will also be able to have control of both robots too.
      if (window.location.href.includes("index.html"))
      {
        //Here is the control logic for Max
        if (currentMode !== "direct")
        {
          return;
        }

        switch (event.key.toLowerCase())
        {
          case "w":
            sendCommand("forward", 1);
            break;
          case "a":
            sendCommand("left", 1);
            break;
          case "s":
            sendCommand("stop", 1);
            break;
          case "d":
            sendCommand("right", 1);
            break;
          default:
            break;
        }

      }
      //Here is the control logic for Jerry
      else if(window.location.href.includes("Robot2.html"))
      {

        // This line prevents the default behavior of scrolling when the up/down arrow keys are pressed from happening
        event.preventDefault();

        if (currentMode !== "direct")
        {
          return;
        }

        switch (event.key)
        {
          case "ArrowUp":
            sendCommand("forward", 2);
            break;
          case "ArrowLeft":
            sendCommand("left", 2);
            break;
          case "ArrowDown":
            sendCommand("stop", 2);
            break;
          case "ArrowRight":
            sendCommand("right", 2);
            break;
          default:
            break;
        }
      }
      //Here is the control logic to control both robots
      else if(window.location.href.includes("BothRobots.html"))
      {
        // This line prevents the default behavior of scrolling when the up/down arrow keys are pressed from happening
        event.preventDefault();

        if (currentMode !== "direct")
        {
          return;
        }
        
        switch (event.key)
        {
          //Controls for Max
          case "w":
          case "W":
            sendCommand("forward", 1);
            break;
          case "a":
          case "A":
            sendCommand("left", 1);
            break;
          case "s":
          case "S": 
            sendCommand("stop", 1);
            break;
          case "d":
          case "D":
            sendCommand("right", 1);
            break;
          
          // Controls for Jerry
          case "ArrowUp":
            sendCommand("forward", 2);
            break;
          case "ArrowLeft":
            sendCommand("left", 2);
            break;
          case "ArrowDown":
            sendCommand("stop", 2);
            break;
          case "ArrowRight":
            sendCommand("right", 2);
            break;
          default:
            break;
        }

      }

    });

    // This function is responsible for sending the user commands via Bluetooth to the robots
    async function sendCommand(command, Num_robot) 
    {
      if ((Num_robot === 1 && !max_device) && (Num_robot === 2 && !jerry_device))
      {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          }
        });
        Toast.fire({
          icon: "warning",
          title: "You must be connected to both robots first!"
        });
        return;
      }

      // Here is logic that will help to send the appropriate direct control commands to the robots.
      try {

        const encoder = new TextEncoder();

        if (Num_robot === 1)
        {
          // Here we are allowing Max to receive commands through characteristics
          await max_characteristic.writeValue(encoder.encode(command));

          console.log("Sent movement command to Max: ", command);
        }
        else if(Num_robot === 2)
        {
          // Here we are allowing Jerry to receive commands through characteristics
          await jerry_characteristic.writeValue(encoder.encode(command));

          console.log("Sent command to Jerry: ", command);
        }
      }
      catch (error)
      {
        console.error("Failed to send this command: ", error);
      }

      
    }
    
    // Here is the data that will be displayed on the webpage that displays different status updates for the robots
    function updateStatus(parameter, value)
    {
      if (window.location.href.includes("index.html") || window.location.href.includes("Robot2.html"))
      {
        // The idea is that different robot statuses will be displayed based on the parameters below
        switch (parameter)
        {
          case "mode":
            document.getElementById("modeStatus").textContent = "Mode Status: " + value;

            // This if statement is used to clear the dashboard of the dance performed by the robot if the robot is not in dance or interrupt mode
            if (value !== "Dance Mode" && value !== "Interrupt Mode")
            {
              document.getElementById("danceStatus").textContent = "Current Dance:";
            }  
            break;
          case "emotion":
            document.getElementById("emotionStatus").textContent = "Emotional Status: " + value;
            break;
          case "light":
            document.getElementById("lightStatus").textContent = "Room Light Level: " + value;
            break;
          case "object":
            document.getElementById("objectStatus").textContent = "Obstacle Detection: " + value;
            break;
          case "dance":
            document.getElementById("danceStatus").textContent = "Current Dance: " + value;
            break;
          default:
            break;
        }
      }
      else if(window.location.href.includes("BothRobots.html"))
      {
        // The idea is that different robot statuses will be displayed based on the parameters below for both of the robots
        switch (parameter)
        {
          case "mode":
            document.getElementById("modeStatus").textContent = "Mode Status: " + value;
            document.getElementById("mode_Status").textContent = "Mode Status: " + value;

            // This if statement is used to clear the dashboard of the dance performed by the robot if the robot is not in dance or interrupt mode
            if (value !== "Dance Mode" && value !== "Interrupt Mode")
            {
              document.getElementById("danceStatus").textContent = "Current Dance:";
            }
            break;
          case "emotion":
            document.getElementById("emotionStatus").textContent = "Emotional Status: " + value;
            document.getElementById("emotion_Status").textContent = "Emotional Status: " + value;
            break;
          case "light":
            //document.getElementById("lightStatus").textContent = "Room Light Level: " + value;
            document.getElementById("light_Status").textContent = "Room Light Level: " + value;
            break;
          case "object":
            document.getElementById("objectStatus").textContent = "Obstacle Detection: " + value;
            document.getElementById("object_Status").textContent = "Obstacle Detection: " + value;
            break;
          case "dance":
            document.getElementById("danceStatus").textContent = "Current Dance: " + value;
            document.getElementById("dance_Status").textContent = "Current Dance: " + value;
            break;
          default:
            break;
        }
      }
    }
    
});