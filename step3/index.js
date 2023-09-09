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
 * Root path - "http://localhost:3000"
 *
 * (see step2/index.js for more detailed info)
 *
 * Navigating to the root path should display a "Login" link (and the current
 * step). When clicked, user will be redirected to PingOne to authenticate and
 * authorize any access requested.
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

  // Returns the "Login" link (and the current step)
  res
    .status(200)
    .send("Step 3 <br/> <a href=" + authzReq.toString() + ">Login</a>");
});

/**
 * Callback url - "http://localhost:3000/callback"
 *
 * The path for the redirect_uri. When the user is redirected from PingOne, the
 * authorization code is extracted from the query parameters, then the token
 * request is constructed and submitted for access and id tokens.
 *
 * This path isn't meant to be manually navigated to. It serves as the location
 * for the user to be redirected to after interacting with PingOne, the
 * authorization server. If the user successfully authenticated/authorized with
 * PingOne, they'll be sent to here with an authorization code in the query
 * parameters which looks like (?code=<random-chars>). In this sample, the code
 * is left in the URL, so you can see what it looks like and how it's sent here,
 * but, in practice, you'll want to limit exposure to this value.
 */
app.get(callbackPath, async (req, res) => {
  // Try to parse the authorization code from the query parameters of the url.
  const authzCode = req.query?.code;

  // Send error if the authorization code was not found.
  if (!authzCode) {
    const errorMsg =
      "Expected authorization code in query parameters.\n" + req.url;
    console.error(errorMsg);
    res.status(404).send("<a href='/'>Return home</a>");
  }

  /**
   * Set headers for token request.
   */
  const headers = new Headers();
  // Content type
  headers.append("Content-Type", "application/x-www-form-urlencoded");
  // Authorization header
  // Calculated as the result of base64 encoding the string:
  // (clientID + ":" + clientSecret) and appended to "Basic ". e.g., "Basic
  // 0123456lNzQtZT3Mi00ZmM0WI4ZWQtY2Q5NTMwTE0123456=="
  const authzHeader =
    "Basic " + Buffer.from(clientID + ":" + clientSecret).toString("base64");
  headers.append("Authorization", authzHeader);

  // Use URLSearchParams because we're using
  // "application/x-www-form-urlencoded".
  const urlBodyParams = new URLSearchParams();
  // The grant type is the OAuth 2.0/OIDC grant type that the PingOne app
  // connection is configured to accept and was used for the authorization
  // request. Remember, this example is set up for Authorization Code.
  urlBodyParams.append("grant_type", grantType);
  // Include the authorization code that was extracted from the url.
  urlBodyParams.append("code", authzCode);
  // The redirect_uri is the same as what was sent in the authorize request. It
  // must be registered with PingOne by configuring the app connection.
  urlBodyParams.append("redirect_uri", redirectURI);

  // Options to supply the fetch function.
  const requestOptions = {
    method: "POST",
    headers: headers,
    body: urlBodyParams,
  };

  // PingOne token endpoint
  const tokenURL = authBaseURL + "/" + envID + tokenEndpoint;

  // Make the exchange for tokens by calling the /token endpoint and sending the
  // authorization code.
  try {
    // Send the token request and get the response body in JSON format.
    const response = await fetch(tokenURL, requestOptions);
    if (response.ok) {
      const result = await response.json();
      // For demo purposes, this forwards the json response from the token
      // endpoint.
      res.status(200).json(result);
    } else {
      res.status(response.status).send(response.json());
    }
  } catch (error) {
    // Handle error

    // For demo purposes, log the error to the server console and send the
    // error as a response.
    console.log(error);
    res.status(500).send(error);
  }
});

/**
 * This outputs a message (modified to show you the current step) to your
 * terminal (where you started the app) when the Express server starts up.
 */
app.listen(port, () => {
  console.log(
    `The PingOne sample Express app has started listening on ${appBaseURL}:${port}`
  );
  console.log("Step 3 - Setting up the redirect_uri path and getting tokens.");
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
