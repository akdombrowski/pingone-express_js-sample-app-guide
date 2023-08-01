/**
 * PingOne Express.js Sample App
 *
 * This is an extremely simplified web app using Express.js on the backend which
 * demonstrates how to use PingOne to authenticate your users.
 *
 *
 * Some terminology which might be helpful -
 *
 * Client --------------- This express app running in nodejs.
 *                        It's considered "private" because it runs server-side
 *                        and can keep a secret, well, secret (as opposed to a
 *                        SPA/client-side app which sends everything to the
 *                        browser/frontend).
 *
 * Authorization Server - PingOne is the mutually trusted (by the user and
 *                        the client) 3rd party handling authentication and
 *                        authorization.
 *
 * Resource Owner ------- The authenticating user.
 *
 * OAuth (2.0) ---------- The authorization framework.
 *                        And, the Authorization Code flow, is generally the
 *                        flow to start with in order to comply with best
 *                        practice.
 *
 * OIDC ----------------- The authentication framework which layers on top of
 *                        OAuth 2.0
 */

/**
 * Express Server Config and Initialization
 */
const express = require("express");
const app = express();
const port = 3000;

// Allows us to read values from ".env" file.
require("dotenv").config();

/**
 * To start, copy the '.env.EXAMPLE' file.
 * And, rename the new file as '.env'.
 * Then, fill in your values.
 *
 * On how to get those values...
 * If you don't already have a PingOne account, you can start a trial at:
 * pingidentity.com/en/try-ping
 *
 * You'll want to register your app with PingOne to start using PingOne's
 * services.
 *
 * If you navigate to Connections > Applications in the PingOne Admin Console,
 * you can create a new App Connection (OIDC Web App) which will represent your
 * app's registration with PingOne.
 *
 * After creating your App Connection, you can navigate to the Configuration tab
 * where you'll find these config values to add to your '.env' file.
 *
 * On the app connection, don't forget to set the redirect_uri to be http://
 * localhost:3000/callback (default for this app).
 *
 * Finally, don't forget to click the toggle in the top right to turn it on!
 */
// PingOne Auth (authentication/authorization) base url
const authBaseURL = process.env.PINGONE_AUTH_BASE_URL;
// PingOne Environment ID
const envID = process.env.PINGONE_ENV_ID;
// PingOne Client ID of the App Connection
const clientID = process.env.PINGONE_CLIENT_ID;
// PingOne Client Secret of the App Connection
const clientSecret = process.env.PINGONE_CLIENT_SECRET;
// Express app (this app) base url
const appBaseURL = process.env.APP_BASE_URL;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Express app "has started" message
app.listen(port, () => {
  console.log(
    `Step 1 - The PingOne sample Express app has started listening on ${appBaseURL}:${port}`
  );
});
