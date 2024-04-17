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
app.get("/smart-home", function (req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  try {
    getSmartHomeState(res);
  } catch (err) {
    console.error(error);
    // we should probably res.send(HTTP status, error.message) to let the
    // consumer know what happened - for now, we'll just dump-and-die
    res.status(500).end();
  }
});

const getSmartHomeState = (res) => {
  // Here, we're cheating again by randomly updating values on differing intervals
  // However, you could imagine this taps into some kind of webhook from the smart home
  // and we push the updates to the client

  // Notice here, that the event name is different for each room
  // And we're also sending our JSON data as a string - we need to decode this on the client
  setInterval(() => {
    res.write(
      `event:kitchen\ndata: {"blinds":"${randomOpen()}","lights":"${randomOn()}"}\n\n`,
    );
  }, 1000);

  setInterval(() => {
    res.write(
      `event:livingroom\ndata: {"curtains":"${randomOpen()}","lights":"${randomOn()}"}\n\n`,
    );
  }, 1800);

  setInterval(() => {
    res.write(
      `event:bedroom\ndata: {"curtains":"${randomOpen()}","lights":"${randomOn()}"}\n\n`,
    );
  }, 2600);
};

// Just some helpers for creating randomly changing values
const randomBoolean = () => Math.random() > 0.5;
const randomOpen = () => (randomBoolean() ? "open" : "closed");
const randomOn = () => (randomBoolean() ? "on" : "off");

// serve our Express app on the given port
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});
