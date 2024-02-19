async function query(data) {
    const loader = document.getElementById('loader');

    loader.innerHTML = `<img src="static/loading.gif" alt="Generated Image" id='generatedimg' style='height: 45px; width: 45px;'><p>Please Wait...</p>`;
    const response = await fetch(
        "https://api-inference.huggingface.co/models/Halberthj/ImageGenerator",
        {
            headers: { Authorization: `Bearer ${API_KEY}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    if (!response.ok) {
        loader.innerHTML = `<p>Something went wrong, Try after 5 mins!</p>`
        throw new Error('Network response was not ok');
    }
    loader.innerHTML = ``;
    return await response.blob();
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


