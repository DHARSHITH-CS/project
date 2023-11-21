import * as THREE from './three.js-master/three.js-master/build/three.module.js';
import { GLTFLoader } from './three.js-master/three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './three.js-master/three.js-master/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from './three.js-master/three.js-master/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('canvas.webgl');
//const animationListContainer = document.getElementById('animation-list');

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height);
camera.position.y = 1;
camera.position.z = 2.5;
scene.add(camera);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

const amblight = new THREE.AmbientLight(0xffffff, 1);
light.position.set(-2, -2, -5);
scene.add(amblight);

let gltfAnimations = [];
let mixer; // Animation mixer for playing animations

// Load the GLB using a Web Worker
let animationIndex = -1; // Declare and initialize animationIndex
const worker = new Worker('worker.js');
const glbUrl = 'http://127.0.0.1:5500/assets/Task.glb'; // Update with your GLB URL

worker.addEventListener('message', (event) => {
    console.log('Main script received GLB data from Web Worker');
    const glbArrayBuffer = event.data;
    const gltfBlob = new Blob([glbArrayBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(gltfBlob);

    gltfLoader.load(
        url,
        (gltf) => {
            gltfAnimations = gltf.animations;
            scene.add(gltf.scene);

            mixer = new THREE.AnimationMixer(gltf.scene);

           // displayAnimationList();
           // playAnimationsSequentially();
           playAnimation(animationIndex);

        }
    );
});

// Request the GLB from the server using the Web Worker
console.log('Main script is about to request GLB from Web Worker');
worker.postMessage(glbUrl);


/* function playAnimationsSequentially() {
    if (gltfAnimations.length > 0 && mixer) {
        let currentIndex = 0;

        const playNextAnimation = () => {
            if (currentIndex >= gltfAnimations.length) {
                currentIndex = 0; // Reset index to play animations from the beginning
            }

            const animation = gltfAnimations[currentIndex];

            // Stop any previously playing animations
            mixer.stopAllAction();

            // Play the next animation
            mixer.clipAction(animation).play();

            currentIndex++;

            // Schedule the next animation to play after the current animation's duration
            setTimeout(playNextAnimation, animation.duration * 1000);
        };

        // Start playing animations
        playNextAnimation();
    }
}
 */
/* function displayAnimationList() {
    if (animationListContainer && gltfAnimations.length > 0) {
        const buttonsHTML = gltfAnimations
            .map((animation, index) => {
                return `<button style="background-color: white;" class="animation-button" data-index="${index}">${animation.name}</button>`;
            })
            .join('');

        animationListContainer.innerHTML = buttonsHTML;

        // Attach event listeners to the animation buttons
        const animationButtons = document.querySelectorAll('.animation-button');
        animationButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                const index = parseInt(event.target.dataset.index);
                playAnimation(index);
            });
        });
    }
}
 */
function playAnimation(index) {
    const a=gltfAnimations.length
    console.log("outside if play animationfun")
   // console.log(a);
   // console.log(index)
   // console.log(mixer)
    if (index >= 0 && index < gltfAnimations.length && mixer) {
        const animation = gltfAnimations[index];
        console.log("inside if play animationfun")
       // console.log(a);
       // console.log(index)
       // console.log(mixer)
        // Stop any previously playing animations
        mixer.stopAllAction();
        console.log("after stopallaction inside playanimationfunction");
              

        // Play the selected animation
        mixer.clipAction(animation).play();
    } else {
        console.log('Animation not found.');
    }
    console.log("loop is executing")
}

const cursor = { x: 0, y: 0 };
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.width - 0.5);
});

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

const controls = new OrbitControls(camera, canvas);

/* window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}); */

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const animate = () => {
    // Update the animation mixer
    if (mixer) {
        mixer.update(0.016);
    }

    renderer.render(scene, camera);
    controls.update();
    window.requestAnimationFrame(animate);
};

animate();

// Voice control logic

//let animationIndex = '';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();
// Check if recognition is supported
/* if (!recognition) {
    console.error('Speech recognition is not supported in this browser.');
} else {
    // Set event handlers after successful initialization
   /*  recognition.onresult = (event) => {
        // Handle speech recognition results here
        const result = event.results[event.results.length - 1];
       // const transcript = result[0].transcript.trim();
       // console.log('Recognized words: ' + transcript);
    }; 

    // Start recognition
   // recognition.start();
}
 */
