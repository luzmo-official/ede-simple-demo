# Embedded Dashboard Editor In Simple webapp - With Authentication Layer via Auth0

This demo repo uses an integration in your [Cumul.io](https://cumul.io) account to embed into a webapp that uses [EDE](https://developer.cumul.io/#embedded-dashboard-editor)

This example repo allows you to see how you would set up Embedded Dashboard Editor in a similar web application. Here, you can choose one of your own Cumul.io integrations (We would recommend creating a new one to use for demo/trial purposes) and use it for your first EDE setup.

On this branch we add an Auth0 layer to demonstrate how you would retrieve the role of the end user that has logged in. This would then be used to define which settings or within which constraints the user can interact with [EDE](https://cumul.io/product/embedded-analytics).

E.g. If the user is a `viewer` then they would only be able to view the dashboards in the integration you give them access to. If they are a `designer` or `owner` then they would have access to use Helios capabilities such as switching to `editFull` or `editLimited` modes.

The role of the user is defined in the user's `app_metadata` in Auth0. Here, similar to our previous [Multi-Tenancy on Cumul.io Dashboard with Auth0 Tutorial ](https://blog.cumul.io/2020/09/14/multi-tenancy-on-cumul-io-dashboard-with-auth0/) we add the fields which contain the relevant fields to create an SSO Cumul.io client for the user. E.g., for a user that has the `role: 'designer'`:

```
{
    "username": "bradpotts",
    "name": "Brad Pots",
    "email": "bradpots@exampleapp.com",
    "role": "designer",
    "firstName": "Brad",
    "language": "en",
    "department": "Quadbase",
}
```

In a normal scenario, the `integration ID` that the user would have access to would probably also be defined here. But for the purposes of this demo as we define it in `.env` (see next section) it's unnecessary to add to/retrieve from Auth0.

For more in depth information on these roles and what they mean, please visit the [Academy Course on EDE](https://academy.cumul.io/course/5726aaa3-8845-4bb5-8ce7-46d95e499b45) and [Requesting SSO tokens](https://academy.cumul.io/article/9nzhjs8c)

## Instructions to Run the Application

### For Auth0

1. Create an `auth_config.json` file that contains:

```
{
  "domain": "Your Domain From Auth0",
  "clientId": "Your Client Id From Auth0",
  "audience": "Your Audience From Auth0"
}
```

2. Create an account [here](https://auth0.com/)

3. In the Applications menu create a new Application and select Single Page Web Applications and in Settings:

   - copy 'Domain' & 'Client ID' to the same attributes in the `auth_config.json` file

   - set the parameters of:
     > Allowed Callback URLs: `http://localhost:3000`
     > Allowed Logout URLs: `http://localhost:3000`
     > Allowed Web Origins: `http://localhost:3000`
   - Save the changes

   in Connections: deactive google-oauth2 (to hide social)

4. In Applications -> APIs copy 'API audience' next to Auth0 Management API to the audience attribute in the `auth_config.json` file
5. In order for the metadata to be able to be extracted from the jwt tokens we need to add a rule.

    - Go to Auth Pipeline -> Rules and create a rule with name 'Add metadata to token' and use the following function:

      ```javascript
      let namespace = "http://namespace.app/";
      function (user, context, callback) {
      user.user_metadata = user.user_metadata || {};
      Object.keys(user.user_metadata).forEach((k) => {
        context.idToken[namespace + k] = user.user_metadata[k];
        context.accessToken[namespace + k] = user.user_metadata[k];
      });
      Object.keys(user.app_metadata).forEach((k) => {
        context.idToken[namespace + k] = user.app_metadata[k];
        context.accessToken[namespace + k] = user.app_metadata[k];
      });
      callback(null, user, context);
      }
      ```
      > Note: You have the option to skip the step of creating your own `Rule` on Auth0. Instead, you can install the [Auth0 Cumul.io Integration](https://marketplace.auth0.com/integrations/cumulio-dashboards). In this case make sure you add all of the above fields into a `cumulio` object in `app_metadata`, and use `https://cumulio/` as namespace in the code and `auth_config.json` file (see below).

    - Copy the namespace value used in the rule function above to the namespace property in the `auth_config.json` file. The namespace is required for Auth0 as an arbitrary identifier (see [here](https://auth0.com/docs/tokens/create-namespaced-custom-claims)).

### Cumul.io API Key & Token and The Integration

This app will embed a Cumul.io Integration of your choice. To do so create a `.env` file at the root of the repository and add the `CUMULIO_API_KEY`, `CUMULIO_API_TOKEN` and `INTEGRATION_ID` fields with your own, which you can find on your Cumul.io account.

E.g:

`CUMULIO_API_KEY=abcd...`

`CUMULIO_API_TOKEN=abcd...`

`INTEGRATION_ID=abcd...`

If you need more help creating an integration in Cumul.io or how they work, you can check out some of these resources:

- [How to create an integration](https://academy.cumul.io/article/8ti1ek5r)
- [Associating dashboards with an integration](https://academy.cumul.io/article/6xfe4xh8)
- [Academy Course on EDE](https://academy.cumul.io/course/5726aaa3-8845-4bb5-8ce7-46d95e499b45)

### Run the Application

1. `npm install`
2. `npm run start`
3. Go to `localhost:3000` on your browser
