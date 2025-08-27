// This is the JavaScript code that is written to control the Otto LC Robot-Jerry with the robotic control platform. 
//Written by: Jefferson Charles and Corey Chang

document.addEventListener("DOMContentLoaded", function () {
    // Here are global variables
    let currentMode = "none";   // Possibly have to change later when robot software is done
    let jerry_device = null;  // This will be the variable for the Bluetooth device for Jerry.
    let previousMode = "none"; // This will be the variable that holds the previous mode Otto was in when the user hits the interrupt button
    let jerry_characteristic = null;

    // These boolean variables will be flags used to prevent functionalities of the web application from happening when a user disconnects from the robot.
    let jerryConnected = false;
    
    // Here are the variables for the UI elements on the webpage
    const connectButton = document.getElementById("connectButton");
    const disconnectButton = document.getElementById("disconnectButton");
    const connectionStatus = document.getElementById("connectionStatus");
    const direct_Control = document.getElementById("directControl");
    const dance_Mode = document.getElementById("danceMode");
    const autonomous_Mode = document.getElementById("autoMode");
    const interrupt_Mode = document.getElementById("interruptButton");
    const danceSelection = document.getElementById("danceSelection");
    const danceList = document.getElementById("danceList");
    const start_Dance = document.getElementById("startDance");
    const arrowControl = document.getElementById("arrowControl");


    // Here this function will hide certain information on the webpage when different modes are selected
    function hide ()
    {

      if(danceSelection)
      {
        danceSelection.style.display = "none";
      }

      if (arrowControl)
      {
        arrowControl.style.display = "none";
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

    // Here is the the BLE connection logic where users are able to connect to the robot to interact with it using the web application
    if (window.location.href.includes("index.html"))
    {
      connectButton.addEventListener("click", async function () {
        try {

          // We are setting the bluetooth connection flag true indicating that the user connected to Jerry.
          jerryConnected = true;

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
        catch(error)
        {
          console.error("Connection Error: ", error);
          connectionStatus.textContent = "Jerry Connection Status: There was an error connecting to Jerry!";
        }
        
      });

      // Here will be the logic for users to disconnect from the robot.
      disconnectButton.addEventListener("click", async function () {
        try {
          if(jerry_device && jerry_device.gatt.connected)
          {
            // We are setting the bluetooth connection flag to false indicating that the user disconnected from Jerry.
            jerryConnected = false;

            jerry_device.gatt.disconnect();
            connectionStatus.textContent = "Jerry Connection Status: Disconnected from Jerry";

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

            // This will make sure that text from the different control options are gone after the user disconnects from Jerry.
            hide ();

            // This will clear the status dashboard of the web application once the user disconnects from the robot.
            document.getElementById("modeStatus").textContent = "Mode:";
            document.getElementById("emotionStatus").textContent = "Emotional Status:";
            document.getElementById("lightStatus").textContent = "Room Light Level:";
            document.getElementById("objectStatus").textContent = "Obstacle Detection:";
            document.getElementById("danceStatus").textContent = "Current Dance:";
          }

        }
        catch(error)
        {
          console.error("Connection Error: ", error);
          connectionStatus.textContent = "Jerry Connection Status: There was an error connecting to Jerry!";

        }
      });

    }

    // This function is to make sure that the web application is connected with the robot before any modes can be used.
    function bluetoothCheck ()
    {
      if (window.location.href.includes("index.html"))
      {
        if (!jerryConnected)
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
            title: "You must be connected to Jerry to select a mode!"
          });
          return false;
        }
        return true; 
      }   
      return false;
    }

    // Here is the different control logic for the different modes users are able to choose from
    direct_Control.addEventListener("click", function () {

      // Here we are making sure that the user is connected to the robot via Bluetooth
      if (!bluetoothCheck())
      {
        return;
      } 

      hide ();
      currentMode = "direct";

      //This will hide certain information on the webpage that is meant to not be shown in this instance
      if (window.location.href.includes("index.html"))
      {
        arrowControl.style.display = "block";
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
      //Here we are making sure that the user is connected to the robot via Bluetooth
      if (!bluetoothCheck())
      {
        return;
      }

      hide ();
      currentMode = "dance";

      //This will hide certain information on the webpage that is meant to not be shown in this instance
      if (window.location.href.includes("index.html"))
      {
        arrowControl.style.display = "none";
        danceSelection.style.display = "block";

      }
      
      
      updateStatus("mode", "Dance");
      updateStatus("emotion", "Happy Open");

      // Here is the toastr alert letting users know that they selected dance mode
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
      // Here we are making sure that the user is connected to the robot through Bluetooth
      if (!bluetoothCheck())
      {
        return;
      }

      hide ();
      currentMode = "autonomous";

      //This will hide certain information on the webpage that is meant to not be shown in this instance
      if (window.location.href.includes("index.html"))
      {
        arrowControl.style.display = "none";
        danceSelection.style.display = "none";

      }

      updateStatus("mode", "Autonomous");
      updateStatus("emotion", "Small Surprise");

      // Here we are sending the autonomous mode command to Jerry.
      sendCommand("autonomous", 1);

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
      // Here we are making sure that the user is connected to the robot via Bluetooth
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
          arrowControl.style.display = "none";
          danceSelection.style.display = "none";
  
        }

        // Here we are sending the interrupt mode command to Jerry.
        sendCommand("interrupt", 1);

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
              arrowControl.style.display = "block";
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

            // Here we are sending the autonomous mode command to Jerry to make sure Jerry is back in that mode after the interrupt dance.
            sendCommand("autonomous", 1);

            if (window.location.href.includes("index.html"))
            {
              arrowControl.style.display = "none";
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

        // Here we are sending the dance command via Bluetooth to Jerry
        sendCommand(selected_Dance, 1);

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

    // Here is where we have the direct control options for users to control the robot
    document.addEventListener("keydown", function (event) {

      // This if statement will allow users to control the robot with the arrow keys on thier keyboard.
      //Here is the control logic for Jerry
      if(window.location.href.includes("index.html"))
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
            sendCommand("forward", 1);
            break;
          case "ArrowLeft":
            sendCommand("left", 1);
            break;
          case "ArrowDown":
            sendCommand("stop", 1);
            break;
          case "ArrowRight":
            sendCommand("right", 1);
            break;
          default:
            break;
        }
      }

    });

    // This function is responsible for sending the user commands via Bluetooth to the robot
    async function sendCommand(command, Num_robot) 
    {

      // Here is logic that will help to send the appropriate direct control commands to the robot.
      try {

        const encoder = new TextEncoder();

        if(Num_robot === 1)
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
    
    // Here is the data that will be displayed on the webpage that displays different status updates for the robot
    function updateStatus(parameter, value)
    {
      if (window.location.href.includes("index.html"))
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
      
    }
    
});