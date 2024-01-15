# Embedded Dashboard Editor In Simple webapp

This demo repo uses an integration in your [Luzmo](https://luzmo.com) account to embed into a webapp that uses [EDE](https://developer.luzmo.com/#embedded-dashboard-editor)

Use this repository alongside the ['Using the Embedded Dashboard Editor in Your Application' Tutorial](https://www.luzmo.com/blog/embedded-dashboard-editor-application)

This example repo allows you to see how you would set up Embedded Dashboard Editor in a similar web application. Here, you can choose one of your own Luzmo integrations (We would recommend creating a new one to use for demo/trial purposes) and use it for your first EDE setup.

## Instructions to Run the Application

### Luzmo API Key & Token and The Integration

This app will embed a Luzmo Integration of your choice. To do so create a `.env` file at the root of the repository and add the `LUZMO_API_KEY`, `LUZMO_API_TOKEN` and `INTEGRATION_ID` fields with your own, which you can find on your Luzmo account.

E.g:

`LUZMO_API_KEY=abcd...`

`LUZMO_API_TOKEN=abcd...`

`INTEGRATION_ID=abcd...`

If you need more help creating an integration in Luzmo or how they work, you can check out some of these resources:

- [How to create an integration](https://academy.luzmo.com/article/8ti1ek5r)
- [Associating dashboards with an integration](https://academy.luzmo.com/article/6xfe4xh8)
- [Academy Course on EDE](https://academy.luzmo.com/course/5726aaa3-8845-4bb5-8ce7-46d95e499b45)

### Run the Application

1. `npm install`
2. `npm run start`
3. Go to `localhost:3000` on your browser
