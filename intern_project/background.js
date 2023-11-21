
//receiving from contentscript
console.log("i am service worker");

chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  console.log(message);
  sendResponse({message:"Response from background JS"})
});

import * as THREE from './three.js-master/three.js-master/build/three.module.js';

// background.js

// Listen for messages from content scripts
 chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getTabUrl") {
    // Use chrome.tabs.query to get the active tab's URL
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs.length > 0) {
        var tab = tabs[0];
        var url = tab.url;
        console.log("URL from tab:", url);
        // You can send the URL back to the content script if needed
        sendResponse({ url: url });
        if(url=="https://www.microsoft.com/en-us/microsoft-teams/group-chat-software/"||url=="https://meet.google.com/"||url=="https://pwa.zoom.us/wc/"){
          console.log("here you can use interpretation")
        }
      }
    });
    return true; // Indicate that the response will be sent asynchronously
  }
});
 
// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "captionsButtonClick") {
    // Handle the click event here, e.g., log it
    console.log("Captions button was clicked.");
    // You can also perform any additional actions you need.
  }
});



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.openUI) {
    // Execute JavaScript in the current tab to display your extension's UI
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      function: () => {
        // Manipulate the DOM to display your UI
        const extensionUI = document.createElement('div');
        extensionUI.innerHTML = 'Your extension UI content here';
        document.body.appendChild(extensionUI);
      },
    });
  }
});







// service-worker.js

chrome.commands.onCommand.addListener(async (command) => {
  console.log(`Command "${command}" triggered`);

  // Get the currently active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check if a tab is available
 
});

chrome.commands.onCommand.addListener(function (command) {
  if (command === "_") {
    // Replace this with your extension's logic to activate when the default shortcut is pressed.
    // For example, open a popup or perform an action.
    console.log("Extension activated by default keyboard shortcut.");
  }
});
const GOOGLE_ORIGIN = 'https://www.google.com';


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


chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));



  //indexedD

/* let animationTriggers = [
  { "command": 'hello', "animationIndex": 0 , /* count:1 },
  { "command": 'Hello', "animationIndex": 0 , /* count:1 },
  { "command": 'good', "animationIndex": 1,/* count:1  },
  { "command": 'Good', "animationIndex": 1,/* count:1  },
  { "command": 'morning', "animationIndex": 2,/* count:1/ },
  { "command": 'Morning', "animationIndex": 2,/* count:1 / },
  { "command": 'how', "animationIndex": 3 },
  { "command": 'How', "animationIndex": 3 },
   { "command": 'are', "animationIndex": 4 },
   { "command": 'Are', "animationIndex": 4 },
   { "command": 'you', "animationIndex": 5 },
   { "command": 'You', "animationIndex": 5 },
  { "command": 'i', "animationIndex": 6 },
  { "command": 'I', "animationIndex": 6 },
  { "command": 'am', "animationIndex": 7 },
  { "command": 'Am', "animationIndex": 7 },
  { "command": 'fine', "animationIndex": 8 },
  { "command": 'Fine', "animationIndex": 8 },
  { "command": 'what', "animationIndex": 9 },
  { "command": 'What', "animationIndex": 9 },
  { "command": 'about', "animationIndex": 10 },
  { "command": 'About', "animationIndex": 10 },
  { "command": 'parents', "animationIndex": 11 }, 
  { "command": 'Parents', "animationIndex": 11 }, ]


let db=null;
function create_database(){
    const request=self.indexedDB.open('MyTestDB');

    request.onerror=function(event){
       console.log("Problem opening DB.");
    }

    request.onupgradeneeded=function(event){
        db=event.target.result;

        let objectStore=db.createObjectStore('animationTriggers',{
          keyPath:'command'
        });
        objectStore.transaction.oncomplete=function(event){
          console.log("objectstore created");
        }
    }

    request.onsuccess=function(event){
       db=event.target.result;

       console.log("DB OPENED");
       insert_records(animationTriggers);
    }
}


function insert_records(records){
  if(db){
    const insert_transaction=db.transaction("animationTriggers","readwrite");
    const objectStore=insert_transaction.objectStore("animationTriggers");
    insert_transaction.oncomplete=function(){
      console.log("ALL INSERT TRANSACTION COMPLETE")
    }

    insert_transaction.onerror=function(){
      console.log("PROBLEM INSERTING RECORDS")
    }
    animationTriggers.forEach(animation=>{
      let request=objectStore.add(animation);

      request.onsuccess=function(){
        console.log("Added:",animation);
      }
    });
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(create_database());
});
 */
