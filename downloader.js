const fs = require("fs");
const ytdl = require("ytdl-core");
const { trackProgress } = require("./helpers");

async function downloadVideo(url, videoPath) {
  return new Promise((resolve, reject) => {
    const videoStream = ytdl(url, { quality: "highestvideo" });
    trackProgress(videoStream, "Video");

    videoStream
      .pipe(fs.createWriteStream(videoPath))
      .on("finish", resolve)
      .on("error", reject);
  });
}

async function downloadAudio(url, audioPath) {
  return new Promise((resolve, reject) => {
    const audioStream = ytdl(url, { quality: "highestaudio" });
    trackProgress(audioStream, "Audio");

    audioStream
      .pipe(fs.createWriteStream(audioPath))
      .on("finish", resolve)
      .on("error", reject);
  });
}

module.exports = { downloadVideo, downloadAudio };
