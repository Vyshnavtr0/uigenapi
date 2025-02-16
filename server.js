const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

const port = process.env.PORT || 8080;

// Middleware to parse JSON body
app.use(express.json());

// Sample HTML with Tailwind CSS
const defaultHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>HTML to Image</title>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">
  <div class="bg-white p-8 rounded-lg shadow-md max-w-md">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Subscribe to Arpan Neupane's channel</h1>
    <p class="text-gray-600">This image was generated from HTML and Tailwind CSS</p>
    <button class="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
      Subscribe Now
    </button>
  </div>
</body>
</html>
`;

// Handle both GET and POST requests to /convert
app.all("/convert", async (req, res) => {
  try {
    // Get HTML from request body or use default
    const html = (req.method === 'POST' && req.body.html) ? req.body.html : defaultHtml;
    const width = (req.method === 'POST' && req.body.width) ? req.body.width : 800;
    const height = (req.method === 'POST' && req.body.height) ? req.body.height : 600;
    
    // Launch browser
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new'
    });
    
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width, height });
    
    // Set content
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Take screenshot
    const screenshot = await page.screenshot({ 
      type: 'png',
      fullPage: true
    });
    
    await browser.close();
    
    // Send response
    res.setHeader('Content-Type', 'image/png');
    res.send(screenshot);
    
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).send('Error generating image');
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send(`
    <h1>HTML to Image API</h1>
    <p>Access /convert endpoint with either GET or POST to get an image back.</p>
    <p>For POST requests, you can customize the HTML:</p>
    <pre>
    POST /convert
    Content-Type: application/json
    
    {
      "html": "<!DOCTYPE html><html>...</html>",
      "width": 800,
      "height": 600
    }
    </pre>
    <p>Or simply navigate to <a href="/convert">/convert</a> to get the default image.</p>
  `);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});