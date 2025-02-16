import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/convert', async (req, res) => {
  let browser;
  try {
    // Get HTML from request body or use default
    const html = req.body.html || `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
          </style>
      </head>
      <body class="flex items-center justify-center min-h-screen bg-gray-100">
          <div class="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
              <h2 class="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
              
              <form>
                  <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your email" required>
                  </div>
                  
                  <div class="mb-4">
                      <label class="block text-sm font-medium text-gray-700">Password</label>
                      <input type="password" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your password" required>
                  </div>
                  
                  <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                      Login
                  </button>
                  
                  <p class="text-center text-sm text-gray-600 mt-4">
                      Don't have an account? 
                      <a href="#" class="text-blue-500 hover:underline">Sign up</a>
                  </p>
              </form>
          </div>
      </body>
      </html>
    `;

    // Launch browser
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    
    // Create new page
    const page = await browser.newPage();
    
    // Set viewport size
    await page.setViewport({ 
      width: 1200, 
      height: 630, 
      deviceScaleFactor: 2 
    });
    
    // Set content
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Take screenshot
    const screenshot = await page.screenshot({ 
      type: 'png',
      fullPage: false
    });
    
    // Close browser
    await browser.close();
    
    // Send response
    res.contentType('image/png');
    res.send(screenshot);
    
  } catch (error) {
    // Close browser if it was opened
    if (browser) await browser.close();
    
    console.error('Error generating image:', error);
    res.status(500).send(`Error generating image: ${error.message}`);
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
      <title>HTML to Image Converter</title>
    </head>
    <body class="bg-gray-100 p-8">
      <div class="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 class="text-2xl font-bold mb-4">HTML to Image Converter</h1>
        
        <div class="bg-blue-100 p-4 rounded mb-4">
          <p class="text-blue-800">Send a POST request to /convert with your HTML</p>
          <pre class="bg-blue-50 p-2 rounded mt-2 overflow-x-auto">
{
  "html": "Your complete HTML string"
}
          </pre>
        </div>
        
        <div class="bg-green-100 p-4 rounded">
          <h2 class="text-lg font-semibold mb-2">Usage Notes:</h2>
          <ul class="list-disc list-inside text-green-800">
            <li>Ensure full HTML document is provided</li>
            <li>Include Tailwind CSS via CDN</li>
            <li>The image will be generated at 1200x630 resolution</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

export default app;