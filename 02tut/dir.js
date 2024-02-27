const fs = require("fs");

if (!fs.existsSync("./new")) {
  fs.mkdir("./new", (err) => {
    if (err) throw err;
    console.log("Directory created");
  });
}
if (fs.existsSync("./new")) {
  fs.rmdir("./new", (err) => {
    if (err) throw err;
    console.log("Directory deleted");
  });
}

// exit on error
process.on("uncaughtException", (err) => {
  console.log("There was an uncaught err:", err);
  process.exit(1);
});
