import * as THREE from './three.js-master/three.js-master/build/three.module.js';
import { GLTFLoader } from './three.js-master/three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from './three.js-master/three.js-master/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from './three.js-master/three.js-master/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('canvas.webgl');


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const scene = new THREE.Scene();
scene.background=new THREE.Color(0xffffff)

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

const amblight = new THREE.AmbientLight(0x404040, 100);
//light.position.set(-2, -2, -5);
scene.add(amblight);

let gltfAnimations = [];
console.log("animation array"+gltfAnimations)
let mixer; // Animation mixer for playing animations

// Load the GLB using a Web Worker
let animationIndex = -1; // Declare and initialize animationIndex
const worker = new Worker('worker.js');
const glbUrl = 'http://127.0.0.1:5500/assets/thirty.glb'; // Update with your GLB URL

worker.addEventListener('message', (event) => {
    console.log('Main script received GLB data from Web Worker');
    const  glbArrayBuffer  = event.data; // Extract gltfAnimations
    const gltfBlob = new Blob([glbArrayBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(gltfBlob);

    gltfLoader.load(
        url,
        (gltf) => {
            gltfAnimations = gltf.animations;
            console.log("animation array AFTER"+gltfAnimations)
            //worker.postMessage({ type: 'gltfAnimations', data: gltfAnimations });

            gltf.scene.position.set(0, 0, 0);
            scene.add(gltf.scene);

            mixer = new THREE.AnimationMixer(gltf.scene);

           // navigator.serviceWorker.controller.postMessage({ type: 'gltfAnimations', data: gltfAnimations });
           playAnimation(animationIndex);
           // Send gltfAnimations array to the service worker
 worker.postMessage({ type: 'gltfAnimations', data: gltfAnimations });
           
        }
    );
});
console.log("animation array AFTER the fun"+gltfAnimations)

// Request the GLB from the server using the Web Worker
console.log('Main script is about to request GLB from Web Worker');
worker.postMessage(glbUrl);



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


// Wrap the event listener code inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startButton').addEventListener('click', startRecording);
    /* document.getElementById('stopButton').addEventListener('click', stopRecording); */
});


// Define animation triggers
const animationTriggers = [
    { command: 'hello', animationIndex: 0 , /* count:1 */},
    { command: 'Hello', animationIndex: 0 , /* count:1 */},
    { command: 'good', animationIndex: 1,/* count:1 */ },
    { command: 'Good', animationIndex: 1,/* count:1 */ },
    { command: 'morning', animationIndex: 2,/* count:1 */ },
    { command: 'Morning', animationIndex: 2,/* count:1 */ },
    { command: 'how', animationIndex: 3 },
    { command: 'How', animationIndex: 3 },
     { command: 'are', animationIndex: 4 },
     { command: 'Are', animationIndex: 4 },
     { command: 'you', animationIndex: 5 },
     { command: 'You', animationIndex: 5 },
    { command: 'i', animationIndex: 6 },
    { command: 'I', animationIndex: 6 },
    { command: 'am', animationIndex: 7 },
    { command: 'Am', animationIndex: 7 },
    { command: 'fine', animationIndex: 8 },
    { command: 'Fine', animationIndex: 8 },
    { command: 'what', animationIndex: 9 },
    { command: 'What', animationIndex: 9 },
    { command: 'about', animationIndex: 10 },
    { command: 'About', animationIndex: 10 },
    { command: 'parents', animationIndex: 11 }, 
    { command: 'Parents', animationIndex: 11 }, 

    
    // Add more animation triggers as needed
];
/* chrome.runtime.sendMessage({ action: 'storeAnimationTriggers', animationTriggers });
storeAnimationTriggers(animationTriggerData); */
let animationQueue = []; // Queue to manage animations

// Define a variable to track recording status
let isRecording=false;
// Create an array to store transcribed text
let transcribedTextArray = [];
var wordsToPlay=[];
var sentencesToPlay=[]; 
var wordsAnimateToPlay=[];


