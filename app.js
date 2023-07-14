// Requirements
const ytch = require('yt-channel-info')
const axios = require('axios');
const quick = require('quick.db')
const db = new quick.table("info")
const config = require("./config.json")
const package_info = require("./package.json")

// Setting-up youtube payload
const payload = {
   channelId: config.youtubeChannelID, 
   sortBy: 'newest',
   channelIdType: 0
}


// Setting-up data tables
if(!db.get("lastVideo")) {
    db.set("lastVideo", "0")
}
if(!db.get("sentVideos")) {
    db.set("sentVideos", [])
}



console.log(`\x1b[32mSimple Youtube Notification v${package_info.version}\x1b[0m\n`)
console.log("\x1b[33mDeveloper:\x1b[0m github.com/Ezzud")
console.log("\x1b[33mSupport:\x1b[0m discord.ezzud.fr\n")


async function sendNewVideoWebhook(data) {
    axios({
        method: 'post',
        url: config.webhook.url,
        data: data
    })
    .then(function (response) {
        console.log(`\x1b[32m[S]\x1b[0m New video successfully sent`)
    })
    .catch(function (error) {
        if(error) console.log("\x1b[31m[E]\x1b[0m An error occured when sending the webhook, please check the informations on config.json")
    });
}



async function checkForNewVideo() {
    // Fetching channel videos
    let error = false
    let informations = await ytch.getChannelVideos(payload).catch((err) => {
        error = true
        console.log("\x1b[31m[E]\x1b[0m An error occured when trying to get recent youtube videos, please check your config.json!")
    })
    if(error) return;

    // Checking for youtube error
    if(informations.alertMessage) {
        console.log("\x1b[31m[E]\x1b[0m Error while getting informations:\n" + informations.alertMessage)
        return;
    }


    // Checking videos on channel
    let videos = informations.items
    if(!videos || !videos[0]) {
        console.log("\x1b[31m[E]\x1b[0m An error occured when trying to get recent youtube videos, the youtube channel doesn't have any videos")
        return;
    }

    // Getting the first and last registered videos
    let firstVideo = videos[0]
    let oldVideo = await db.get("lastVideo")


    // Check if last video is the same
    if(firstVideo.videoId !== oldVideo) {

        // Replacing the old last video to the new one
        await db.set("lastVideo", firstVideo.videoId)
        if(db.get("sentVideos").find(x => x.id === firstVideo.videoId)) {
            return;
        }
        await db.push("sentVideos", { "id":firstVideo.videoId})

        // Creating webhook info
        var webhook_data = {
            "username":config.webhook.username,
            "avatar_url":config.webhook.avatar_url,
            "content": config.webhook.content.replaceAll("%VIDEO_URL%", `https://youtube.com/watch?v=${firstVideo.videoId}`).replaceAll("%VIDEO_TITLE%", firstVideo.title)
        };
        console.log(`\x1b[33m[I]\x1b[0m New video found, trying to send a webhook...`)
        await sendNewVideoWebhook(webhook_data);

        
        
    }
}

async function start() {
    checkForNewVideo();
    setInterval(async() => {
        checkForNewVideo();
    }, 60000)
}

start();