//let recognition;
/* let interimSentences = ['', '', ''];
recognition.onresult = (event) => {
    const interimSentence1 = event.results[event.results.length - 1][0].transcript;
    document.getElementById('interimSentence1').innerText = interimSentence1;
   
    interimSentences[0] = interimSentence1;
    console.log("interimSentence1"+interimSentence1)
};
recognition.onresult = (event) => {
    const interimSentence2 = event.results[event.results.length - 1][0].transcript;
    document.getElementById('interimSentence2').innerText = interimSentence2;
    interimSentences[1] = interimSentence2;
    console.log("interimSentence2"+interimSentence2)
};
recognition.onresult = (event) => {
    const interimSentence3 = event.results[event.results.length - 1][0].transcript;
    document.getElementById('interimSentence3').innerText = interimSentence3;
    interimSentences[2] = interimSentence3;
    console.log("interimSentence3"+interimSentence3)
};
// Function to check if all interim sentences are available
function areInterimSentencesComplete() {
    return interimSentences.every(sentence => sentence.trim() !== '');
}

// Function to combine interim sentences into a final sentence
function combineInterimSentences() {
    return interimSentences.join(' '); // Combine with spaces, adjust as needed
}
 */

// Wrap the event listener code inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', startRecording);
    /* document.getElementById('stopButton').addEventListener('click', stopRecording); */
});


// Define animation triggers
const animationTriggers = [
    { command: 'hello', animationIndex: 0 , /* count:1 */},
    { command: 'good', animationIndex: 1,/* count:1 */ },
    { command: 'morning', animationIndex: 2,/* count:1 */ },
    { command: 'how', animationIndex: 3 },
    /* { command: 'are', animationIndex: 4 },
     { command: 'you', animationIndex: 5 },
    { command: 'i', animationIndex: 6 },
    { command: 'am', animationIndex: 7 },
    { command: 'fine', animationIndex: 8 },
    { command: 'what', animationIndex: 9 },
    { command: 'about', animationIndex: 10 },
    { command: 'parents', animationIndex: 11 }, 
    */
    // Add more animation triggers as needed
];
let animationQueue = []; // Queue to manage animations

// Define a variable to track recording status
let isRecording=false;

// Define a variable to track recognized commands during the current session
//let recognizedCommands = [];

// Define a variable to store the transcribed text
//let transcribedText = '';

// Define a variable to track the currently playing animation
//let currentPlayingAnimation = null; // Define this globally
// Initialize the speech recognition
/* function initializeRecognition() {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
        console.log('Voice recognition started');
    };

    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript.trim().toLowerCase();
        console.log('Recognized: ' + transcript);

        // Find a matching animation trigger
        const trigger = animationTriggers.find((item) => transcript.includes(item.command));

        if (trigger) {
            console.log(`Triggered animation: ${gltfAnimations[trigger.animationIndex].name}`);
            playAnimation(trigger.animationIndex);
        }
    };

    recognition.onend = () => {
        console.log('Voice recognition ended');
        startRecording();
    };

    recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
    };
} */


// Check if the browser supports the Web Speech API
/* if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
 */
    // Increase the listening time (in milliseconds) by setting the `continuous` and `interimResults` properties
    //recognition.continuous = true; // This allows continuous listening
    //recognition.interimResults = true; // This provides interim results during listening
/* 
    // Event handler for receiving transcribed text
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log('Transcript: ', transcript);
        // You can do something with the transcript, like displaying it in a text box.
    };
 */
    // Start listening
   // recognition.start();

    // Stop listening after a specific time (e.g., 10 seconds)
    
       
/* } else {
    console.error('Speech recognition is not supported in this browser.');
} */

//let timeoutId; // Variable to hold the timeout ID
//let startTime; // Variable to hold the start time
//let recordingTimeout;
//let recognitionInterval;
/* function startRecognitionInterval() {
    // Clear the transcribed text when starting a new transcription
    transcribedText = '';

    // Start the recognition
    recognition.start();

    // Set an interval to ensure recognition continues after pauses
    recognitionInterval = setInterval(() => {
        if (!isRecording) {
            recognition.start();
        }
    }, 1000); // Adjust the interval duration as needed (e.g., 1000 milliseconds = 1 second)
} */



