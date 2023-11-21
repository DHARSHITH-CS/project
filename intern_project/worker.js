// worker.js
self.addEventListener('message', async (event) => {
    const url = event.data;
    console.log('Web Worker received URL:', url);
    const glbArrayBuffer = await fetchGlb(url);
    console.log('Web Worker fetched GLB array buffer:', glbArrayBuffer);
    self.postMessage(glbArrayBuffer, [glbArrayBuffer]);
    //self.postMessage({ type: 'gltfAnimations', data: gltfAnimations });
});

async function fetchGlb(url) {
    console.log('Fetching GLB:', url);
    const response = await fetch(url);
    console.log('GLB Fetch Response:', response);
    const arrayBuffer = await response.arrayBuffer();
    console.log('GLB Array Buffer:', arrayBuffer);
    return arrayBuffer;
}
