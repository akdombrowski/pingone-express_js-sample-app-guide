<img alt="Ping Identity" src="./PingIdentity.svg" width="25%" height="auto" />

<img alt="PingOne" src="./PingOne.svg" width="20%" height="auto" style="padding-left: 40%;" />

# PingOne with NodeJS Express

## Authorization Code OAuth 2.0/OIDC Flow

This is a quick example or starting point showing how to integrate [PingOne](https://apidocs.pingidentity.com/pingone/main/v1/api/) authentication using the Authorization Code Flow [OIDC](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)[^1] / [OAuth 2.0](https://www.rfc-editor.org/rfc/rfc6749#section-4.1)[^2] with a basic [Express](https://expressjs.com/) app running on [NodeJS](https://nodejs.org/en).

### Prerequisites

* Have [created a PingOne account](https://www.pingidentity.com/en/try-ping.html) with a test environment.
* Have [NodeJS](https://nodejs.org/en) installed.

### Setup

##### PingOne Setup

1. Create a new PingOne App Connection using the Web Application template.
2. Edit the configuration to add `http://localhost:3000/login/callback` as a redirect_uri.
3. Keep this open as you'll need to copy over some values.

##### App Setup

1. Clone the repo or download the files.
2. Run `npm install` in the same directory as the code.[^3]
3. Create a copy of the `.env.EXAMPLE` file and name it `.env`.[^4]
4. Fill in the missing values in the newly created `.env` file.

### Running the app

You can run it locally very easily with `npm start`

### Using the app

1. If running locally, navigate to `localhost:3000` or `localhost:3000/login`.
2. Click the [Login]() [^5] link to initiate authentication.

### What to do next?

You'll want to validate the token. You can do this by [verifying the signature](https://developer.pingidentity.com/en/tools/jwt-decoder.html), checking whether the expiration time has passed, and performing any other necessary checks.

Then you can use your tokens to best suit your use case.

For example, you might want to [decode the tokens](https://developer.pingidentity.com/en/tools/jwt-decoder.html) from their JWT (JWS) format and have your app display the info or act on it in some way.

[^1]: For authentication.
[^2]: For authorization.
[^3]: Run the command from the same directory containing the `package.json` file is located.
[^4]: Keep the `.env` file at the same level as the example, namely, at the root of the project.
[^5]: The `Login` link in this README file is merely illustrative of what you should see in your browser. It doesn't actually (meaningfully) link anywhere. In the app, it initiates the Authorization Code Flow.
