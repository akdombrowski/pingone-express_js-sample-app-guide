/**
 * PingOne Integration with a Traditional Web App
 *
 * This is part of the walkthrough guide (see
 * https://github.com/dbrowski/pingone-express_js-sample-app-guide#readme).
 *
 * This is a "traditional web app" (a web app with a server component as opposed
 * to a SPA or client-side app) is used to demonstrate how to add authentication
 * using PingOne.
 *
 * Express is a Node.js web app framework that is used here to create the web
 * app, but the steps can be used on most Node.js apps. And, understanding the
 * steps from this guide can even help you integrate PingOne with
 * SPA/client-side apps and other traditional web apps not using Node.js.
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
 * To start, create a copy of the '.env.EXAMPLE' file, and name the file '.env'.
 * Then, fill in the required PingOne values using the config values from an
 * (oidc web app) app connection.
 *
 * On the app connection, don't forget to set the redirect_uri to be http://
 * localhost:3000/callback on the configuration tab of the app connection in the
 * admin console.
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
/**
 * Scopes specify what kind of access the client is requesting from the user.
 *
 * For example, "openid" is a scope which requests access to some basic user
 * info. It's also the default resource on a PingOne OAuth/OIDC app connection
 *
 *
 * Scopes not added to the app connection (you can see and modify them on the
 * Resources tab) will be ignored by the authorization server even if requested
 * by the client. Otherwise, additional scopes can be appended after a space.
 *
 *
 * Some other examples of scopes you can add:
 *
 * profile - access to basic user info;
 *
 * p1:read:user - access to read the authenticating user's info attributes (a
 * PingOne-specific scope for reading the user's associated PingOne Identity)
 */
const scopes = "openid";
// The OAuth 2.0 grant type and associated type of response expected from the
// /authorize endpoint. The Authorization Code flow is recommended as the best
// practice in most cases
// https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics-23
const grantType = "authorization_code";
const responseType = "code";

/**
 * Root path - "http://localhost:3000/" (or without the explicit "/" =>
 * "http://localhost:3000")
 *
 * The text displayed with the app from step 1 is replaced by a link with the
 * text "Login" (and the current step).
 *
 *
 * Clicking the link will redirect the user to PingOne with the authorization
 * request parameters to authenticate and authorize access to certain resources
 * (the scopes).
 *
 *
 * This is just one (simplified) way to make the authorization request. It could
 * instead be the action of a button to redirect to the /authorize endpoint of
 * PingOne along with the right parameters.
 *
 *
 * After the user authenticates, PingOne sends the user to the redirect_uri
 * which is typically back on the originating app. In this app, the redirect_uri
 * is configured as a different endpoint then where the user started (which
 * hasn't been added yet and why the "Cannot GET /callback" error message is
 * shown after redirecting back to the app). However, it could be the same
 * endpoint with some modifications to the logic.
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

  /**
   * Returns the "Login" link (and the current step)
   *
   * When the link is clicked the user is redirected to the authorization
   * server, PingOne, at the authorize endpoint. The query parameters are read
   * by PingOne and combine to make the request.
   */
  res
    .status(200)
    .send("Step 2 <br/> <a href=" + authzReq.toString() + ">Login</a>");
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

/**
 * Some terminology which might be helpful...
 *
 *
 * Client - This express app.
 *
 * This app is considered a "private client" because it can protect a secret
 * server-side vs. a SPA/client-side app, for example, which cannot.
 *
 *
 * Authorization Server - PingOne
 *
 * PingOne is the mutually trusted (by the user
 * and the client) 3rd party handling authentication and authorization.
 *
 *
 * Resource Owner - The authenticating user.
 *
 * The client requests access to some resource(s) that a user owns. The user
 * authenticates and authorizes (or rejects) access access to the resource.
 *
 *
 * OAuth 2.0 - The authorization framework.
 *
 * The OAuth 2.0 Authorization Code flow, is generally the flow to start with in
 * order to comply with best practice.
 *
 *
 * OIDC - The authentication framework.
 *
 * A layer on top of OAuth 2.0 which allows the client to know the identity of
 * the user.
 */
