# WhatsApp Bot

This repository contains a Node.js application that serves as a WhatsApp bot using the `whatsapp-web.js` library. The bot provides various functionalities such as converting media to stickers, downloading YouTube videos, and downloading Instagram posts. It also includes additional features like greeting messages, help commands, and a terms of use/privacy policy message.

## Prerequisites

Before running the bot, ensure that you have the following installed:

- Node.js
- NPM (Node Package Manager)

## Installation

1. Clone this repository to your local machine or download the source code as a ZIP file.
2. Open a terminal or command prompt and navigate to the project directory.
3. Run the following command to install the required dependencies:

   ```
   npm install
   ```

4. Obtain a Sentry DNS (Data Source Name) to enable error tracking and monitoring for the bot. 

   - Visit the [Sentry website](https://sentry.io/) and sign up for an account if you don't have one.
   - Create a new project in Sentry and obtain the DNS for the project.
   - Replace the `dsn` value in the `Sentry.init()` function call with your Sentry DNS in the `index.js` file.

## Usage

1. Obtain the necessary configuration files:

   - Create a `config.json` file in the `config` directory with the following structure:

     ```json
     {
       "name": "YourStickerName",
       "author": "YourStickerAuthor",
       "timezone": "YourTimezone"
     }
     ```

     Replace `YourStickerName` with the desired name for the stickers generated by the bot and `YourStickerAuthor` with the desired author name for the stickers. Set `YourTimezone` to your local timezone (e.g., `America/New_York`).

   - Replace the `passwordHash` variable in the code with a hash of your desired password. The provided value is a placeholder and should be changed for security.

   - If necessary, modify the `puppeteer` object in the `Client` initialization to match your system configuration. You may need to adjust the `executablePath` and `args` properties according to your environment.

2. Run the bot using the following command:

   ```
   node index.js
   ```

3. Scan the displayed QR code with your WhatsApp account using the WhatsApp mobile app. This authenticates the bot with your account.

4. Once the bot is initialized, it will start listening for incoming messages and provide the configured functionalities.

## Features

### Media to Sticker Conversion

When you send an image, video, or GIF to the bot, it will convert it into a sticker and send it back to you.

### Sticker to Image Conversion

If you send a sticker to the bot, it will convert it back into an image and send it back to you.

### YouTube Video Download

You can request the bot to fetch the download link for a YouTube video. Use the command `-youtube` followed by the YouTube video URL. For example:

```
-youtube https://www.youtube.com/watch?v=kJQP7kiw5Fk
```

Please note that the bot cannot download videos that are live or were previously streamed.

### Instagram Post Download

The bot can download Instagram posts directly from the app. Use the command `-insta` followed by the Instagram post URL. For example:

```
-insta https://www.instagram.com/reel/Cg_3VvRBSH5/
```

The bot can only download public posts.

### Greetings and Help Messages

The bot recognizes common greetings and provides a welcome message. You can also request help using the command `-help` or variations of it.

 The bot will respond with a list of features and instructions for each feature.

### Terms of Use and Privacy Policy

The bot provides a terms of use and privacy policy message that explains its functionalities, data handling, and your responsibilities as a user.

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
