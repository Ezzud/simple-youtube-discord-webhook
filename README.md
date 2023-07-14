# Simple Youtube Discord Webhook
Simple program to automatically send a Discord webhook when a new youtube video is posted on a youtube channel

![Example Screenshot](https://cdn.discordapp.com/attachments/1110215233408073779/1129441638389907537/2leZkG7.png)

## Requirement
- NodeJS v18+


**How to create a Discord Webhook and get the URL: https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks**

**How to get a Youtube Channel ID: https://www.streamweasels.com/tools/youtube-channel-id-and-user-id-convertor/**

## Configuration
- Edit on `config.json`:
  - Change "Youtube Channel ID" by the channel ID you want to track
  - Change "Discord Webhook URL" by the Discord webhook URL you want to use
  - Change "Youtube" by the username the webhook will have
  - Change "https://img.freepik.com/icones-gratuites/youtube_318-194847.jpg" by the image URL the webhook will have as avatar
  - ⚠ Do not change texts **%VIDEO_TITLE%** and **%VIDEO_URL%**, they will be replace by the Video Title and the Video URL.
    You can still change the rest of the message

## Launch the program
- For Windows Users: Open `start.bat` file
- For Linux Users: Open `start.sh` file