/* chrome.storage.local.get('firstTime', function (result) {
  if (!result.firstTime) {
    // Perform first-time setup
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore('animationTriggers', { keyPath: 'commands' });

      // Add animations to the object store when available
      // For example:
      // objectStore.add({ id: 1, name: 'Animation1', data: animationData1 });
      // objectStore.add({ id: 2, name: 'Animation2', data: animationData2 });
    };

    request.onsuccess = function () {
      // Set the flag to true to indicate it's not the first time
      chrome.storage.local.set({ firstTime: true });
      console.log("extension is opening first time")
    };
  }
});
 */
/* 
chrome.commands.onCommand.addListener(function(command) {
  if (command === "activate") {
    // Open your extension popup
    console.log("activating")
    const views = chrome.extension.getViews({ type: "popup" });

    if (views && views.length > 0) {
      // Send a message to open the side panel
      views[0].chrome.runtime.sendMessage({ openSidePanel: true });
    }
  }
});
 *//* let gltfAnimations = null;

// Inside background.js
// Inside background.js (service worker)
self.addEventListener('message', (event) => {
  const message = event.data;

  if (message.type === 'gltfAnimations') {
       gltfAnimations = message.data;
      // Now you can use the gltfAnimations array in your service worker
      console.log('Service Worker received gltfAnimations:', gltfAnimations);
      
      // Perform any actions you need with the gltfAnimations array here
      // Perform any actions you need with the gltfAnimations array here
      if (gltfAnimations) {
        // Example: Loop through the animations and do something
        for (const animation of gltfAnimations) {
            console.log('Animation Name:', animation.name);
            // Perform actions with the animation data
        }
    }
  }
}); */

