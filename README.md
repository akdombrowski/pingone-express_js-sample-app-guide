<img alt="Ping Identity" src="./images/PingIdentity.svg" width="25%" height="auto" />

<img alt="PingOne" src="./images/PingOne.svg" width="20%" height="auto" style="padding-left: 40%;" />

# PingOne with NodeJS Express

## Authentication using PingOne and the Authorization Code OAuth 2.0/OIDC Flow

This is a quick example or starting point showing how to integrate [PingOne](https://apidocs.pingidentity.com/pingone/main/v1/api/) authentication using the Authorization Code Flow of [OIDC](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)[^1] / [OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749#section-4.1)[^2] with a basic [Express](https://expressjs.com/) app running on [NodeJS](https://nodejs.org/en).

## Structure

The sample app has been broken down into 4 steps to walk you through how to build up a working app that has integrated PingOne for authentication.

Here are a few suggestions as to how to use this repo:

* follow along with the different branches from start to steps 1-4
  * this will take you from a basic Express Hello World app to an app that can authenticate users using PingOne and OAuth/OIDC.
* skip to the final branch (step 4) and run that
  * you'll have a working, but simple, app with authentication to start experimenting with.
* follow along with the different branches but implement directly into your own app.
  * take the info gained here and apply it directly to your app to see how this works in your own app and environment

## Prerequisites

* Have [created a PingOne account](https://www.pingidentity.com/en/try-ping.html) with a test environment.
* Have [NodeJS](https://nodejs.org/en) installed.
* (optional) IDE or Text Editor & Terminal

## Setup

#### Step 1 - Register your app with PingOne

1. Create a new PingOne App Connection using the OIDC Web App template.
2. On the Configuration tab, make sure these things are configured (image is for reference):
   1. Response Type = Code
   2. Grant Type = Authorization Code
      1. PKCE set to Optional or None (this can be adjusted later)
   1. Redirect URI = `http://localhost:3000/callback`
   4. Token Endpoint Authentication Method = Client Secret Basic

<img alt="PingOne" src="./images/p1-app-conn-configuration-redirectURI.svg" width="80%" height="auto" style="margin-left: 10%;" />

##### Keep this app connection screen handy as you'll need to copy over some values

3. Duplicate or copy the `.env.EXAMPLE` file and rename the new file `.env`.
4. Enter in the values from the App Connection you just created.

#### Step 2 - Constants Required

* This step adds onto the last by creating some constants that'll be needed for our particular configuration and type of authentication/authorization being performed.
* Have a look at each variable and the associated explanations in the comments.

#### Step 3 - Modifying the Root Path Logic

* This is where we start to see some logic being modified.
* Instead of simply returning "Hello World" from the root path, we'll modify it to construct our authorization request as a URL and send it as a response in a basic HTML link.
* Once a user navigates their browser to the root path and clicks the login link, they'll be redirected to PingOne to authenticated and authorize any access she wishes to give the client.
* Go ahead and try it out!
* Tip: Open your browser's dev tools and take a look at what's happening in the Network tab.

#### Step 4 - Setting up the Redirect Path

* Once the user has finished authentication with PingOne, you'll want them to return to your app, right?
* Yes! Of, course! That's what the `redirect_uri` is for! It was sent as a parameter in the authorization request.
* And, it's how PingOne knows where to send the user after authentication is completed.
* For security, the `redirect_uri` must be registered with the authorization server, PingOne, first. This is what you did when you modified the App Connection's config and entered a value for the `redirect_uri`. Nice job, you.
* In our app, we'll set up a listener for this path.
* In the Authorization Code flow, we expect PingOne to send an authorization code (now, you see why they call it the "Authorization Code flow'? ;)) along with the user to our redirect path.
* The code will be in the query parameters of the request from PingOne.
* We'll extract this code because we'll need it for the Token Request!
* Constructing the token request is a little more involved than the authorization request, but, fear not, we've explained everything right there in the source code file!
* We send the Token Request, and we expect to get in return... tokens! Both an access token and id token in this case representing the user's authorization and identity information, respectively.
* Congrats! You did it! You hold your in hands proof that you've authenticated your first user with PingOne!

## At any step, you can run the app. You can even run it at every step just to compare what's happening! I'd even recommend it

#### App Setup

1. Clone the repo or download the files and find the branch you want.
2. Run `npm install` in the same directory as the code.[^3]
1. Create a copy of the `.env.EXAMPLE` file and name it `.env`.[^4]
2. Fill in the missing values in the newly created `.env` file.

## Running the app

Start the app locally by running `npm start`.

If you run into any issues when you switch to a new branch after having run the app in a previous branch, delete your `node_modules`  and `package-lock.json` files and run the install again. Then try starting the app again.

## Using the app

1. If running locally, open a browser and navigate to `localhost:3000`.
2. Click the [Login]() [^5] link to initiate authentication.

## What to do next?

There are several different next steps you might take depending on your use case. Verifying the token(s) on the resource server, sending it in a request to PingOne, introspecting it to extract any necessary values, and more.

During testing, you can [decode the token(s) with this tool here](https://developer.pingidentity.com/en/tools/jwt-decoder.html), and verify the signature, check whether the expiration time has passed, and examine the claims contained within each token. Just remember that these are `Bearer` tokens meaning that they're hairy and like honey... I mean, whoever "bears" (aka holds) the tokens gets the powers that they grant. The linked tool runs client-side (aka the app runs exclusively in the browser), but you should still take extra care to make sure you don't give someone the keys to the kingdom!

[^1]: For authentication.
[^2]: For authorization.
[^3]: Run the command from the same directory containing the `package.json` file is located.
[^4]: Keep the `.env` file at the same level as the example, namely, at the root of the project.
[^5]: The `Login` link in this README file is merely illustrative of what you should see in your browser. It doesn't actually (meaningfully) link anywhere. In the app, it initiates the Authorization Code Flow by sending an authorization request (it quite literally <i>is</i> the authorization request and it's submitted to the authorization server, PingOne, by redirected the user via the browser to this url).
