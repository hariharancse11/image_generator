async function query(data) {
    const loader = document.getElementById('loader');
    try {
        const response = await fetch('/api/getApiKey');
        const apiKeyData = await response.json();
        const apiKey = apiKeyData.apiKey;

        loader.innerHTML = `<img src="static/loading.gif" alt="Generated Image" id='generatedimg' style='height: 45px; width: 45px;'><p>Please Wait...</p>`;

        const inferenceResponse = await fetch(
            "https://api-inference.huggingface.co/models/Halberthj/ImageGenerator",
            {
                headers: { Authorization: `Bearer ${apiKey}` },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        if (!inferenceResponse.ok) {
            loader.innerHTML = `<p>Something went wrong, Try after 5 mins!</p>`;
            throw new Error('Network response was not ok');
        }

        loader.innerHTML = ``;
        return await inferenceResponse.blob();
    } catch (error) {
        console.error('Error:', error);
        loader.innerHTML = `<p>Something went wrong!</p>`;
        throw error; // Re-throw the error to the caller
    }
}

async function generateImage() {
    const prompt = document.getElementById('promptInput').value;
    try {
        const imageData = await query({ "inputs": prompt });
        const imageUrl = URL.createObjectURL(imageData);
        const imageContainer = document.getElementById('imageContainer');
        imageContainer.innerHTML = `<img src="${imageUrl}" alt="Generated Image" id='generatedimg'>`;

        downloadButton.style.display = 'inline';
        downloadButton.onclick = function() {
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = 'generated_image.png'; // You can specify the filename here
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    } catch (error) {
        console.error('Error:', error);
    }
}

// Add event listener to the button
document.getElementById('generateButton').addEventListener('click', generateImage);
