/**
 * PingOne Integration Guide - Express.js Sample App
 *
 * This repo
 * (https://github.com/dbrowski/pingone-express_js-sample-app-guide#readme) is
 * designed as a guide that walks you through the steps to add authentication
 * using PingOne into a traditional web app. Running the app at any step will
 * spin up an Express server which will serve a minimal UI. You can use this to
 * trigger a PingOne Authentication or DaVinci Policy assigned to a PingOne App
 * Connection.
 *
 * This step sets up starting point, a simple web app. The code comes from the
 * Hello world example from Express.
 * https://expressjs.com/en/starter/hello-world.html
 */

/**
 * Express Server Config and Initialization
 */
const express = require("express");
const app = express();
const port = 3000;

/**
 * Root path - "http://localhost:3000/" (or without the explicit "/" =>
 * "http://localhost:3000")
 *
 * Navigating to the root path should render "Hello World!" in your browser.
 */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * This outputs a message to your terminal (where you started the app) when the
 * Express server starts up.
 */
app.listen(port, () => {
  // The console output has been modified for this guide.
  console.log(
    `The PingOne sample Express app has started listening on port ${port}`
  );
  console.log("Step 0 - Creating a working Express web app.");
});
