const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((request, response) => {
  console.log(`Request for ${request.url} by method ${request.method}`);

   if (request.method === 'GET') {
    
    let fileUrl = request.url === '/' ? 'index.html' : request.url;
    
    let filePath = path.resolve(`public/${fileUrl}`);
    const fileExtension = path.extname(filePath);

    if (fileExtension === '.html') {
      fs.access(filePath, error => {
        if (error) {
          // Doesn't exist
          response.statusCode = 404;
          response.setHeader('Content-Type', 'text/html');
          response.end(`<html><body><h1>404: ${fileUrl} not found.</h1></body></html>`);
        } else {
          // Exists
          response.statusCode = 200;
          response.setHeader('Content-Type', 'text/html');
          fs.createReadStream(filePath).pipe(response);
        }
      });
    } else {
      response.statusCode = 404;
      response.setHeader('Content-Type', 'text/html');
      response.end(`<html><body><h1>404: ${fileUrl} is not an HTML file.</h1></body></html>`);
    }

  } else {
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/html');
    response.end(`<html><body><h1>404: ${request.method} method not supported.</h1></body></html>`);
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`)
});