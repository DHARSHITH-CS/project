console.log("i am from content script")



 chrome.runtime.sendMessage({message:"hi man i am from content script!"},(response)=>{
    console.log(response.message);
}) ;


// contentscript.js

// Function to create and show the custom popup
function showCustomPopup() {
    const popup = document.createElement('div');
    popup.innerHTML = `
      <div id="custom-popup">
        <p>This is a custom popup</p>
        <button id="close-popup">Close</button>
      </div>
    `;
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    `;
  
    // Function to close the popup
    const closePopup = () => {
      document.body.removeChild(popup);
    };
  
    // Add an event listener to the close button
    const closeBtn = popup.querySelector('#close-popup');
    closeBtn.addEventListener('click', closePopup);
  
    // Append the popup to the body
    document.body.appendChild(popup);
  }
  
 /*  // Example: Show the custom popup when a button is clicked
  document.querySelector('.openModal').addEventListener('click', function() {
    showCustomPopup();
  });
   */
//listen to messages

/* chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    console.log(message);
    sendResponse({message:"Response from content script JS"})
  });
   */

  // content.js

// Load jQuery from a CDN if it's not already available
/* if (typeof jQuery === 'undefined') {
    var script = document.createElement('script');
    script.src =chrome.runtime.getURL('jquery-3.7.1.min.js'); // Adjust the path to the jQuery file
    script.type = 'text/javascript';
    script.onload = function() {
      // Now that jQuery is loaded, you can use it
      main();
    };
    document.head.appendChild(script);
  } else {
    // jQuery is already loaded
    main();
  }
  
  function main() {
    // Your jQuery code here
    $(".switcher-icon").on("click", function(e) {
      e.preventDefault();
      $(".right-sidebar").toggleClass("right-toggled");
    });
  } */
   

  /* document.querySelector('.openModal').addEventListener('click',function(){
    chrome.tabs.query({currentWindow:true,active:true},function(tabs){
        var activeTab=tabs[0];
        chrome.tabs.sendMessage(activeTab.id,{command:"openModal"});
    });
  });*/

  
  // Send a message to the background script to request the tab's URL
chrome.runtime.sendMessage({ action: "getTabUrl" }); 

// Variable to track if the captions button has been clicked
let captionsButtonClicked = false;
// Define a function to send a message to the background script when the captions button is clicked
function sendCaptionsButtonClickMessage() {
    // Send a message to the background script to inform it about the click
    chrome.runtime.sendMessage({ action: "captionsButtonClick" });
  }
// Function to observe DOM changes
function observeDOMChanges() {
    console.log("MutationObserver callback called"); // Log when the observer callback is called
    let alertDisplayed = false;
    const observer = new MutationObserver(function(mutationsList) {
        //alert("This is an alert message from the content script!");

      for (let mutation of mutationsList) {
        // Check if the mutation corresponds to a captions button click
        if (!alertDisplayed && mutation.target.matches('button[aria-label="Turn on captions (c)"]')) {
           // console.log(mutation);
            //console.log(mutationsList)
           
            alert("hey here use can use our sign interpretation by clicking on the captions!");
            alertDisplayed = true; 
            //showAlertAndPopup();
            //console.log("html gonna display")
           // insertCustomHTML();
           //injectOverlayHTML();
           //injectPopupHTML();

         //
           chrome.action.setPopup({popup: 'index.html'});
            console.log("html displayed");
          // Capture the click event and send a message to the background script
          sendCaptionsButtonClickMessage();
        }
      }
    });
  
    // Specify the target node and options for the observer
    const targetNode = document.body; // You might need to adjust this selector
    const config = { childList: true, subtree: true };
  
    // Start observing DOM changes
    observer.observe(targetNode, config);
  }
  
  // Start observing DOM changes when the extension is activated
  observeDOMChanges();

  // contentscript.js

/* // Function to open the popup window
function openPopup() {
    console.log('Popup should open now.');


    const popupUrl = chrome.extension.getURL('popup.html');
  
    // Create a new popup window
    chrome.extension.getViews({ type: 'popup' }, function (popupViews) {
      if (popupViews.length === 0) {
        chrome.windows.create({
          url: popupUrl,
          type: 'popup',
          width: 300,
          height: 200,
        });
      }
    });
  }
  
  // Listen for a specific event (e.g., button click) to open the popup
  document.addEventListener('click', function (event) {
    const clickedElement = event.target;
  
    // Check if the event corresponds to the trigger (e.g., a button click)
    if (clickedElement.id === 'openPopupButton') {
      openPopup(); // Open the popup window
    }
  }); */

  /* function insertCustomHTML() {
    // Create a div element to hold your custom HTML
    const customHTML = document.createElement('div');
  
    // Set the HTML content you want to insert
    customHTML.innerHTML = `
      <div class="topnav">
        <a class="active" href="#home">Home</a>
        <a href="#news">News</a>
        <a href="#contact">Contact</a>
        <div class="topnav-right">
          <a href="#search">Search</a>
          <a href="#about">About</a>
        </div>
      </div>
  
      <div style="padding-left:16px">
        <h2>Top Navigation with Right Aligned Links</h2>
        <p>Some content..</p>
      </div>
    `;
  
    // Insert the custom HTML at the beginning of the document body
    document.body.prepend(customHTML);
  }
  function showAlertAndPopup() {
    // Display an alert message
    alert("This is an alert message from the content script!");
  
    // Create a custom popup element
    const popup = document.createElement('div');
    popup.innerHTML = `
      <div id="custom-popup">
        <h2>Custom Popup</h2>
        <p>This is a custom popup that appears after the alert.</p>
        <button id="close-popup">Close</button>
      </div>
    `;
  
    // Style the custom popup with CSS to cover the entire viewport
    popup.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent background 
      display: flex;
      justify-content: center;
      align-items: center;
    
  
    // Append the custom popup to the document body
    document.body.appendChild(popup);
  
    // Add an event listener to the close button
    const closeButton = document.getElementById('close-popup');
    closeButton.addEventListener('click', () => {
      // Close the custom popup
      popup.remove();
    });
  }
  // Call the function to show the alert and custom popup
  */
  /* const overlayHTML = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
  /* Your CSS styles here 
  </style>
  </head>
  <body>
  
  <div id="mySidenav" class="sidenav">
    <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
    <a href="#">About</a>
    <a href="#">Services</a>
    <a href="#">Clients</a>
    <a href="#">Contact</a>
  </div>
  
  <h2>Animated Sidenav Example</h2>
  <p>Click on the element below to open the side navigation menu.</p>
  <span style="font-size:30px;cursor:pointer" onclick="openNav()">&#9776; open</span>
  
  <script>
  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  </script>
     
  </body>
  </html>
  
  
  function injectOverlayHTML() {
    // Create a div element to hold the overlay content
    const overlayContainer = document.createElement("div");
    overlayContainer.innerHTML = overlayHTML;
  
    // Append the overlay content to the document body
    document.body.appendChild(overlayContainer);
  } */

  /* function injectPopupHTML() {
    // Create a new div element
    const popupContainer = document.createElement("div");
  
    // Load the content from popup.html into the div
    fetch(chrome.extension.getURL("popup.html"))
      .then((response) => response.text())
      .then((html) => {
        popupContainer.innerHTML = html;
  
        // Append the div to the body of the current web page
        document.body.appendChild(popupContainer);
        // Add event listeners or perform other actions with the UI here
      const myButton = document.getElementById("open-button");
      myButton.addEventListener("click", function() {
        alert("Button Clicked!");
      });
    });
  
        // You can also add event listeners or perform other actions with the injected HTML here
      }
  


  injectPopupHTML(); */
  // Send a message to the background script to open the UI
//chrome.runtime.sendMessage({ openUI: true });
// contentscript.js

// Send a message to the background script to toggle the UI
// contentscript.js

// Get the current tab ID
// Get the current tab ID
// contentscript.js

/* // Send a message to the background script to toggle the UI, including the tabId
chrome.runtime.sendMessage({ toggleUI: true });

  console.log("Content script executed.");   */


  // Define the openForm function in the global scope


/* // JavaScript functions for opening and closing the form
function openForm() {
    console.log("openform")
    document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
    console.log("close form")
  } */


  //chrome.action.setPopup({popup: 'index.html'});

 /*  document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "l") {
      // Replace this with your extension's logic to open when Ctrl+L is pressed.
      alert("Ctrl+L pressed. Open extension here.");
      var extensionIcon = document.querySelector("[data-extension-id='dlenkfgdelkneccadoabjapfdmnebjpi']");
      if (extensionIcon) {
        extensionIcon.open();
      }
    }
  });
 */
  console.log(chrome.runtime.id);


  /* chrome.commands.onCommand.addListener((command) => {
    
    console.log(`Command "${command}" triggered`);
  });
 */


  /* const GOOGLE_ORIGIN = 'https://www.google.com';

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on google.com
  if (url.origin === GOOGLE_ORIGIN) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'index.html',
      enabled: true
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  }
});

 */

// Allows users to open the side panel by clicking on the action toolbar icon
