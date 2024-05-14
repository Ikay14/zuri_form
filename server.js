const http = require('http')
const fs = require('fs')

const server = http.createServer(requestHandler)

function requestHandler(req, res) {
  if (req.url === '/' && req.method === 'GET') {
    fs.readFile('index.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' })
        res.end('Internal Server Error');
        return
      }
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(data)
    });
  } else if (req.url === '/submit-form' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const formData = new URLSearchParams(body)
      const userData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        otherNames: formData.get("otherNames") || "",
        email: formData.get("email"),
        phone: formData.get("phone"),
        gender: formData.get("gender"),
      }

      fs.writeFile("database.json", JSON.stringify(userData), (err) => {
        if (err) {
          console.error('Error writing to file:', err)
          res.writeHead(500, { 'Content-Type': 'text/html' })
          res.end('Internal Server Error')
        } else {
          console.log('User details saved to database.json:', userData)
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end('User details submitted successfully')
        }
      })
    })
  }
}

server.listen(3000, () => {
  console.log(`server is listening on post 3000`)
})