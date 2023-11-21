// Inside fetch-worker.js

self.onmessage = async function(event) {
    const url = event.data.url;

    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        self.postMessage(arrayBuffer);
    } catch (error) {
        self.postMessage({ error: error.message });
    }
};
