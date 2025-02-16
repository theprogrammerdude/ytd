const path = require("path");
const os = require("os");
const ytdl = require("ytdl-core");
const fs = require("fs");

const downloadsDir = path.join(os.homedir(), "Downloads", "ytd");

if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

function trackProgress(stream, label) {
  let downloaded = 0;
  let totalSize = null;

  stream.on("response", (res) => {
    const contentLength = res.headers["content-length"];
    if (contentLength && !isNaN(contentLength)) {
      totalSize = parseInt(contentLength, 10);
    } else {
      console.warn(`${label}: Warning - Unable to determine total file size.`);
    }
  });

  stream.on("data", (chunk) => {
    downloaded += chunk.length;

    if (totalSize && totalSize > 0) {
      const percent = Math.min((downloaded / totalSize) * 100, 100).toFixed(2); // Cap at 100%
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`${label} Downloading: ${percent}%`);
    } else {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(
        `${label} Downloaded: ${(downloaded / 1024 / 1024).toFixed(2)} MB`
      );
    }
  });
}

function validateYouTubeURL(url) {
  return ytdl.validateURL(url);
}

async function getFilePaths(url) {
  const info = await ytdl.getInfo(url);
  const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");

  return {
    videoPath: path.join(downloadsDir, `${title}-video.mp4`),
    audioPath: path.join(downloadsDir, `${title}-audio.mp4`),
    outputPath: path.join(downloadsDir, `${title}.mp4`),
  };
}

module.exports = { trackProgress, validateYouTubeURL, getFilePaths };
