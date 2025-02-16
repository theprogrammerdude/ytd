const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
// const ffmpegStatic = require("ffmpeg-static");

const ffmpegBinaryName = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
const extractedFfmpegPath = path.join(process.cwd(), ffmpegBinaryName);

if (!fs.existsSync(extractedFfmpegPath)) {
  try {
    const ffmpegSourcePath = path.join(__dirname, "ffmpeg.exe");
    fs.copyFileSync(ffmpegSourcePath, extractedFfmpegPath);
    fs.chmodSync(extractedFfmpegPath, 0o755); // Ensure it is executable
  } catch (err) {
    console.error("Error extracting ffmpeg:", err.message);
    process.exit(1);
  }
}

ffmpeg.setFfmpegPath(extractedFfmpegPath);

function mergeAudioVideo(videoPath, audioPath, outputPath, callback) {
  ffmpeg()
    .input(videoPath)
    .input(audioPath)
    .output(outputPath)
    .videoCodec("copy")
    .audioCodec("aac")
    .on("end", () => {
      console.log(`\nMerge complete! File saved as: ${outputPath}`);

      // Delete temporary files
      fs.unlinkSync(videoPath);
      fs.unlinkSync(audioPath);

      if (callback) callback();
    })
    .on("error", (err) => {
      console.error("Error merging files:", err.message);
      if (callback) callback();
    })
    .run();
}

module.exports = { mergeAudioVideo };
