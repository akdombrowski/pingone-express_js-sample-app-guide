<picture>
  <source media="(prefers-color-scheme: dark)" type="image/svg" srcset="images/PingIdentity-dark.svg">
  <source media="(prefers-color-scheme: light)" type="image/svg" srcset="images/PingIdentity.svg">
  <img alt="PingOne Cloud Platform" src="images/PingIdentity.svg">
</picture>

<picture>
  <source media="(prefers-color-scheme: light)" type="image/svg" srcset="images/PingOne.svg">
</picture>

# PingOne Authentication

###### Express, NodeJS, OAuth 2.0, OIDC, Authz Code Grant Type, Auth, PingOne

This is an example of how to integrate [PingOne](https://apidocs.pingidentity.com/pingone/main/v1/api/) with a simple [Express](https://expressjs.com/) app using the [OIDC](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)[^1] / [OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749#section-4.1)[^2] Authorization Code Flow.

---

## How to use this repo

**A) Step by Step**

Walking through step by step will guide you from a simple hello world example to a basic app with PingOne authentication using OAuth/OIDC.

* Each step has its own folder with an `app.js` file:
  * e.g., `step0/app.js`, `step1/app.js`, and so on...
  * You can run each step with `npm run <step>` from same directory as `package.json`
  * Where `<step> = step0 || step1 || step2 || step3 || step4`
  
**B) Use Snippets in Your App**

Go through the README and/or source code and use what you need in your own app.

**C) Start Experimenting Now**

Jump to the last step and experiment with the complete example.

* Run the app (after installing) from the same directory as `package.json` using the command: `npm run step4`

---

## How to Run the app

#### Prerequisites

