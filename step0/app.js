/**
 * PingOne Integration Guide - Express.js Sample App
 *
 * This repo is designed as a guide that walks you through the steps to add
 * authentication using PingOne into a simplified traditional web app using
 * Express. Running the app will spin up an Express server which will serve a
 * minimal UI. You can use this to trigger a PingOne Authentication or DaVinci
 * Policy assigned to an OAuth/OIDC Application Connection.
 *
 * We'll start with a basic working app using the Hello world example from
 * Express.
 * https://expressjs.com/en/starter/hello-world.html
 */

/**
 * Express Server Config and Initialization
 */
const express = require("express");
const app = express();
const port = 3000;

/**
 * Root url - "http://localhost:3000/" (or without the explicit "/" =>
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
  console.log(`Example app listening on port ${port}`);
});
