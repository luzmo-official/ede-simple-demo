# Embed Helios Into a Simple webapp

This demo repo uses an integration in your [Cumul.io](https://cumul.io) account to embed into a webapp that uses [Helios](https://cumul.io) TODO: Add helios link

Helios is an embedded dashboard editor. This example repo allows you to see how you would set up Helios to be embedded in a similar web application. Here, you can choose one of your own Cumul.io integrations (We would recommend creating a new one to use for demo/trial purposes) and use it for your first Helios setup.

## Instructions to Run the Application

### Cumul.io API Key & Token and The Integration

This app will embed a Cumul.io Integration of your choice. To do so create a `.env` file at the root of the repository and add the `CUMULIO_API_KEY`, `CUMULIO_API_TOKEN` and `INTEGRATION_ID` fields with your own, which you can find on your Cumul.io account.

E.g:

`CUMULIO_API_KEY=abcd...`

`CUMULIO_API_TOKEN=abcd...`

`INTEGRATION_ID=abcd...`

If you need more help creating an integration in Cumul.io or how they work, you can check out some of these resources:

- [How to create an integration](https://academy.cumul.io/article/8ti1ek5r)
- [Associating dashboards with an integration](https://academy.cumul.io/article/6xfe4xh8)

### Run the Application

1. `npm install`
2. `npm run start`
3. Go to `localhost:4030` on your browser