* [PingOne account](https://www.pingidentity.com/en/try-ping.html)
  * (Optional, but recommended) a test PingOne Identity and Environment
* [NodeJS](https://nodejs.org/en) (v2.0+)
* [An IDE](https://code.visualstudio.com/download) or a Text Editor & Terminal
* [A modern browser](https://www.google.com/chrome/)

<small>
<strong>*Tips:</strong>

* Use an incognito or private browser, so your session from the admin console isn't used
* Open your browser's network tab in the developer tools, and enable recording, preserving logs, and continued logging upon navigation (or the equivalent settings in your browser)
</small>

### How to Install Dependencies and Start

<sup>*Each step includes its own independent version of the app</sup>

1. `npm install` [^3] to install packages needed for the app (only need to run once)
2. Then, you can run each stage of the app corresponding to a particular step:
  
        npm run <step>
  
  Where \<step\> is "step" + #

* `npm run step0`
* `npm run step1`
* `npm run step2`
* `npm run step3`
* `npm run step4`

### What to Expect in the Final Step

###### *Make sure you've entered the correct values from a PingOne Application Connection into an `.env` file before running. There's a template `.env.EXAMPLE` file you can duplicate, rename, and fill in your values

1. Navigate to `http://localhost:3000` in a browser.
2. Click `Login` to initiate authentication.
3. Browser displays **tokens** inside a JSON response

---

# Walkthrough Guide

## Step 0 - A functioning Express server

`./step0/app.js`

We'll start with a simple working example with [Express's Hello World example](https://expressjs.com/en/starter/hello-world.html)!
This step serves as a test to check whether your environment is properly set up, and it gives us something functional to start with and integrate PingOne into.

*Some comments have been added for extra clarity

```javascript
/**
 * Express Server Config and Initialization
 */
const express = require("express");
const app = express();
const port = 3000;

/**
 * Root path - "http://localhost:3000/" (or without the explicit "/" => "http://localhost:3000")
 *
 * Navigating to the root path should render "Hello World!" in your browser.
 */
app.get("/", (req, res) => {
  res.send("Hello World!");
});

/**
 * This outputs a message to your terminal (wherever you ran the command to 
 * start the app) when the Express server starts up.
 */
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
```

---

## Step 1 - Register your app with PingOne

`./step1/app.js`

1. In the [PingOne console](https://pingidentity.com/signon), navigate to `Connections > Applications` and create a new **PingOne App Connection** using the *OIDC Web App* template. This template is useful when your app has a backend/server.
2. On the ***Configuration*** tab, add the **Redirect URI**:
   `http://localhost:3000/callback` .

   We'll see this come up in a later step, but here we tell PingOne that this is a valid url to redirect the user back to.

---

> [!NOTE]
> Keep this Configuration tab open! The values that are required for the .env file in the next step can be found here

![New PingOne Application Connection - Edit Configuration View](images/p1-app-conn-configuration-redirectURI.svg)

---

3. Duplicate or copy the `.env.EXAMPLE` file and rename it `.env`.
4. Fill in the corresponding values from the PingOne App Connection you just created (the values can be found on the configuration tab).

\***Protect your Client Secret** - *In a traditional Web App, where we have a backend/server to work with, we just need to make sure the secret doesn't get exposed through the frontend. This example makes use of a `.env` file that is accessed only on the server-side and only when needed. This helps keep the secret a secret without hardcoding the secret in the source code.*

```shell
# These values can be found on your 
# Application Connection's Configuration tab 
# in the PingOne admin console

# Auth base url is dependent upon region
# e.g.,
# NA - https://auth.pingone.com
# CA - https:/auth.pingone.ca
# EU - https:/auth.pingone.eu
# APAC - https:/auth.pingone.asia
PINGONE_AUTH_BASE_URL=https://auth.pingone.com

# PingOne Environment ID
PINGONE_ENVIRONMENT_ID=#z2345678-0000-456c-a657-3a21fc9ece7e

# PingOne App Connection Configuration Info
PINGONE_CLIENT_ID=#x7654321-0000-4fc4-b8ed-1441b767e78f
PINGONE_CLIENT_SECRET=########-####-####-####-############

# The base path where this app is running
# Express defaults to localhost, update here otherwise
# The Hello world example uses port 3000 (it's configured in app.js)
APP_BASE_URL=http://localhost
```

In the source code, we'll pull these values into variables using the dotenv package with the `process.env.<variable_name>` syntax:

```javascript
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
```

---

## Step 2 - Add Required Constants

`./step2/app.js`

1. This step adds some constants that'll be needed for our particular configuration and type of authentication/authorization being performed, i.e., PingOne as the authorization server and using the Authorization Code flow.

```javascript
// This app's base origin (e.g., http://localhost:3000)
const appBaseOrigin = appBaseURL + ":" + port;
// PingOne authorize endpoint
const authorizeEndpoint = "/as/authorize";
// PingOne token endpoint
const tokenEndpoint = "/as/token";
// The url path made available for when the user is redirected back from the
// authorization server, PingOne
const callbackPath = "/callback";
// The full url where the user is redirected after authenticating/authorizing
// with PingOne (e.g., http://localhost:3000/callback)
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
```

---

## Step 3 - Modifying the Root Path Logic

`./step3/app.js`

1. Instead of returning "Hello World" from the root path, we'll modify it to construct our authorization request as a URL and send it as the href of an HTML `a` tag (aka a link).
2. Once a user navigates their browser to the root path and clicks the login link, they'll be redirected to PingOne to authenticated and authorize any access she wishes to give the client.
4. If you try it out, after completing authentication,

   **you'll see an error about a missing `callback` page. That's expected!**

   We've yet to set up that path on our server! We'll do that in step 4.

```javascript
/**
 * Root url - "http://localhost:3000/" (or without the explicit "/" =>
 * "http://localhost:3000")
 *
 * Creates and serves the authorization request as a plain link for the user to
 * click and start authentication.
 *
 * No longer will respond with "Hello World!" 
 *
 * When someone navigates their browser, or user agent, to the root path, "/", a
 * basic link with the text "Login" is rendered. Clicking the link will redirect
 * the user to PingOne with the authorization request parameters. The user is
 * then prompted to authenticate.
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
  res.status(200).send("<a href=" + authzReq.toString() + ">Login</a>");
});
```

---

## Step 4 - Setting up the Redirect Path

`./step4/app.js`

Once the user has finished authentication with PingOne, you'll want them to return to your app, right?
Yes! Of, course! Well, that's exactly what the `redirect_uri` is for! It's sent as a parameter in the authorization request and then in the token request.

1. The `redirect_uri` is how PingOne knows where to send the user after authentication is completed.
   * *For security, the `redirect_uri` must be registered with the authorization server, PingOne, first. This is what you did when you modified the App Connection's config and entered a value for the `redirect_uri`. Nice job, you.
2. In our app, we'll set up a listener for this path.
3. In the Authorization Code flow, we expect PingOne to send an authorization code (now, you see why they call it the "Authorization Code flow'? ;)) along with the user to our redirect path.
4. The Authorization Code will be in the query parameters of the request from PingOne.

    It should look something like this:

        http://localhost:3000/callback?code=1200111a-e3f5-0000-0000-1116a5443e33

5. We'll extract this code because we'll need it for the Token Request!
6. Constructing the token request is a little more involved than the authorization request, but, fear not, we've explained everything right there in the source code!
7. We send the Token Request, and we expect to get in return... tokens! Both an access token and id token in this case representing the user's authorization and identity information, respectively.

*If this time you didn't have to login, that's because PingOne found a live session and saved you from having to authenticate again. This can be changed, though.

```javascript
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
```

<h4 align="center">Congrats! You did it!</h4>

You've successfully authenticated a user with PingOne! The returned tokens serve as your proof.

---

## Common Errors and Potential Solutions

* If PingOne sends a redirect_uri mismatch error, check the PingOne app connection and that you've entered the redirect uri correctly.
* If PingOne sends a resource could not be found error, check the auth base url and that the App Connection has been turned on (flip the toggle on the app conenction)
* If you have problems just running `npm start`, delete `node_modules` and `package-lock.json` and run the `npm install` again. Then try starting the app again.

## What's next?

There are several different next steps you might take depending on your use case. Verifying the token(s), sending it in a request to PingOne, using token introspection, submitting a request to the resource server, and more.

But, first you don't want to leave the authorization code in the url. This is done in this app so you can see how it all works and what to expect when you integrate into your own app. You'll want to extract the code and remove it from the url because it can be used to get an access token without other protections if someone happens to get a look at that url or it can block you from getting an access token if someone else attempts to use it and the authorization server invalidates it as a precautionary measure before you get a chance to use it.

During testing, you can [decode the token(s) with this tool here](https://developer.pingidentity.com/en/tools/jwt-decoder.html), verify the signature, check if it's expired, and examine the claims contained within each token. However, remember that these are `Bearer` tokens! That means that these tokens are furry and like honey... I mean, whoever "bears" (aka holds) the tokens holds the power that they grant. This particular decoder runs client-side (a.k.a. exclusively in the browser), but you should still take extra care to make sure you don't give someone the keys to your kingdom!

[^1]: For authentication.
[^2]: For authorization.
[^3]: Run the command from the same directory containing the `package.json` file is located.
