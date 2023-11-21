window.openForm = function () {
  document.getElementById("myForm").style.display = "block";
};

// Define the closeForm function in the global scope
window.closeForm = function () {
  document.getElementById("myForm").style.display = "none";
};
chrome.runtime.sendMessage({ openUI: true });
// Create a container for your extension's UI
const uiContainer = document.createElement('div');
uiContainer.innerHTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body {font-family: Arial, Helvetica, sans-serif;}
* {box-sizing: border-box;}

/* Button used to open the chat form - fixed at the bottom of the page */
.open-button {
  background-color: #555;
  color: white;
  padding: 10px 1px;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  position: fixed;
  bottom: 23px;
  right: -30px;
  width: 90px;
}
.open-button:hover{
    right:0px;
    opacity:1;
    background-color:blue
}

/* The popup chat - hidden by default */
.chat-popup {
  display: none;
  position: fixed;
  bottom: 0;
  right: 15px;
  border: 3px solid #f1f1f1;
  z-index: 9;
}

/* Add styles to the form container */
.form-container {
  max-width: 300px;
  padding: 10px;
  background-color: white;
}

/* Full-width textarea */
.form-container textarea {
  width: 100%;
  padding: 15px;
  margin: 5px 0 22px 0;
  border: none;
  background: #f1f1f1;
  resize: none;
  min-height: 200px;
}

/* When the textarea gets focus, do something */
.form-container textarea:focus {
  background-color: #ddd;
  outline: none;
}

/* Set a style for the submit/send button */
.form-container .btn {
  background-color: #04AA6D;
  color: white;
  padding: 16px 20px;
  border: none;
  cursor: pointer;
  width: 100%;
  margin-bottom:10px;
  opacity: 0.8;
}

/* Add a red background color to the cancel button */
.form-container .cancel {
  background-color: red;
}

/* Add some hover effects to buttons */
.form-container .btn:hover, .open-button:hover {
  opacity: 1;
}
</style>
</head>
<body>

<h2>Popup Chat Window</h2>
<p>Click on the button at the bottom of this page to open the chat form.</p>
<p>Note that the button and the form is fixed - they will always be positioned to the bottom of the browser window.</p>

<button class="open-button" onclick="openForm()">Chat</button>

<div class="chat-popup" id="myForm">
  <form action="/action_page.php" class="form-container">
    <h1>Chat</h1>

    <label for="msg"><b>Message</b></label>
    <textarea placeholder="Type message.." name="msg" required></textarea>

    <button type="submit" class="btn">Send</button>
    <button type="button" class="btncancel" >Close</button>
  </form>
</div>



</body>
</html>

`;
console.log("html have been received")
// Append the container to the current page

document.body.appendChild(uiContainer);
// Attach event listeners to the buttons
document.querySelector(".open-button").addEventListener("click", openForm);
document.querySelector(".btncancel").addEventListener("click", closeForm);

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
