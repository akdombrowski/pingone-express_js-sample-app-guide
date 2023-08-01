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

/**
 * Some constants we'll need for an OAuth Authorization Code flow.
 * We'll also add Authentication with OIDC.
 */
// This app's base origin
const appBaseOrigin = appBaseURL + ":" + port;
// PingOne authorize endpoint
const authorizeEndpoint = "/as/authorize";
// PingOne token endpoint
const tokenEndpoint = "/as/token";
// The url path made available for when the user is redirected back from the
// authorization server, PingOne.
const callbackPath = "/callback";
// The full url where the user is redirected after authenticating/authorizing
// with PingOne.
const redirectURI = appBaseOrigin + callbackPath;
// Scopes specify what kind of access the client is requesting from the user.
// These are some standard OIDC scopes.
//   openid - signals an OIDC request; default resource on oauth/oidc app
// connection
// These need to be added as resources to the app connection or it will be
// ignored by the authorization server. Once that's done, you can then append
// it to your scopes variable using a whitespace to separate it from any other
// scopes.
//   profile - access to basic user info;
//   p1:read:user - access to read the user's PingOne identity's attributes (a
// PingOne - specific scope)
const scopes = "openid";
// The OAuth 2.0 grant type and associated type of response expected from the
// /authorize endpoint. The Authorization Code flow is recommended as the best
// practice in most cases
// https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics-23
const grantType = "authorization_code";
const responseType = "code";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Express app "has started" message
app.listen(port, () => {
  console.log(
    `Step 2 - The PingOne sample Express app has started listening on ${appBaseURL}:${port}`
  );
});