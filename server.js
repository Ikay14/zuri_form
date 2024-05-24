import http from "node:http";
import fs from "node:fs/promises";

const hostname = "127.0.0.1";
const port = 4500;

// Had to shift the function to the top to get type inference without renaming to a .ts file
const server = http.createServer(async function(req, res) {

  if (req.url === "/" && req.method === "GET") {
    try {
      let data = await fs.readFile("public/index.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Could not locate file at " + req.url);
      return;
    }
  }
  else if(req.url === "/client.js" && req.method === "GET"){
    try {
      let data = await fs.readFile("public/client.js");
      res.writeHead(200, { "Content-Type": "text/js" });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Could not locate file at " + req.url);
      return;
    }
  } 
  else if(req.url === "/favicon.ico" && req.method === "GET"){
    try {
      let data = await fs.readFile("public/favicon.ico");
      res.writeHead(200, { "Content-Type": "image/x-icon" });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Could not locate file at " + req.url);
      return;
    }
  } 
  else if (req.url === "/submit-form" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    const waitForEnd = new Promise((resolve, reject) => {
      req.on("end", () => {
        resolve();
      });
    });
    await waitForEnd;
    
    const newUser = JSON.parse(body);
    
   // Validation on the backend is necessary but they should teach you how to do it in the future
    try {
      // Read the file, then add to it
      let userData = await fs.readFile("database.json");
      userData = JSON.parse(userData);
      userData.users.push(newUser);
      await fs.writeFile("database.json", JSON.stringify(userData, null, 2));
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("User details submitted successfully");
    } catch (error) {
          console.error("Error writing to file:", err);
          res.writeHead(500, { "Content-Type": "text/html" });
          res.end("Error creating user details");
          return;
    }
  }
});

server.listen(port, undefined, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});