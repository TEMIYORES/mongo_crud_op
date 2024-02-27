const fs = require("fs");
const path = require("path");
const rs = fs.createReadStream(path.join(__dirname, "file", "newreply.txt"), {
  encoding: "utf-8",
});
const ws = fs.createWriteStream(path.join(__dirname, "file", "stream.txt"));

// rs.on("data", (dataChunk) => {
//   ws.write(dataChunk);
// });
rs.pipe(ws);
