const {
    Client,
    LocalAuth,
    Chat,
    MessageMedia,
} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const moment = require('moment-timezone');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const fetch = require('node-fetch');
const snapsaveDownloader = require("snapsave-downloader");
const Sentry = require("@sentry/node");

Sentry.init({
    dsn: "YOUR_SENTRY_DNS",
    tracesSampleRate: 1.0,
});

try {
    const client = new Client({
        restartOnAuthFail: true,
        puppeteer: {
            headless: true,
            //executablePath: '/usr/bin/google-chrome-stable',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        },
        //ffmpeg: './ffmpeg.exe',
        authStrategy: new LocalAuth({
            clientId: "client"
        })
    });

    const config = require('./config/config.json');

    // Register event listeners
    client.on('qr', (qr) => {
        console.log(`[${moment().tz(config.timezone).format('HH:mm:ss')}] Scan the QR below : `);
        qrcode.generate(qr, {
            small: true
        });
        console.log(qr);
    });

    // Serve HTML form
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '/public/index.html'));
    });


    client.on('ready', () => {
        console.clear();
        const consoleText = './config/console.txt';
        fs.readFile(consoleText, 'utf-8', (err, data) => {
            if (err) {
                console.log(`[${moment().tz(config.timezone).format('HH:mm:ss')}] Console Text not found!`.yellow);
                console.log(`[${moment().tz(config.timezone).format('HH:mm:ss')}] ${config.name} is Already!`.green);
            } else {
                console.log(data.green);
                console.log(`[${moment().tz(config.timezone).format('HH:mm:ss')}] ${config.name} is Already!`.green);
            }
        });
    });

    //Handle Incoming messages
    const greetings = ["hello", "hi", "hey", "hola", "howdy", "hiya", "yo", "hii", "helloo", "hellooo", "heyy", "hey there", "hi there", "hii there"];
    const userHelp = ["-help", "help"];
    const instaUrlPattern = /(http(s)?:\/\/)?(www\.)?instagram.com\/(p\/[a-zA-Z0-9_-]+|reel\/[a-zA-Z0-9_-]+)(\?[a-zA-Z0-9_=]*)?/;
    const ytUrlPattern = /(http(s)?:\/\/)?((w){3}.)?youtube.com\/(watch\?v=([a-zA-Z0-9_-]{11})|embed\/([a-zA-Z0-9_-]{11})|v\/([a-zA-Z0-9_-]{11})|shorts\/([a-zA-Z0-9_-]{11}))/i;

    const helpMessage = "Hello! 😊 I'm your reliable assistant, ready to guide you. Here's a snapshot of my features:\n\n1. Automatically convert any image, video, or GIF you send into a sticker!\n\n2. Convert a sticker back into an image? I can do that!\n\n3. Want to download a YouTube video? Use the command ```-youtube``` followed by the video URL, and leave the rest to me.\n\n4. Download an Instagram post? Use ```-insta``` followed by the post URL.\n\n5. Terms of Use/Privacy Policy\n\nTo dive deeper into a specific feature, reply with its corresponding number. Let's get started!";

    const welcomeMessage = "Hi there! I'm ITJ-BOT, your personal assistant. Here's a brief rundown of my capabilities:\n\n▪ Automatically turn any media you send into stickers! 🖼️\n\n▪ Transform those entertaining stickers back into images! 🏞️\n\n▪ Download your preferred YouTube videos for offline enjoyment. To do so, use ```-youtube``` command followed by the video URL. 🎥\n\n▪ Download Instagram posts directly from the app. For this, use ```-insta``` command followed by the post URL. 🖼️\n\nTo learn more about any of these features, just type ```-help```. Ready to begin your journey? Let's get started!";

    const terms = `*Terms and Conditions*
    
By using ITJ-BOT, the assistant bot developed by ITJUPITER Pvt Ltd ("ITJUPITER"), you agree to the following terms and conditions:
    
1. ITJ-BOT is provided for your convenience and entertainment purposes. It is not intended for any illegal, harmful, or malicious activities. You are solely responsible for your actions and the way you use ITJ-BOT.
    
2. ITJ-BOT strives to ensure the accuracy and reliability of its features and information. However, ITJUPITER does not guarantee the completeness, accuracy, or reliability of the provided content. The information and services provided by ITJ-BOT should not be considered as professional advice.
    
3. ITJ-BOT does not store or retain any of your messages or media files. All messages and media sent through ITJ-BOT are processed in real-time and deleted once the task is completed. ITJUPITER does not have access to your conversations or media outside the scope of providing the requested services.
    
4. ITJ-BOT operates solely within the WhatsApp platform and does not have access to any external servers or databases. Your privacy and data security are of utmost importance to us. However, please note that the use of ITJ-BOT is subject to WhatsApp's terms and conditions and privacy policy, refer https://www.whatsapp.com/legal/terms-of-service .
    
5. All communications between you and ITJ-BOT are end-to-end encrypted by WhatsApp. This means that your messages and media are secured and cannot be intercepted by any third party. However, ITJUPITER cannot guarantee the security of WhatsApp's encryption or the actions of third parties.
    
6. ITJUPITER reserves the right to modify, suspend, or terminate ITJ-BOT's services at any time without prior notice. We may also update these terms and conditions periodically, and it is your responsibility to review them for any changes.
    
*Privacy Policy*
    
Protecting your privacy is important to us. Here's how we handle your personal information:
    
1. ITJ-BOT does not collect or store any personal data during your interaction. We do not have access to your contacts, location, or any other sensitive information on your device.
    
2. Any information shared with ITJ-BOT, such as URLs or command inputs, is solely used to process your requests and provide the requested services. It is not stored or used for any other purposes.
    
3. ITJUPITER does not share your personal information with any third parties. Your interactions with ITJ-BOT are strictly confidential.
    
4. We may collect anonymized usage statistics to analyze and improve the performance and functionality of ITJ-BOT. These statistics do not include any personally identifiable information.
    
5. While we take all necessary precautions to ensure the security and privacy of your data, no method of transmission over the internet or electronic storage is 100% secure. We recommend using ITJ-BOT responsibly and refraining from sharing any sensitive or confidential information.
    
If you have any questions or concerns about our Terms and Conditions or Privacy Policy, please contact us through the provided support channels.
    
*Contact*
Email: support@itjupiter.tech

Thank you for using ITJ-BOT, a product by ITJUPITER Pvt Ltd, and trusting us with your privacy.`;

    // Function to shorten URL with promise
    async function shorten(url) {
        const requestUrl = `http://tinyurl.com/api-create.php?url=${url}`;

        const response = await fetch(requestUrl);
        const shortUrl = await response.text();

        return shortUrl;
    }

    let helpState = {};

    client.on('message', async (message) => {
        const userMessage = message.body;
        const instaUrlMatch = userMessage.match(instaUrlPattern);
        const ytUrlMatch = userMessage.match(ytUrlPattern);

        try {
            const chat = await client.getChatById(message.id.remote);

            switch (message.type) {
                case 'image':
                case 'video':
                case 'gif':
                    client.sendMessage(message.from, "Hold on...");
                    try {
                        const media = await message.downloadMedia();
                        client.sendMessage(message.from, media, {
                            sendMediaAsSticker: true,
                            stickerName: config.name, // Sticker Name = Edit in 'config/config.json'
                            stickerAuthor: config.author // Sticker Author = Edit in 'config/config.json'
                        }).then(() => {
                            console.log("Sent Successfully");
                        });
                    } catch {
                        client.sendMessage(message.from, "I'm sorry, I encountered an issue while handling your media. Rest assured, we're looking into the problem.");
                    }
                    break;
                case 'sticker':
                    client.sendMessage(message.from, "Hold on...");
                    try {
                        const media = await message.downloadMedia();
                        client.sendMessage(message.from, media).then(() => {
                            console.log("Sent Successfully");
                        });
                    } catch (error) {
                        console.error('Error downloading media:', error);
                        client.sendMessage(message.from, "I'm sorry, I encountered an issue while handling your media. Rest assured, we're looking into the problem.");
                    }
                    break;
                default:
                    if (ytUrlMatch) {
                        console.log("YouTube request");
                        client.sendMessage(message.from, "Let me fetch that YouTube video for you...");
                        const url = ytUrlMatch[0];

                        // Check if URL is provided
                        if (!url) {
                            client.sendMessage(message.from, "Oops! It seems like you've missed the YouTube URL. Here's how you should use this feature: '-youtube https://www.youtube.com/watch?v=kJQP7kiw5Fk'. Could you try again, please?");
                            return;
                        }


                        if (ytdl.validateURL(url)) {
                            try {
                                const info = await ytdl.getInfo(url);
                                const format = ytdl.chooseFormat(info.formats, {
                                    filter: format => format.container === 'mp4' && format.hasAudio && format.hasVideo,
                                    quality: 'highest'
                                });

                                if (format) {
                                    const short = await shorten(format.url);
                                    client.sendMessage(message.from, `Great! Here's your YouTube download link: ${short}`);
                                } else {
                                    client.sendMessage(message.from, "I'm sorry, but I couldn't find a suitable download link for that video. It might not be available in the desired format.");
                                }
                            } catch (err) {
                                console.error(err);
                                client.sendMessage(message.from, "I encountered an issue while trying to download the YouTube video. Please make sure the video isn't a live stream or a previously streamed video and the URL is correct.");
                            }
                        } else {
                            client.sendMessage(message.from, "Hmm, that doesn't seem to be a valid YouTube URL. Please make sure the URL is correct and try again.");
                        }
                    } else if (instaUrlMatch) {
                        console.log("Insta request");
                        client.sendMessage(message.from, "Just a moment while I fetch the post for you...");
                        const url = instaUrlMatch[0];

                        // Check if URL is provided
                        if (!url) {
                            client.sendMessage(message.from, "Oops! It seems like you've missed the Instagram URL. Here's how you should use this feature:\n\n-insta https://www.instagram.com/p/BJIzY6ADGJW/'. Could you try again, please?");
                            return;
                        }

                        try {
                            const downloadResult = await snapsaveDownloader(url);
                            const fileUrl = downloadResult.data[0].url;
                            const shortUrl = await shorten(fileUrl);
                            client.sendMessage(message.from, `Awesome! Here is your Instagram download link: ${shortUrl}`);
                        } catch (err) {
                            console.error(err);
                            client.sendMessage(message.from, "Oh no, I ran into some trouble while trying to download the Instagram post. Could you try again later or ensure that the Instagram post is public and the URL is correct? Thanks!");
                        }
                    } else if (greetings.includes(userMessage.toLowerCase())) {
                        console.log("Greetings");
                        client.sendMessage(message.from, welcomeMessage);
                    } else if (userHelp.includes(userMessage.toLowerCase())) {
                        console.log("Help request");
                        helpState[message.from] = true;
                        client.sendMessage(message.from, helpMessage);
                    } else if (helpState[message.from]) {
                        let response;
                        switch (message.body) {
                            case '1':
                                response = "Want to turn an image, video, or GIF into a sticker? No problem! Simply send me the media. Let's give it a try!";
                                let mediaCase1 = MessageMedia.fromFilePath('./images/mediaToStickerExample.jpg');
                                client.sendMessage(message.from, mediaCase1, {
                                    caption: response
                                });
                                break;
                            case '2':
                                response = "If you've got a sticker you'd love to see as an image, I can make that happen. Simply send over the sticker!";
                                let mediaCase2 = MessageMedia.fromFilePath('./images/stickerToImageExample.jpg');
                                client.sendMessage(message.from, mediaCase2, {
                                    caption: response
                                });
                                break;
                            case '3':
                                response = "Interested in a YouTube video? I can get you the download link. Use the command `-youtube` followed by the YouTube URL.\n\nFor example:\n\n-youtube https://www.youtube.com/watch?v=kJQP7kiw5Fk\n\nPlease note, I can't download videos that are live or were previously streamed.";
                                client.sendMessage(message.from, response);
                                break;
                            case '4':
                                response = "Need to download an Instagram post? I've got you covered. Use the command `-insta` followed by the Instagram post URL. \n\nLike this:\n\n-insta https://www.instagram.com/reel/Cg_3VvRBSH5/\n\nJust remember, I can only download public posts.";
                                client.sendMessage(message.from, response);
                                break;
                            case '5':
                                response = terms;
                                client.sendMessage(message.from, response);
                                break;
                            default:
                                response = "Oops! Looks like that's not an option in my list. Could you please reply with a number from the help menu?";
                                client.sendMessage(message.from, response);
                        }

                        delete helpState[message.from]; // Reset help state
                    } else {
                        await chat.sendSeen();
                    }
            }
        } catch (error) {
            console.error(error);
        }
        
        await chat.sendSeen();
    });

    client.initialize();
} catch (error) {
    Sentry.captureException(error);
}