//console.log("array",gltfAnimations)
  /* (function () {
  // IndexedDB
  var indexedDB = self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB || self.OIndexedDB || self.msIndexedDB,
      IDBTransaction = self.IDBTransaction || self.webkitIDBTransaction || self.OIDBTransaction || self.msIDBTransaction,
      dbVersion = 1.0;

  // Create/open database
  var request = indexedDB.open("animationFiles", dbVersion),
      db,
      createObjectStore = function (dataBase) {
          // Create an objectStore for animations
          console.log("Creating objectStore");
          dataBase.createObjectStore("animations");
      },

      getAnimationFromURL = function () {
          // Replace 'animation.glb' with the HTTP link to your GLB animation
          var animationURL = ' http://127.0.0.1:5500/assets/thirty.glb';
         // let gltfAnimations = [];      
   /*  animationURL,
        (gltf) => {
            gltfAnimations = gltf.animations;
            console.log("animationAFTER"+gltfAnimations) */
          
             /* self.addEventListener('message', (event) => {
              // Check the type of the message
              if (event.data.type === 'gltfAnimations') {
                  let gltfAnimations = event.data.data;
                  console.log("array wanted"+gltfAnimations)
          
                  // Now you can use the gltfAnimations array in the background.js script
                  // Do whatever you need to do with it here
              } 
         // }); 
          // Use the fetch API to make a network request
    fetch(animationURL)
    .then(response => {
      if (response.ok) {
        return response.arrayBuffer();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then(arrayBuffer => {
      console.log("Animation retrieved");

      // ArrayBuffer as response
      console.log("ArrayBuffer:", arrayBuffer);

      // Put the received ArrayBuffer into IndexedDB
      parseGLBAndStoreAnimations(arrayBuffer);
    })
    .catch(error => {
      console.error('Fetch error:', error);
    }); */
 
          // Create XHR
          /* var xhr = new XMLHttpRequest();
          xhr.open("GET", animationURL, true);
          xhr.responseType = "arraybuffer"; // Set the response type to arraybuffer

          xhr.addEventListener("load", function () {
              if (xhr.status === 200) {
                  console.log("Animation retrieved");

                  // ArrayBuffer as response
                  var arrayBuffer = xhr.response;
                  console.log("ArrayBuffer:", arrayBuffer);

                  // Put the received ArrayBuffer into IndexedDB
                  putAnimationInDb(arrayBuffer);
              }
          }, false);

          // Send XHR
          xhr.send();  */
   //   },
    
    
   /*    putAnimationInDb = function (arrayBuffer) {
          console.log("Putting animation in IndexedDB");

          // Open a transaction to the database
          var transaction = db.transaction(["animations"], "readwrite");

          // Put the ArrayBuffer into the database
    var objectStore = transaction.objectStore("animations");
    var putRequest = objectStore.put(arrayBuffer, "animation");

    // Handle the success and error events of the put request
    putRequest.onsuccess = function () {
        console.log("Animation stored successfully in IndexedDB");
    };

    putRequest.onerror = function (event) {
        console.error("Error storing animation in IndexedDB:", event.target.error);
    };
          // Retrieve the animation that was just stored
          transaction.objectStore("animations").get("animation").onsuccess = function (event) {
              var animationFile = event.target.result;
              console.log("Got animation!", animationFile);

              // Handle the animation data as needed
              // For example, you can use a GLTF viewer to display the animation
          };
      };

  request.onerror = function (event) {
      console.log("Error creating/accessing IndexedDB database");
  };

  request.onsuccess = function (event) {
      console.log("Success creating/accessing IndexedDB database");
      db = request.result;

      db.onerror = function (event) {
          console.log("Error creating/accessing IndexedDB database");
      };

      // Interim solution for Google Chrome to create an objectStore. Will be deprecated
      if (db.setVersion) {
          if (db.version != dbVersion) {
              var setVersion = db.setVersion(dbVersion);
              setVersion.onsuccess = function () {
                  createObjectStore(db);
                  getAnimationFromURL();
              };
          }
          else {
              getAnimationFromURL();
          }
      }
      else {
          getAnimationFromURL();
      }
  };

  // For future use. Currently only in latest Firefox versions
  request.onupgradeneeded = function (event) {
      createObjectStore(event.target.result);
  };
})();
 */
 

 

/* // Define the IndexedDB version
const dbVersion = 1.0;

// Function to open the IndexedDB
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("animationFiles", dbVersion);

    request.onerror = function (event) {
      console.error("Error creating/accessing IndexedDB database");
      reject(event);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      console.log("Success creating/accessing IndexedDB database");
      resolve(db);
    };

    request.onupgradeneeded = function (event) {
      createObjectStore(event.target.result);
    };
  });
}

// Function to create an object store for animations
function createObjectStore(dataBase) {
  console.log("Creating objectStore");
  dataBase.createObjectStore("animations");
}

// Function to fetch and store animations in IndexedDB
// ... (Previous code remains the same)

// Function to fetch and store animations in IndexedDB
// ... (Previous code remains the same)

// Function to fetch and store animations in IndexedDB
function fetchAndStoreAnimations(animationURLs) {
  openIndexedDB()
    .then((db) => {
      const transaction = db.transaction(["animations"], "readwrite");
      const objectStore = transaction.objectStore("animations");

      // Create a promise-based queue for animation processing
      const animationQueue = animationURLs.reduce(
        (queue, animationURL, index) => {
          return queue.then(() => {
            return fetch(animationURL)
              .then((response) => {
                if (response.ok) {
                  return response.arrayBuffer();
                } else {
                  throw new Error(
                    `Failed to fetch animation ${index}: ${response.status} ${response.statusText}`
                  );
                }
              })
              .then((arrayBuffer) => {
                const key = `animation_${index}`; // Unique key for each animation
                const request = objectStore.put(arrayBuffer, key);
                return new Promise((resolve, reject) => {
                  request.onsuccess = resolve;
                  request.onerror = (error) => {
                    console.error(`Failed to store animation ${index} in IndexedDB:`, error);
                    reject(error);
                  };
                });
              })
              .catch((error) => {
                console.error(error);
                // Continue processing the next animation even if there's an error
              });
          });
        },
        Promise.resolve()
      );

      animationQueue
        .then(() => {
          // All animations have been processed, close the transaction and database
          transaction.oncomplete = () => {
            console.log("Transaction completed.");
            db.close();
          };
        })
        .catch((error) => {
          console.error("Error processing animations:", error);
        });
    })
    .catch((error) => {
      console.error("Error opening IndexedDB:", error);
    });
}

// ... (Rest of the code remains the same)

// ... (Rest of the code remains the same)


// Function to retrieve animations from IndexedDB
async function getAnimationsFromIndexedDB() {
  const db = await openIndexedDB();
  const transaction = db.transaction(["animations"], "readonly");

  const animations = [];

  for (let index = 0; index < 30; index++) {
    const key = `animation_${index}`;
    const request = transaction.objectStore("animations").get(key);

    request.onsuccess = function (event) {
      const animation = event.target.result;
      if (animation) {
        animations.push(animation);
        console.log(`Animation ${index} retrieved from IndexedDB`);
      }
    };
  }

  return animations;
}

// List of animation URLs to fetch and store
const animationURLs = [
  'http://127.0.0.1:5500/assets/thirty.glb',
  // Add URLs for all 30 animations
];

// Start the process
async function start() {
  try {
    await fetchAndStoreAnimations(animationURLs);

    // At this point, animations are stored in IndexedDB
    // You can retrieve them when needed
    const animations = await getAnimationsFromIndexedDB();

    // Use the retrieved animations as needed
    console.log(animations);
  } catch (error) {
    console.error("Error fetching and storing animations:", error);
  }
}

// Call the start function to initiate the process
start();
 */

