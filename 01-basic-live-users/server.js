import express from "express";
import fs from "fs";

const app = express();
const port = 1337;

// server our index.html page on the "/" route
app.get("/", async (_req, res) => {
  const indexHtml = fs.readFileSync(process.cwd() + "/index.html", "utf8");
  res.send(indexHtml);
});

// setup our SSE route
app.get("/live-users", function (req, res) {
  let intervalId;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  try {
    // Every 1 seconds, send the user count to the client
    intervalId = setInterval(() => countUsers(res), 1000);
  } catch (err) {
    clearInterval(intervalId);
    console.error(error);
    // we should probably res.send(HTTP status, error.message) to let the
    // consumer know what happened - for now, we'll just dump-and-die
    res.status(500).end();
  }
});

function countUsers(res) {
  const liveUserCount = getUserCount();
  // the client-side on "message" event will fire each time we
  // call res.write
  res.write("data: " + liveUserCount + "\n\n");
}

const getUserCount = () => {
  // this would probably be a DB call or something
  // but for now, we'll fake it
  return Math.floor(Math.random() * 100);
};

// serve our Express app on the given port
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});