function startRecording() {
    console.log('Recording started.');
    // Set isRecording to true when recording starts
    isRecording = true;
    
     // Reset the list of recognized commands for the current session
     //recognizedCommands = [];

      // Stop the currently playing animation (if any)
    //stopCurrentAnimation();
    // Clear the transcribed text
    //transcribedText = '';

    //console.log("Starting voice recognition");
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = true;
    recognition.onresult = handleSpeechResult;
    recognition.onstart = () => {
        
            var speechRecognizer = new webkitSpeechRecognition();
            speechRecognizer.continuous = true;
            speechRecognizer.interimResults = true;
            speechRecognizer.lang = "en-US";
            
            
        
        setStatus('Recording...');
        // Check if the animation queue is empty before starting the timeout
       /*  recordingTimeout = setTimeout(() => {
            console.log('Recording timed out.');
            stopRecording();
        }, 60000); // 1 minute (60,000 milliseconds)
     */
        // ... (rest of your code)
        
    
    }
    
    recognition.onend = () => {
        console.log('Recording ended.');
        setStatus('Not recording');
        // Clear the timeout when recognition ends
        
        // Set isRecording to false when recording ends
        isRecording = false;
        // Restart recording after a short delay (e.g., 1 second)
        
        setTimeout(startRecording, 1000)
        
        
      
    };
    
    recognition.start();
   


    document.getElementById('startButton').disabled = true;
   

}


// Function to play animations for a single word
function playAnimationsForWord(word) {
   // console.log("before loop playAnimationsForWord fun")
    for (const trigger of animationTriggers) {
        //console.log("inside loop playAnimationsForWord fun")

        if (word.includes(trigger.command)) {
           // console.log("inside 1st if statement playAnimationsForWord fun" )
           /*  if (!recognizedCommands.includes(trigger.command)) {
                console.log("inside 2nd if statement playAnimationsForWord fun")
                recognizedCommands.push(trigger.command);
 */
                // Play the animation for the word
                playAnimation(trigger.animationIndex);
                //setStatus('Playing animation: ' + gltfAnimations[trigger.animationIndex].name);
                //console.log("currently playing")
                //console.log(gltfAnimations[trigger.animationIndex]/* .name */)


                // Wait for the animation to finish before proceeding to the next word
                const animationDuration = gltfAnimations[trigger.animationIndex].duration * 1000;
                setTimeout(() => {
                    console.log(`Animation for "${word}" is completed.`);
                    // Resume playing the next word's animation
                    playNextWordAnimation();
                    console.log("moving to next word")
                }, animationDuration);
            }
            console.log("loop iterating")
            
        }
        console.log("loop ends")
    }


// Function to play animations for each word in a sentence
/* function playAnimationsForSentence(sentence) {
    console.log("entered playAnimationforSentence")
    const words = sentence.split(' ');
    console.log("from playAnimationsForSentence words"+ words)
    animationQueue=words;
    console.log('from playAnimationsForSentence animationQueue'+ animationQueue)
    playNextWordAnimation();
} */

// Function to play the next word's animation
function playNextWordAnimation() {
    console.log("animationQueue.length"+animationQueue.length)
    if (animationQueue.length > 0) {
        
        const word = animationQueue.shift();
        console.log('Playing animation for word:', word);
        playAnimationsForWord(word);
    }
    else {
        console.log("animation is going to stop")
        stopAnimations(); // Stop all animations when the queue is empty
        console.log("animation is getting stopped")
    }
}




function stopAnimations() {
    console.log("before stop animations")
    if (mixer) {
        console.log("inside if stopanimation")
        mixer.stopAllAction();
        console.log("after stopallaction in stopanimation")
    }
    console.log("after if in stop animation")
}
// Create an array to store transcribed text
let transcribedTextArray = [];

 /* function stopRecording() {
    console.log('Recording ended....');
   // clearTimeout(recordingTimeout);

    recognition.stop();
    document.getElementById('startButton').disabled = false;
    //document.getElementById('stopButton').disabled = true;

// Append transcribed text to the array
transcribedTextArray.push(transcribedText);

console.log("from transcribedTextArray"+transcribedTextArray)
    // Stop all animations without considering repeated words
    stopAnimations();
    // Copy transcription to clipboard
    const transcriptionElement = document.getElementById('transcription');
    //const transcriptionText = transcriptionElement.innerText.trim();
    //console.log('Transcribed Text:', transcribedText); // Add this line
   /*  if (transcriptionText.trim() !== '') {
        playAnimationsForSentence(transcriptionText);
        //copyToClipboard(transcriptionText);
        //setStatus('Transcription copied to clipboard!');
        console.log('Full Transcribed Text:', transcribedText); 
//}
} */
 
