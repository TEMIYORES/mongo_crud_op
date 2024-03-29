const LogEvents = require("./middleware/LogEvent");
const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const EventEmitter = require("events");
class MyEmitter extends EventEmitter {}
// initial Object
const myEmitter = new MyEmitter();
myEmitter.on("log", (message, logName) => LogEvents(message, logName));
const PORT = process.env.PORT || 3500;

const server = http.createServer((req, res) => {
  myEmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");
  console.log(req.url, req.method);
  const extension = path.extname(req.url);
  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpeg":
      contentType = "image/jpeg";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;
    default:
      contentType = "text/html";
  }
  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : contentType === "text/html" && req.url.slice(-1) === "/"
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const serveFile = async (filePath, contentType, response) => {
    try {
      const rawData = await fsPromises.readFile(
        filePath,
        !contentType.includes("image") ? "utf-8" : ""
      );
      const data =
        contentType === "application/json" ? JSON.parse(rawData) : rawData;
      response.writeHead(filePath.includes("404.html") ? 404 : 200, {
        "Content-Type": contentType,
      });
      response.end(
        contentType === "application/json" ? JSON.stringify(data) : rawData
      );
    } catch (err) {
      myEmitter.emit("log", `${err.name}\t${err.message}`, "errLog.txt");

      console.log(err);
      response.statusCode = 500;
      response.end();
    }
  };
  const fileExists = fs.existsSync(filePath);
  if (fileExists) {
    serveFile(filePath, contentType, res);
  } else {
    // 404
    // 301
    switch (path.parse(filePath).base) {
      case "old.html":
        res.writeHead(301, { location: "/new-page.html" });
        res.end();
        break;
      case "page.html":
        res.writeHead(301, { location: "/" });
        res.end();
        break;
      default:
        serveFile(path.join(__dirname, "views", "404.html"), contentType, res);
    }
  }
});
server.listen(PORT, () => {
  console.log(`Server running on PORT`, PORT);
});
// add event for log event
// myEmitter.on("log", (message) => LogEvents(message));
// myEmitter.emit("log", "Log event emitted!");
