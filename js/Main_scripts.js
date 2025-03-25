// This is the JavaScript code that is written to control the Otto LC Robots with this robotic platform. 
//Written by: Jefferson Charles and Corey Chang

document.addEventListener("DOMContentLoaded", function () {
    // Here are global variables
    let currentMode = "none";   // Possibly have to change later when robot software is done
    let bluetoothDevice = [];  // This variable will store the connected Bluetooth device
    let previousMode = "none"; // This will be the variable that holds the previous mode Otto was in when the user hits the interrupt button

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

    // This function is responsible for changing the current mode Otto is in to a new mode
    function changeMode (newMode)
    {
      currentMode = newMode;
    }

    // Here is the the BLE connection logic where users are able to connect to the robots to interact with them using the web application
    if (window.location.href.includes("BothRobots.html"))
    {
      connectButton1.addEventListener("click", async function () {
        try {
            let first_device = await navigator.bluetooth.requestDevice ({
              acceptAllDevices: true,
              optionalServices: ["battery_service"],
            });
            bluetoothDevice.push(first_device);
            firstconnectionStatus.textContent = "Connection Status: Connected to Robot 1";

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
              title: "Connected to Robot 1!"
            });
        }
        catch(error)
        {
          console.error("Connection Error: ", error);
          firstconnectionStatus.textContent = "Connection Status: There was an error connecting to Robot 1!";
        }
      
      });

      connectButton2.addEventListener("click", async function () {
        try {
          let second_device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ["battery_service"],
  
          });
          bluetoothDevice.push(second_device);
          secondconnectionStatus.textContent = "Connection Status: Connected to Robot 2";

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
            title: "Connected to Robot 2!"
          });

        }
        catch(error)
        {
          console.error("Connection Error: ", error);
          secondconnectionStatus.textContent = "Connection Status: There was an error connecting to Robot 2!";
        }
        
      });
    }
    else
    {
      connectButton.addEventListener("click", async function () {
        try {
          bluetoothDevice = [];

          if (window.location.href.includes("index.html"))
          {
            let first_device = await navigator.bluetooth.requestDevice ({
              acceptAllDevices: true,
              optionalServices: ["battery_service"],
            });
            bluetoothDevice.push(first_device);
            connectionStatus.textContent = "Connection Status: Connected to Robot 1";

          }
          else if (window.location.href.includes("Robot2.html"))
          {
            let second_device = await navigator.bluetooth.requestDevice({
              acceptAllDevices: true,
              optionalServices: ["battery_service"],
            });
            bluetoothDevice.push(second_device);
            connectionStatus.textContent = "Connection Status: Connected to Robot 2";

          }
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
            title: "Connected to: " + bluetoothDevice.map(device => device.name).join(", ")
          });

        }

        // Here is where we are getting error messages from the GATT server
        catch(error) 
        {
          console.error("Connection Error: ", error);
          if (window.location.href.includes("index.html"))
          {
            connectionStatus.textContent = "Connection Status: There was an error connecting to Robot 1!";
          }
          else if (window.location.href.includes("Robot2.html"))
          {
            connectionStatus.textContent = "Connection Status: There was an error connecting to Robot 2!";
          }
            
        }

      });

    }

    // This function is to make sure that the web application is connected with Otto before any modes can be used.
    function bluetoothCheck ()
    {
      if (!bluetoothDevice)
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
            title: "You must be connected to one or both Otto robots to select a mode!"
          });
          return false;
        }
      }
      return true;
    }

    // Here is the control logic for the different modes users are able to choose from
    direct_Control.addEventListener("click", function () {

      // Here we are making sure that the user is connected to the robots via Bluetooth
      // if (!bluetoothCheck())
      // {
      //   return;
      // }

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
      // if (!bluetoothCheck())
      // {
      //   return;
      // }

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
      
      updateStatus("Moving", "In dancing mode");

      // Here is the toastr alert letting users know that they selected dancing control mode
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
      // if (!bluetoothCheck())
      // {
      //   return;
      // }

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

      updateStatus("Moving", "In Autonomous Mode");

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
      // if (!bluetoothCheck())
      // {
      //   return;
      // }

      // This if/else statement will be resopnsible for giving the user the option to make Otto dance whil in direct control or autonomous mode
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

        //Here we are randomly selecting a dance for Otto to perform
        const dance_options = Array.from(danceList.options).map(options => options.value);
        const random_dance = dance_options[Math.floor(Math.random() * dance_options.length)];

        updateStatus("dance", random_dance);

        console.log("Selected dance is: ", random_dance);
        sendCommand(random_dance);

        setTimeout(() => {
          //Here we are returning to the previous mode after Otto completes it's dance
          changeMode(previousMode);

          if (previousMode === "direct")
          {
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

            // Toastr alert letting users know what mode Otto is returning back to
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
              title: `Otto is back in ${previousMode} control mode.`
            });
          }
          else if (previousMode === "autonomous")
          {
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

            // Toastr alert letting users know what mode Otto is returning back to
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
              title: `Otto is back in ${previousMode} mode.`
            });
          }

        }, 15000);

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

        // Here we are sending the dance command via Bluetooth to the robot
        sendCommand(selected_Dance);

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

    //This section has to be modified for the control of robot 1 and the control of both robots.
    document.addEventListener("keydown", function (event) {

      // This if statement will make sure that users are able to type in the search bar without interferance.
      if (event.target.tagName.toLowerCase() === "input" || event.target.tagName.toLowerCase() === "textarea")
      {
        return;
      }

      // This if statement will allow users to control the robots with the "WSAD" or arrow keys depending on the robot they want to control. Users will also be able to have control of both robots too.
      if (window.location.href.includes("index.html"))
      {
        //Here is the control logic for robot 1
        if (currentMode !== "direct")
        {
          return;
        }

        switch (event.key.toLowerCase())
        {
          case "w":
            sendCommand("forward");
            break;
          case "a":
            sendCommand("left");
            break;
          case "s":
            sendCommand("stop");
            break;
          case "d":
            sendCommand("right");
            break;
          default:
            break;
        }

      }
      //Here is the control logic for robot 2
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
            sendCommand("forward");
            break;
          case "ArrowLeft":
            sendCommand("left");
            break;
          case "ArrowDown":
            sendCommand("stop");
            break;
          case "ArrowRight":
            sendCommand("right");
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
          case "w":
          case "W":
          case "ArrowUp":
            sendCommand("forward");
            break;
          case "a":
          case "A":
          case "ArrowLeft":
            sendCommand("left");
            break;
          case "s":
          case "S":
          case "ArrowDown": 
            sendCommand("stop");
            break;
          case "d":
          case "D":
          case "ArrowRight":
            sendCommand("right");
            break;
          default:
            break;
        }

      }

    });

    // This function is responsible for sending the user commands via Bluetooth to the robots
    function sendCommand(command) 
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
      // replace this later on when the software for the robots are done
      bluetoothDevice.forEach(device =>{
        console.log("The command was sent to " + device.name + ":", command);
      });
    }
    
    // Here is the data that will be displayed on the webpage that displays different status updates for the robots
    function updateStatus(parameter, value)
    {
      if (window.location.href.includes("index.html") || window.location.href.includes("Robot2.html"))
      {
        // The idea is that different robot statuses will be displayed based on the parameters below
        switch (parameter)
        {
          case "fall":
            document.getElementById("fallStatus").textContent = "Fall Status: " + value;
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
          case "fall":
            document.getElementById("fallStatus").textContent = "Fall Status: " + value;
            document.getElementById("fall_Status").textContent = "Fall Status: " + value;
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

    // Here is where status updates coming from the robot would happen and be displayed on the webpage. Need to update this when we have the software done for the robots.
    setInterval(() => {
      updateStatus("fall", "Otto did not fall over");
      updateStatus("emotion", "Happy");
      updateStatus("light", "Bright");
      updateStatus("object", "No object detected");
    }, 3000);

});