/* function stopCurrentAnimation() {
    // Stop the currently playing animation (if any)
    if (currentPlayingAnimation && mixer) {
        mixer.uncacheAction(currentPlayingAnimation);
        mixer.stopAllAction();
        console.log("from stopCurrentAnimation")
        currentPlayingAnimation = null;
    }
} */

 
//let isPlaying = false; // Flag to indicate if animations are currently playing
 
// Modify your handleSpeechResult function to handle repeated words
//let recognizedWords = [];
//let currentSentence = '';

// Create an array to store transcribed text
//let transcribedTextArray = [];

// Create a variable to keep track of the current index
//let currentIndex = 0;


function handleSpeechResult(event) {
    const transcriptionElement = document.getElementById('transcription');
    transcriptionElement.innerText = '';

    // Create a variable to store the recognized text and append recognized words
    let recognizedPhrase = '';

    for (const result of event.results) {
        let text = result[0].transcript.trim();
        transcriptionElement.innerText += text + ' ';

       // Append recognized words to the recognizedPhrase variable
       recognizedPhrase += text + ' ';
    }
// Split the text into individual words
const words = recognizedPhrase.split(/\s+/); // Split by one or more spaces
// Initialize the text variable with an empty string
let text = '';
// Collect all recognized words in a phrase
        recognizedPhrase += text + ' ';
// Collect all recognized words in a phrase

       for (const word of words) {
        if (word) {
            // Only add non-empty words to the animation queue
            animationQueue.push(word);
        }}
        if (event.results[0].isFinal) {
            transcribedTextArray.push(recognizedPhrase);
            console.log("from handlespeech array: "+transcribedTextArray)

            // Update the transcribed text display in the UI
        updateTranscribedTextDisplay();

            
        }
    
        //transcribedText += recognizedPhrase;

    // You can also update other UI elements or perform actions based on recognizedPhrase here
    console.log('Transcribed Text:', recognizedPhrase); // Real-time recognized text

    // Continue playing animations or perform other actions as needed
   // playNextAnimation();
    

console.log('Animation Queue:', animationQueue); // Debug line

//playNextAnimation();
}

// Function to update the transcribed text display
function updateTranscribedTextDisplay() {
    // Clear the container
    transcribedTextContainer.innerHTML = '';

    // Loop through the transcribedTextArray and create a <p> element for each entry
    for (const transcribedText of transcribedTextArray) {
        const paragraph = document.createElement('p');
        //console.log("paragraph"+paragraph)
        paragraph.textContent = transcribedText;
        transcribedTextContainer.appendChild(paragraph);
        //console.log("paragraph after"+paragraph)
    }
}


/* function playNextAnimation() {
    if (animationQueue.length > 0) {
        const word = animationQueue.shift();
        console.log('Playing animation for word:', word);
        
        // Play your animation for the word here

        // Call the function recursively to play the next animation
        playNextAnimation();
    }
}
 */
function setStatus(statusText) {
    const statusElement = document.getElementById('status');
    statusElement.innerText = statusText;
  
    if (statusText === 'Recording...') {
      statusElement.classList.add('recording');
    } else {
      statusElement.classList.remove('recording');
    }
  }
  /* function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  } */

 /*  if (annyang) {
    // Initialize annyang
    annyang.start();

    // Define voice commands
    annyang.addCommands({
        'hello': function() {
            playAnimation(0); // Replace with the index of your 'hello' animation
        },
        'good morning': function() {
            playAnimation(1); // Replace with the index of your 'good morning' animation
        },
        // Add more voice commands as needed
    });

    // Set a callback for when annyang encounters an error
    annyang.addCallback('error', function(error) {
        console.error('Annyang error:', error);
    });
}
 */