function playAnimation(index) {
   // const a=gltfAnimations.length
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

function startRecording() {
    console.log('Recording started.');
    // Set isRecording to true when recording starts
    isRecording = true;
    
     
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
function playAnimationsForWord(recognizedPhrase) {
   // console.log("before loop playAnimationsForWord fun")
    for (const trigger of animationTriggers) {
        //console.log("inside loop playAnimationsForWord fun")

        if (recognizedPhrase.includes(trigger.command)) {
           
                // Play the animation for the word
                playAnimation(trigger.animationIndex);
                //setStatus('Playing animation: ' + gltfAnimations[trigger.animationIndex].name);
                //console.log("currently playing")
                //console.log(gltfAnimations[trigger.animationIndex]/* .name */)


                // Wait for the animation to finish before proceeding to the next word
                const animationDuration = gltfAnimations[trigger.animationIndex].duration * 1000;
                setTimeout(() => {
                    console.log(`Animation for "${recognizedPhrase}" is completed.`);
                    // Resume playing the next word's animation
                    playNextWordAnimation();
                    console.log("moving to next word")
                }, animationDuration);
            }
            console.log("loop iterating")
            
        }
        console.log("loop ends")
    }
    let previousSentence = null;

    function handleSpeechResult(event) {
        animationQueue=[]
        const transcriptionElement = document.getElementById('transcription');
        transcriptionElement.innerText = '';
    
        // Create a variable to store the recognized text and append recognized words
        let recognizedPhrase = '';
        // Initialize the text variable with an empty string
    let text = '';
    
        for (const result of event.results) {
             text = result[0].transcript.trim();
            transcriptionElement.innerText += text + ' ';
    
           // Append recognized words to the recognizedPhrase variable
           recognizedPhrase += text + ' ';
        }
    // Split the text into individual words
    const words = recognizedPhrase.split(/\s+/); // Split by one or more spaces
    
    // Collect all recognized words in a phrase
           // recognizedPhrase += text + ' ';
    // Collect all recognized words in a phrase
    //const word1=words;
    console.log("words"+words)
          /*  for (const word of words) {
            console.log("handlespeechresult for loop is executing")
            console.log("handlespeechresult inside for loop animationQueue: "+animationQueue)
            if (word) { */
               /*  console.log("handlespeechresult inside if statement executing")
                console.log("before push in forloop"+word)
                // Only add non-empty words to the animation queue
                animationQueue.push(word);
                console.log("after push in forloop"+word)
                console.log("for loop animationQueue"+animationQueue) */
/*             }
     } */
            if (event.results[0].isFinal) {
                transcribedTextArray.push(recognizedPhrase);
                for(let i=0;i<words.length;i++){
                    wordsAnimateToPlay.push(words[i])
                animationQueue.push(words);
            }
                console.log("from handlespeech transcribedTextArray: "+transcribedTextArray)
              //  console.log("from handlespeech animationQueue: "+transcribedTextArray)
    
                // Update the transcribed text display in the UI
            updateTranscribedTextDisplay();
    
                
            }
        
            //transcribedText += recognizedPhrase;
            console.log("words array display"+words)
    
        // You can also update other UI elements or perform actions based on recognizedPhrase here
        console.log('Transcribed Text:', recognizedPhrase); // Real-time recognized text
    
        // Continue playing animations or perform other actions as needed
        //playNextAnimation();
        
    
    console.log('Animation Queue from handle speech:', animationQueue); // Debug line
    
    //playNextAnimation();
    }
// Function to play the next word's animation
function playNextWordAnimation() {
    console.log('Animation Queue from playNextWordAnimation outside if:', wordsAnimateToPlay);
    console.log("animationQueue.length"+wordsAnimateToPlay.length)
    if (wordsAnimateToPlay.length > 0) {
        console.log('Animation Queue from playNextWordAnimation inside if:', wordsAnimateToPlay);
        const word = wordsAnimateToPlay.shift();
        console.log('Playing animation for word:', word);
        playAnimationsForWord(word);
    }
    else {
        console.log('Animation Queue from playNextWordAnimation in else:', wordsAnimateToPlay);
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
        console.log("paragraph after"+paragraph)
        //console.log("paragraph after"+paragraph)
    }
}

// Function to update the transcribed text display
function summ() {
    // Clear the container
    summarizecontainer.innerHTML = '';

    // Loop through the transcribedTextArray and create a <p> element for each entry
    for (const transcribedText of transcribedTextArray) {
        const paragraph = document.createElement('p');
        //console.log("paragraph"+paragraph)
        paragraph.textContent = transcribedText;
        transcribedTextContainer.appendChild(paragraph);
        console.log("paragraph after"+paragraph)
        //console.log("paragraph after"+paragraph)
    }
}

  

/* function playNextAnimation() {
    console.log('Animation Queue from playNextAnimation outside if:', animationQueue);
    if (animationQueue.length > 0) {
        console.log('Animation Queue from playNextAnimation inside if:', animationQueue);
        const word = animationQueue.shift();
        console.log('recognizing the word:', word);
        
        // Play your animation for the word here

        // Call the function recursively to play the next animation
        playNextAnimation();
    }
} */

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



// Create an array to store transcribed text
const sentencesPerGroup = 3; // Number of sentences to play animations for in each group

// Initialize the current group index
let currentGroupIndex = 0;




// Function to play animations for a group of words
function playAnimationsForGroup() {
    console.log("jhjgukgjh,bhkvgbh,m")
    console.log("words form playAnimationForGroup"+wordsAnimateToPlay)
    // Clear the animation queue
    //animationQueue = [];
    console.log('Animation Queue from playAnimationsForGroup before push:', animationQueue);
    // Add the words to the animation queue
    //animationQueue.push(...words);
    console.log('Animation Queue from playAnimationsForGroup after push:', animationQueue);
    console.log(" from playAnimationsForGroup (words):"+wordsAnimateToPlay)
    console.log("animationQueue"+animationQueue)


    // Play the animations for the words in the queue
    playNextWordAnimation();
}

var str=''
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
        sentencesToPlay = nonEmptyLines.slice(startIndex, endIndex);
        str=(Array.prototype.join.call(sentencesToPlay, ". "));
        console.log("string:"+str)
        console.log(sentencesToPlay.join(" "));
        summarize(str)
        //document.write(str)


       // Combine the sentences into one string
       const textToPlay = sentencesToPlay.join(' ');

       // Tokenize the text into individual words
        wordsToPlay = textToPlay.split(' ');

       // Debugging: Log the sentences and words for this group
       console.log('Sentences to Play:', sentencesToPlay);
       console.log('text to Play:', textToPlay)
       console.log('Words to Play:', wordsToPlay);
       const resultDiv = document.getElementById("summarizecontainer");
       resultDiv.innerText = str;
   
       //let text = "How are you doing today?";
       wordsAnimateToPlay = str.split(' ');
       console.log("wordsAnimateToPlay"+wordsAnimateToPlay+" ")

       // Play animations for the words in the current group
       playNextWordAnimation();
       console.log("currentgroupindex before increment"+currentGroupIndex)

       
       // Remove the processed sentences from the container
       transcribedTextContainer.innerText = nonEmptyLines.slice(endIndex).join('\n');
    }
    else {
        // No more sentences to play
        console.log('No more sentences to play.');
        //playAnimationsButton.disabled = true;
    }
      

   
});



 // Add this code to your index.js file
