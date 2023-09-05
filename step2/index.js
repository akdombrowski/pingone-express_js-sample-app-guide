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
// PingOne Environment ID (the ID of environment where the App Connection is
// located)
const envID = process.env.PINGONE_ENVIRONMENT_ID;
// PingOne Client ID of the App Connection
const clientID = process.env.PINGONE_CLIENT_ID;
// PingOne Client Secret of the App Connection
const clientSecret = process.env.PINGONE_CLIENT_SECRET;
// Express app (this app) base url (e.g., http://localhost)
const appBaseURL = process.env.APP_BASE_URL;

/**
 * Some constants we'll need for an OAuth/OIDC Authorization Code flow (aka how
 * we'll authenticate users).
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
const redirectURI = appBaseURL + ":" + port + callbackPath;
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

/**
 * Root url - "http://localhost:3000/" (or without the explicit "/" =>
 * "http://localhost:3000")
 *
 * The "Hello World!" text has now been replaced with a link with the text
 * "Login".
 *
 * Clicking the link will redirect the user to PingOne with the authorization
 * request parameters to authenticate and allow/deny access to certain
 * resources.
 *
 * This is just one (simplified) way to make the authorization request. It could
 * instead be the action of a button to redirect to the /authorize endpoint of
 * PingOne along with the right parameters.
 *
 * The user authenticates and then is returned to the app via the redirect_uri.
 * In this app, the redirect_uri is configured as a different path (which hasn't
 * been added yet and why the "Cannot GET /callback" error is shown after
 * redirecting back to the app). However, it doesn't need to be different if the
 * logic were updated here to handle it appropriately.
 */
app.get("/", (req, res) => {
  // Authorization server's authorize endpoint's url path
  // e.g.,
  // "z2345678-0000-456c-a657-3a21fc9ece7e/as/authorize"
  const authzPath = envID + authorizeEndpoint;
  // authorize request starting with the url origin and path.
  const authzReq = new URL(authzPath, authBaseURL);

  // Add query parameters to define the authorize request
  authzReq.searchParams.append("redirect_uri", redirectURI);
  authzReq.searchParams.append("client_id", clientID);
  authzReq.searchParams.append("scope", scopes);
  authzReq.searchParams.append("response_type", responseType);

  // Send a link to the browser to render with the text "Login".
  // When the link is clicked the user is redirected to the authorization
  // server, PingOne, at the authorize endpoint. The query parameters are read
  // by PingOne and combine to make the authorization request.
  res
    .status(200)
    .send("<a href=" + authzReq.toString() + ">Login - Step 2</a>");
});

/**
 * This outputs a message (modified to show you the current step) to your
 * terminal (where you started the app) when the Express server starts up.
 */
app.listen(port, () => {
  console.log(
    `The PingOne sample Express app has started listening on ${appBaseURL}:${port}`
  );
  console.log("Step 2 - Redirecting the user to PingOne to authenticate.");
});