/* // Get references to the button and the transcribed text container
const playAnimationsButton = document.getElementById('playAnimationsButton');
const transcribedTextContainer = document.getElementById('transcribedTextContainer');

// Variable to keep track of which group of lines is currently being played
let currentGroupIndex = 0;

// Function to play animations for a group of lines (three lines at a time)
function playAnimationsForGroup(lines) {
    // Clear the animation queue
    animationQueue = [];

    // Add the lines to the animation queue
    animationQueue.push(...lines.split('\n'));

    // Play the animations for the lines in the queue
    playNextWordAnimation();
}

// Event listener for the button click
playAnimationsButton.addEventListener('click', () => {
    // Get all the text lines from the transcribed text container
    const textLines = transcribedTextContainer.innerText.trim().split('\n');
    console.log("new try"+textLines); // Debugging statement

    // Calculate the start and end indices for the current group of lines
    const startIndex = currentGroupIndex * 3;
    const endIndex = startIndex + 3;

    // Check if there are lines in the current group to play
    if (textLines.length >= 3) {
       // Play animations for the first three lines
    const linesToPlay = textLines.slice(0, 3).join('\n');

    console.log('Lines to play:', linesToPlay); // Debugging statement
        // Play animations for the lines in the current group
        playAnimationsForGroup(linesToPlay);

        /* // Increment the group index for the next button click
        currentGroupIndex++; 
    } else {
        // All lines have been played
        console.log('All lines have been played.');
    }
});

  
 */

// Create an array to store transcribed text
const sentencesPerGroup = 3; // Number of sentences to play animations for in each group

// Initialize the current group index
let currentGroupIndex = 0;

//let currentSentenceIndex = 0; // Initialize the index to 0
// playedSentences = [];


// Function to play animations for a group of words
function playAnimationsForGroup(words) {
    // Clear the animation queue
    //animationQueue = [];

    // Add the words to the animation queue
    animationQueue.push(...words);
    console.log(" from playAnimationsForGroup (words):"+words)
    console.log("animationQueue"+animationQueue)


    // Play the animations for the words in the queue
    playNextWordAnimation();
}

// Function to update the transcribed text display
/* function updateTranscribedTextDisplay() {
    // Clear the container
    transcribedTextContainer.innerHTML = '';

    // Loop through the transcribedTextArray and create a <p> element for each entry
    for (const transcribedText of transcribedTextArray) {
        const paragraph = document.createElement('p');
        paragraph.textContent = transcribedText;
        transcribedTextContainer.appendChild(paragraph);
    }
}
 */
// Event listener for the button click
playAnimationsButton.addEventListener('click', () => {
    console.log('currentGroupIndex:', currentGroupIndex);
    // Get all the text lines from the transcribed text container
    const textLines = transcribedTextContainer.innerText.trim().split('\n');
    console.log("textlines:"+textLines)


    // Remove empty lines
    const nonEmptyLines = textLines.filter(line => line.trim() !== '');
    console.log("nonEmptyLines:"+nonEmptyLines)


    
       // Calculate the start and end indices for the current group
       const startIndex = 0;
    const endIndex = 3;

       console.log('startIndex:', startIndex);
       console.log('endIndex:', endIndex);
        // Check if there are enough sentences for the current group
    if (startIndex < nonEmptyLines.length) {
       // Take the next three sentences for this group
       console.log("inside checking if statement")
       const sentencesToPlay = nonEmptyLines.slice(startIndex, endIndex);


       // Combine the sentences into one string
       const textToPlay = sentencesToPlay.join(' ');

       // Tokenize the text into individual words
       const wordsToPlay = textToPlay.split(' ');

       // Debugging: Log the sentences and words for this group
       console.log('Sentences to Play:', sentencesToPlay);
       console.log('text to Play:', textToPlay)
       console.log('Words to Play:', wordsToPlay);

       // Play animations for the words in the current group
       playAnimationsForGroup(wordsToPlay);
       console.log("currentgrouindex before increment"+currentGroupIndex)

       
       // Remove the processed sentences from the container
       transcribedTextContainer.innerText = nonEmptyLines.slice(endIndex).join('\n');
    }
    else {
        // No more sentences to play
        console.log('No more sentences to play.');
        //playAnimationsButton.disabled = true;
    }
      /*  // Update the transcribed text display
       updateTranscribedTextDisplay();*/

   
});

// Define a variable to keep track of animation playback state
//let isPlaying = false;