/* document.addEventListener('DOMContentLoaded', function () {
    const summarizeButton = document.getElementById('summarizeButton');
    summarizeButton.addEventListener('click', summarize);
  }); */ 
      // stopwords.js
      // function stopWords() {
      // var stopWord = "a about above after again against all am an and any are aren't as at be because been before being below between both but by can't cannot could couldn't did didn't do does doesn't doing don't down during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her here here's hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's its itself let's me more most mustn't my myself no nor not of off on once only or other ought our ours ourselves out over own same shan't she she'd she'll she's should shouldn't so some such than that that's the their theirs them themselves then there there's these they they'd they'll they're they've this those through to too under until up very was wasn't we we'd we'll we're we've were weren't what what's when when's where where's which while who who's whom why why's with won't would wouldn't you you'd you'll you're you've your yours yourself yourselves"
  
      // return new Set(stopWord.split(' '))
      // }
      var stopWord = "a about above after again against all am an and any are aren't as at be because been before being below between both but by can't cannot could couldn't did didn't do does doesn't doing don't down during each few for from further had hadn't has hasn't have haven't having he he'd he'll he's her here here's hers herself him himself his how how's i i'd i'll i'm i've if in into is isn't it it's its itself let's me more most mustn't my myself no nor not of off on once only or other ought our ours ourselves out over own same shan't she she'd she'll she's should shouldn't so some such than that that's the their theirs them themselves then there there's these they they'd they'll they're they've this those through to too under until up very was wasn't we we'd we'll we're we've were weren't what what's when when's where where's which while who who's whom why why's with won't would wouldn't you you'd you'll you're you've your yours yourself yourselves"
      var stopWord = new Set(stopWord.split(' '))
      // summaryBotVertex.js
      function vertex(name, arrWords) {
      this.name = name
      this.edge = {} //{name: edge weight}
      this.weight = Math.floor(Math.random() * 10) + 1; //1-10
      this.words = {} //{word: count}
      for (let word = 0; word < arrWords.length; word++){
        if (this.words[arrWords[word]]){
          this.words[arrWords[word]]++
          }
          else {
            this.words[arrWords[word]] = 1
          }
        }
        this.numWords = 0
        for (let word in this.words){
          this.numWords += this.words[word]
        }
      }
  
      //adds to edge the connection
      vertex.prototype.connection = function (connectName, weight) {
        this.edge[connectName] = weight
      }
  
      // summaryBot.js
      function summaryBot() {
    this.verticies = []
    this.dampeningFactor = .85
    this.numVerticies = 0
    this.originalSentences = []
    this.filteredSentences = []
    this.errorThreshold = .01
    this.unconnectedVerticies = new Set()
    this.infoOnLastRun = {}
  }
  
  summaryBot.prototype.summary = function () {
    if (Object.keys(this.infoOnLastRun).length) {
      let origNumWords = this.originalSentences.join(' ').split(' ').length
  
      return (`
  
      Original Number of Lines: ${this.originalSentences.length}
      Original Number of Words: ${origNumWords}
      Condensed Number of Lines: ${this.infoOnLastRun.numLines}
      Condensed Number of Words: ${this.infoOnLastRun.numWords}
      % workds kept: ${Math.round(100 * this.infoOnLastRun.numWords / origNumWords * 100) / 100}%
      Error: ${Math.round(10000 * this.infoOnLastRun.err) / 100}%
      `)
    }
  }
  
  summaryBot.prototype.run = function (text, numReturnSentences, testStatistics = false) {
    if (typeof (text) !== 'string' || typeof (numReturnSentences) !== 'number') {
      throw new TypeError('ensure that you pass valild values into summaryBot.prototype.run')
    }
  
    this._proccessString(text)
    this._initialize()
    let lastV0
    let curV0
    let errorLevel = 10
    while (errorLevel > this.errorThreshold) {
      this._updateAllVertexWeights()
      if (!curV0) {
        curV0 = this.verticies[0].weight
      } else {
        lastV0 = curV0
        curV0 = this.verticies[0].weight
        errorLevel = Math.abs(curV0 - lastV0)
      }
    }
  
    let output = this.getTopSentences(numReturnSentences)
  
    this.infoOnLastRun = {
      err: errorLevel,
      numLines: numReturnSentences,
      numWords: output.split(' ').length
    }
    if (testStatistics) {
      output += this.summary()
    }
    return output
  }
  
  summaryBot.prototype._findBestNumSentences = function() {
    if(this.verticies.length <= 3) {
      return this.verticies.length
    }
    const max = this.verticies[0]
    let vertex = 1
    while (this.verticies[vertex] && this.verticies[vertex] > max - 0.5) {
      vertex++
    }
    return vertex
  }
  //returns the error between last run
  summaryBot.prototype.getTopSentences = function (numSentences) {
    let out
    this._sortVerticiesByWeight()
  
    let topSentencesArr = []
    if (!numSentences) {
      numSentences = this._findBestNumSentences()
    }
    if (numSentences > this.numVerticies) {
      return this.originalSentences.join('.')
    } else {
      for (let sentenceOut = 0; sentenceOut < numSentences; sentenceOut++) {
        topSentencesArr.push(this.verticies[sentenceOut])
      }
      topSentencesArr.sort(function (a, b) {
        if (a.name < b.name) return -1
        return 1
      })
      out = topSentencesArr.map(function (vert) {
        return this.originalSentences[vert.name]
      }.bind(this))
    }
    if (topSentencesArr.some(vert => vert.name === this.originalSentences.length - 1)) {
      return out.join('. ')
    }
    return out.join('. ') + '.'
  }
  
  //will properly create graph
  summaryBot.prototype._proccessString = function (text) {
    // this.originalSentences = text.split(/[.|?|!] /)
    this.originalSentences = text.split(". ")
    for (let sentence = 0; sentence < this.originalSentences.length; sentence++) {
      this.filteredSentences[sentence] = this.originalSentences[sentence].replace(/[^a-zA-Z0-9 \']/g, " ")
      // this.filteredSentences[sentence] = this.originalSentences[sentence]
    }
    
    this.filteredSentences = this.filteredSentences.filter(function (content) {
      return content != '';
    })
  
    for (let sentence = 0; sentence < this.filteredSentences.length; sentence++) {
      this._addVertex(this.filteredSentences[sentence].toLowerCase().split(' ').filter((word) => word && word.length !== 1 && !stopWord.has(word)))
    }
  }
  
  //adds vertex
  summaryBot.prototype._addVertex = function (wordArr) {
    this.verticies.push(new vertex(this.numVerticies++, wordArr))
  }
  
  //sets the similarity edge weights for each node
  summaryBot.prototype._initialize = function () {
    //update edge weight
    let similarity
    for (let vertexNum = 0; vertexNum < this.verticies.length - 1; vertexNum++) {
      for (let innerVertex = vertexNum + 1; innerVertex < this.verticies.length; innerVertex++) {
        similarity = this._findSimilarity(this.verticies[vertexNum], this.verticies[innerVertex])
        this.verticies[vertexNum].connection(innerVertex, similarity)
        this.verticies[innerVertex].connection(vertexNum, similarity)
      }
    }
  }
  
  summaryBot.prototype._updateAllVertexWeights = function () {
    let totalEdgeWeights = this._getEdgeTotals()
    var tempSum = 0
    for (let vertexNum = 0; vertexNum < this.numVerticies; vertexNum++) {
      for (let otherVertex = 0; otherVertex < this.numVerticies; otherVertex++) {
        if (otherVertex !== vertexNum && !this.unconnectedVerticies.has(otherVertex)) {
          tempSum += this.verticies[vertexNum].edge[otherVertex] / totalEdgeWeights[otherVertex] * this.verticies[otherVertex].weight
        }
      }
      this.verticies[vertexNum].weight = (1 - this.dampeningFactor) + this.dampeningFactor * tempSum
      tempSum = 0
    }
  }
  
  summaryBot.prototype._getEdgeTotals = function () {
    let out = []
    let tempSum = 0
    for (let vertexNum = 0; vertexNum < this.numVerticies; vertexNum++) {
      tempSum = 0
      for (let edgeN in this.verticies[vertexNum].edge) {
        tempSum += this.verticies[vertexNum].edge[edgeN]
      }
      //if this node is unrelated set weight to 0
      if (!tempSum) {
        this.verticies[vertexNum].weight = 0
        this.unconnectedVerticies.add(vertexNum)
      }
      out.push(tempSum)
    }
    return out
  }
  //calculates the similarity between two verticies (edge weight)
  //in: vertex obj
  summaryBot.prototype._findSimilarity = function (vert1, vert2) {
    let overlap = 0
    for (let word in vert1.words){
      if (vert2.words[word]){
        overlap += Math.pow(vert1.words[word] * vert2.words[word], 0.7)
      }
    }
    return overlap / (Math.log(vert1.numWords) + Math.log(vert2.numWords))
  }
  
  summaryBot.prototype._sortVerticiesByWeight = function () {
    this.verticies.sort(function (a, b) {
      if (a.weight < b.weight) return 1
      if (a.weight > b.weight) return -1
      return 0
    })
  }
      
    //  app.js
    // const summarizer = new summaryBot();
    // const text = document.getElementById('text');
    
    // const textContent = text.textContent;
    // const textLength = textContent.length;
    // const  summary = summarizer.run(text,sentenceCount*0.6 , false);
    // console.log(summary)
  
    function summarize() {
    const inputText = str;
    console.log("input text"+inputText)
    const textContent = inputText; 
    console.log("textContent"+textContent)
    const textLength = textContent.split(". ").length;
    console.log(textLength)
    // Perform the summarization process here using the 'textContent'
    // For example:
    const summarizer = new summaryBot();
    const summarizer1 = new summaryBot();
    const start = performance.now();
    const summary = summarizer.run(textContent,textLength*0.6 , false);
    console.log(summarizer.originalSentences.length)
    const length1 = summary.split(". ").length;
    console.log("summary length: " + length1)
  
    const summary1 = summarizer1.run(summary,length1*0.8 , false);
    const end = performance.now();
    console.log(end-start)
    console.log(summary1);
    console.log(summary1.split(". ").length)
  
    /* // Update the 'summary' element with the generated summary
    const summaryElement = document.getElementById('summary');
    summaryElement.textContent = summary; */
  }



  // Example for detecting focus on input elements
const textInputs = document.querySelectorAll('input[type="text"], textarea');

textInputs.forEach((input) => {
  input.addEventListener('focus', () => {
    // Display your logo/icon when a text box is focused
    showLogo();
  });

  input.addEventListener('input', () => {
    // Handle user input (optional)
  });
});

function showLogo() {
    const logoElement = document.getElementById('logo'); // Add an ID to your logo element
    logoElement.style.display = 'block'; // Show the logo
  }

  textInputs.forEach((input) => {
    input.addEventListener('blur', () => {
      // Hide the logo when the text box loses focus
      hideLogo();
    });
  });
  
  function hideLogo() {
    const logoElement = document.getElementById('logo'); // Add an ID to your logo element
    logoElement.style.display = 'none'; // Hide the logo
  }
  
 /*  
  chrome.runtime.onMessage.addListener((msg,sender,response)=>{
    console.log('hello!!!!!?',msg);
    if(msg.command=="openModal"){
      document.querySelector('._coupon__button').click();
    }
    return true;
  });
  
   */
  

/*   // In your popup script (popup.js)
window.addEventListener('beforeunload', () => {
  // Notify the background script that the popup is closed
  chrome.runtime.sendMessage('popup-closed');
});
 */

/* document.addEventListener('DOMContentLoaded', function () {
  const popupContainer = document.getElementById('popup-container');

  // Prevent clicks inside the popup from closing it
  popupContainer.addEventListener('click', function (event) {
    if (!popupContainer.contains(event.target)) {
      event.stopPropagation();
    }
  });

  // Handle closing the popup when needed (e.g., a close button)
  const closeButton = document.getElementById('close-button');
  closeButton.addEventListener('click', function () {
    window.close(); // Close the popup
  });
});
 */

// Select the custom popup and close button
const customPopup = document.getElementById('popup-overlay');
const closeButton = document.getElementById('close-button');

// Attach an event listener to the document
document.addEventListener('click', (event) => {
  // Check if the clicked element is not part of the custom popup
  if (event.target !== customPopup && !customPopup.contains(event.target)) {
    // Prevent the default behavior (closing the popup)
   customPopup.style.display='block'
  }
});
customPopup.addEventListener('click', () => {
  // Prevent the popup from being hidden when it is clicked
  event.stopPropagation();
});

// Attach an event listener to the close button
closeButton.addEventListener('click', () => {
  // Close the custom popup when the close button is clicked
  customPopup.style.display = 'none';
});



const [tab] = await chrome.tabs.query({
  active: true,
  lastFocusedWindow: true
});

/* const tabId = tab.id;
const button = document.getElementById('openSidePanel');
button.addEventListener('click', async () => {
  await chrome.sidePanel.open({ tabId });
  await chrome.sidePanel.setOptions({
    tabId,
    path: 'sidepanel-tab.html',
    enabled: true
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.openSidePanel === true) {
    // Open your side panel here
    // For example, toggle a CSS class to show/hide the panel
    const sidePanel = document.getElementById("popup-overlay");
    sidePanel.classList.toggle("visible");
  }
});
//for indeexeddb */