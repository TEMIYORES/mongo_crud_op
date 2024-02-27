const fs = require("fs");
const path = require("path");
const fsPromises = require("fs").promises;
const fileOps = async () => {
  try {
    const data = await fsPromises.readFile(
      path.join(__dirname, "file", "lorem.txt"),
      "utf-8"
    );
    await fsPromises.unlink(path.join(__dirname, "file", "lorem.txt"));
    await fsPromises.writeFile(path.join(__dirname, "file", "reply.txt"), data);
    await fsPromises.appendFile(
      path.join(__dirname, "file", "reply.txt"),
      "\nYeah, Nice to meet you too."
    );
    await fsPromises.rename(
      path.join(__dirname, "file", "reply.txt"),
      path.join(__dirname, "file", "newreply.txt")
    );
    const newData = await fsPromises.readFile(
      path.join(__dirname, "file", "reply.txt"),
      "utf-8"
    );
    console.log(newData);
  } catch (err) {
    console.error(err);
  }
};
fileOps();
// fs.readFile(path.join(__dirname, "file", "lorem.txt"), "utf-8", (err, data) => {
//   if (err) throw err;
//   console.log("Read Complete");
// });
// writeFile(
//   path.join(__dirname, "file", "reply.txt"),
//   "Hello, Nice to meet you",
//   (err) => {
//     if (err) throw err;
//     console.log("Write Complete");
//     fs.appendFile(
//       path.join(__dirname, "file", "reply.txt"),
//       "\nYeah, nice to meet you",
//       (err) => {
//         if (err) throw err;
//         console.log("Append Complete");
//         fs.rename(
//           path.join(__dirname, "file", "reply.txt"),
//           path.join(__dirname, "file", "newReply.txt"),
//           (err) => {
//             if (err) throw err;
//             console.log("rename Complete");
//           }
//         );
//       }
//     );
//   }
// );

// exit on uncaught error
process.on("uncaughtException", (err) => {
  console.error(`There was an uncaught error:`, err);
  process.exit(1);
});
