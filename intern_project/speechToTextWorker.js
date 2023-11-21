let recognition;

self.onmessage = function (e) {
    if (e.data.command === 'start') {
        const stream = e.data.stream;
        startRecording(stream);
    } else if (e.data === 'stop') {
        stopRecording();
    }
};

function startRecording(stream) {
    recognition = new (self.SpeechRecognition || self.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
        self.postMessage('Recording started');
    };

    recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript.trim().toLowerCase();
        self.postMessage(transcript);
    };

    recognition.onend = () => {
        self.postMessage('Recording ended');
    };

    // Set the audio stream for recognition
    //recognition.stream = stream;
    recognition.start();
}

function stopRecording() {
    if (recognition) {
        recognition.stop();
        console.log('Recording stopped');
    }
}

// Rest of your code remains the same
