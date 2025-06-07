// This is the JavaScript code that is written to control the Otto LC Robots (Max and Jerry) with this robotic platform. 
//Written by: Jefferson Charles and Corey Chang

document.addEventListener("DOMContentLoaded", function () {
    // Here are global variables
    let currentMode = "none";   // Possibly have to change later when robot software is done
    let bluetoothDevice = [];  // This variable will store the connected Bluetooth device
    let previousMode = "none"; // This will be the variable that holds the previous mode Otto was in when the user hits the interrupt button
    let jerry_characteristic = null;
    let max_characteristic = null;

    

    // Here are the variables for the UI elements on the webpage
    const connectButton = document.getElementById("connectButton");
    const connectButton1 = document.getElementById("connectButton1");
    const connectButton2 = document.getElementById("connectButton2");
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
    //Both robots
    // Here is the the BLE connection logic where users are able to connect to the robots to interact with them using the web application
    if (window.location.href.includes("BothRobots.html"))
    {
      connectButton1.addEventListener("click", async function () {
        try {
            let first_device = await navigator.bluetooth.requestDevice ({
              acceptAllDevices: true,
              optionalServices: ["059c8d82-5664-4997-b54d-4d860bc5acf6"],  
            });
            bluetoothDevice.push(first_device);

            const server = await first_device.gatt.connect();
            const service = await server.getPrimaryService("059c8d82-5664-4997-b54d-4d860bc5acf6");
            max_characteristic = await service.getCharacteristic("8649501e-f8be-4203-96a8-611c67fdecf2");
            
            await max_characteristic.startNotifications().then(() => {
            max_characteristic.addEventListener("characteristicvaluechanged", (event) => 
              {
                //Add things here
              const value = new TextDecoder().decode(event.target.value);
              console.log("Received notification from Max:", value);
              updateStatus("dance", value); // Show on UI under 'Current Dance'

              });
            });


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
          let second_device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ["fb483dbf-6b8d-4719-9290-624ec26d8bf3"],  // Here is the service UUID for Jerry
  
          });
          bluetoothDevice.push(second_device);

          // Here is where we are going to set up the GATT server that will have a profile with a service that has characteristics that has the status data we need for the dashboard.
          const server = await second_device.gatt.connect();
          const service = await server.getPrimaryService("fb483dbf-6b8d-4719-9290-624ec26d8bf3");
          jerry_characteristic = await service.getCharacteristic("5c79fdd4-8db4-4d78-8122-04a67455f527");

          // Here we are subscribing to the notifications (status data) coming from Jerry for the status dashboard
          jerry_characteristic.startNotifications().then(() => {
            jerry_characteristic.addEventListener('characteristicvaluechange', (event) => {
              
              // Here is where status updates coming from Jerry would happen and be displayed on the webpage.
              const value = new TextDecoder().decode(event.target.value);
              const status = JSON.parse(value);

              // Mode status
              updateStatus("mode", status.mode);

              //Emotional status
              if (status.mode === "direct")
              {
                updateStatus("emotion", "Happy");
              }
              else if (status.mode === "dance")
              {
                updateStatus("emotion", "Happy Open");
              }
              else if (status.mode === "autonomous")
              {
                updateStatus("emotion", "Small Surprise");
              }
              else if (status.mode === "interrupt")
              {
                updateStatus("emotion", "Angry");
              }

              // light status
              updateStatus("light", status.light)

              // Object detection status
              updateStatus("object", status.object);
            });
          });

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
    }
    // This is the Bluetooth logic for Max's control page and Jerry's control page on the web app.Separatly.
    // Here is Max ##################################################################################################
    else 
    {
      connectButton.addEventListener("click", async function () {
        try {

          if (window.location.href.includes("Robot1.html"))
          {
            let first_device = await navigator.bluetooth.requestDevice ({
              acceptAllDevices: true,
              optionalServices: ["f4afc201-1fb5-459e-8fcc-c5c9c331914b"],
            });

            bluetoothDevice.push(first_device);

            const server = await first_device.gatt.connect();
            const service = await server.getPrimaryService("059c8d82-5664-4997-b54d-4d860bc5acf6");
            max_characteristic = await service.getCharacteristic("8649501e-f8be-4203-96a8-611c67fdecf2");
            
            await max_characteristic.startNotifications().then(() => {
            max_characteristic.addEventListener("characteristicvaluechanged", (event) => 
              {
                //Add things here
              const value = new TextDecoder().decode(event.target.value);
              console.log("Received notification from Max:", value);
              updateStatus("dance", value); // Show on UI under 'Current Dance'

              });
            });
            //////////////////////////////////////////////////////////////////////////
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
            let second_device = await navigator.bluetooth.requestDevice({
              acceptAllDevices: true,
              optionalServices: ["fb483dbf-6b8d-4719-9290-624ec26d8bf3"],  // Service UUID for Jerry
            });
            bluetoothDevice.push(second_device);

            // Here is where we are going to set up the GATT server that will have a profile with a service that has characteristics that has the status data we need for the dashboard.
            const server = await second_device.gatt.connect();
            const service = await server.getPrimaryService("fb483dbf-6b8d-4719-9290-624ec26d8bf3");
            jerry_characteristic = await service.getCharacteristic("5c79fdd4-8db4-4d78-8122-04a67455f527");

            // Here is where we are subscribing to notifications (status data) coming from Jerry for the status dashboard
            jerry_characteristic.startNotifications().then(() => {
              jerry_characteristic.addEventListener('characteristicvaluechange', (event) => {
              
                // Here is where status updates coming from Jerry would happen and be displayed on the webpage.
                const value = new TextDecoder().decode(event.target.value);
                const status = JSON.parse(value);
  
                // Mode status
                updateStatus("mode", status.mode);
  
                //Emotional status
                if (status.mode === "direct")
                {
                  updateStatus("emotion", "Happy");
                }
                else if (status.mode === "dance")
                {
                  updateStatus("emotion", "Happy Open");
                }
                else if (status.mode === "autonomous")
                {
                  updateStatus("emotion", "Small Surprise");
                }
                else if (status.mode === "interrupt")
                {
                  updateStatus("emotion", "Angry");
                }
  
                // light status
                updateStatus("light", status.light)
  
                // Object detection status
                updateStatus("object", status.object);

                //currentMode = status.mode;
              });
            });

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
          if (window.location.href.includes("Robot1.html"))
          {
            connectionStatus.textContent = "Max Connection Status: There was an error connecting to Max!";
          }
          else if (window.location.href.includes("Robot2.html"))
          {
            connectionStatus.textContent = "Jerry Connection Status: There was an error connecting to Jerry!";
          }
            
        }

      });

    }

    // This function is to make sure that the web application is connected with the robots before any modes can be used.
    function bluetoothCheck ()
    {
      if (!bluetoothDevice || bluetoothDevice.length === 0)
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
      if (window.location.href.includes("Robot1.html"))
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
      updateStatus("Moving", "Idle"); 

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
        title: "Direct control Mode was activated!"
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
      if (window.location.href.includes("Robot1.html"))
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
      
      //updateStatus("Moving", "In dancing mode");

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
      if (window.location.href.includes("Robot1.html"))
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

      //updateStatus("Moving", "In Autonomous Mode");
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

    interrupt_Mode.addEventListener("click", function () {
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

        //This will hide certain information on the webpage that is meant to not be shown in this instance
        if (window.location.href.includes("Robot1.html"))
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

        //Here we are randomly selecting a dance for the robot to perform
        const dance_options = Array.from(danceList.options).map(options => options.value);
        const random_dance = dance_options[Math.floor(Math.random() * dance_options.length)];

        updateStatus("dance", random_dance);

        console.log("Selected dance is: ", random_dance);
        sendCommand(random_dance, 2);

        setTimeout(() => {
          //Here we are returning to the previous mode after the robot completes it's dance
          changeMode(previousMode);

          if (previousMode === "direct")
          {
            if (window.location.href.includes("Robot1.html"))
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
            if (window.location.href.includes("Robot1.html"))
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

        }, 15000);

      }
      else
      {
        //This lets users know which modes interrupt mode works in..
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

        // Here we are sending the dance command via Bluetooth to the robot
        sendCommand(selected_Dance, 1);
////////////////////////////////////////////////////////////////////////////
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
      if (window.location.href.includes("Robot1.html"))
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
      if (bluetoothDevice.length === 0)
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
          title: "You must be connected to the robots first!"
        });
        return;
      }

      // Here is logic that will help to send the appropriate direct control commands to the robots.
      try {

        const encoder = new TextEncoder();

        if (Num_robot === 1)
        {
          // Need to add characteristic logic here for Max to recieve commands from the web application later
          await max_characteristic.writeValue(encoder.encode(command));
          console.log("Sent movement command to Max: ", command);
        }
        else if(Num_robot === 2)
        {
          // Here we are allowing Jerry to receive commands through characteristics
          await jerry_characteristic.writeValue(encoder.encode(command));
          console.log("Sent movement command to Jerry: ", command);
        }
      }
      catch (err)
      {
        console.error("Failed to send this command: ", err);
      }

      // replace this later on when the software for the robots are done
      // bluetoothDevice.forEach(device =>{
        // console.log("The command was sent to " + device.name + ":", command);
      // });
    }
    
    // Here is the data that will be displayed on the webpage that displays different status updates for the robots
    function updateStatus(parameter, value)
    {
      if (window.location.href.includes("Robot1.html") || window.location.href.includes("Robot2.html"))
      {
        // The idea is that different robot statuses will be displayed based on the parameters below
        switch (parameter)
        {
          case "mode":
            document.getElementById("modeStatus").textContent = "Mode Status: " + value;
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
            break;
          case "emotion":
            document.getElementById("emotionStatus").textContent = "Emotional Status: " + value;
            document.getElementById("emotion_Status").textContent = "Emotional Status: " + value;
            break;
          case "light":
            document.getElementById("lightStatus").textContent = "Room Light Level: " + value;
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