// Inside your extension's background script or content script

var db;
var dbVersion = 1.0;

var openDB = function () {
  var indexedDB = self.indexedDB || self.webkitIndexedDB || self.mozIndexedDB || self.OIndexedDB || self.msIndexedDB;
  var request = indexedDB.open("animationFiles", dbVersion);

  request.onerror = function (event) {
    console.error("Error creating/accessing IndexedDB database");
  };

  request.onsuccess = function (event) {
    console.log("Success creating/accessing IndexedDB database");
    db = request.result;

    db.onerror = function (event) {
      console.error("Error creating/accessing IndexedDB database");
    };

    // Check if the database needs an upgrade (may be required for version control)
    if (db.version != dbVersion) {
      var setVersion = db.setVersion(dbVersion);
      setVersion.onsuccess = function () {
        createObjectStore(db);
        // Fetch and store the animation data here
        fetchAndStoreAnimation();
      };
    } else {
      // Fetch and store the animation data here
      fetchAndStoreAnimation();
    }
  };

  request.onupgradeneeded = function (event) {
    createObjectStore(event.target.result);
  };
};

var createObjectStore = function (dataBase) {
  console.log("Creating objectStore");
  dataBase.createObjectStore("animations");
};

var putAnimationInDb = function (animationData) {
  console.log("Putting animation in IndexedDB");
  var transaction = db.transaction(["animations"], "readwrite");
  var objectStore = transaction.objectStore("animations");
  var putRequest = objectStore.put(animationData, "animation");

  putRequest.onsuccess = function () {
    console.log("Animation stored successfully in IndexedDB");
  };

  putRequest.onerror = function (event) {
    console.error("Error storing animation in IndexedDB:", event.target.error);
  };
};

var fetchAndStoreAnimation = function () {
  var animationURL = 'http://127.0.0.1:5500/assets/thirty.glb';

  fetch(animationURL)
    .then(response => {
      if (response.ok) {
        return response.arrayBuffer();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then(arrayBuffer => {
      console.log("Animation retrieved");

      // Parse the GLB file to extract the animation data if needed
      // For example, you can use a library like three.js
      var loader = new THREE.GLTFLoader();
      loader.parse(arrayBuffer, '', (gltf) => {
        if (gltf.animations.length > 0) {
          var animationData = gltf.animations[0]; // Assuming the first animation is extracted
          putAnimationInDb(animationData);
        }
      });
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
};

// Call openDB() as needed within your extension logic
openDB();
