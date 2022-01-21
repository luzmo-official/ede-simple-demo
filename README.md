# Embed Helios Into a Simple webapp

This demo repo uses an integration in your [Cumul.io](https://cumul.io) account to embed into a webapp that uses [Helios](https://cumul.io) TODO: Add helios link

Helios is an embedded dashboard editor. This example repo allows you to see how you would set up Helios to be embedded in a similar web application. Here, you can choose one of your own Cumul.io integrations (We would recommend creating a new one to use for demo/trial purposes) and use it for your first Helios setup.

## Instructions to Run the Application

### Cumul.io API Key & Token and The Integration

This app will embed a Cumul.io Integration of your choice. To do so go to the `.env` file at the root of the repository and replace the `CUMULIO_API_KEY`, `CUMULIO_API_TOKEN` and `INTEGRATION_ID` fields with your own.

If you need more help creating an integration in Cumul.io or how they work, you can check out some of these resources:

### Run the Application

1. `npm install`
2. `npm run start`
3. Go to `localhost:4030` on your browser
