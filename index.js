const readline = require("readline");
const { downloadVideo, downloadAudio } = require("./downloader");
const { mergeAudioVideo } = require("./merger");
const { validateYouTubeURL, getFilePaths } = require("./helpers");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptForURL() {
  rl.question(
    "\nEnter the YouTube video URL (or type 'exit' to quit): ",
    async (url) => {
      if (url.trim().toLowerCase() === "exit") {
        console.log("👋 Exiting program. Goodbye!");
        rl.close();
        process.exit(0);
      }

      if (!validateYouTubeURL(url)) {
        console.log("Invalid YouTube URL. Please try again.");
        return promptForURL();
      }

      console.log("\nFetching video info...");
      const { videoPath, audioPath, outputPath } = await getFilePaths(url);

      console.log(`\nDownloading: ${outputPath}...`);
      await Promise.all([
        downloadVideo(url, videoPath),
        downloadAudio(url, audioPath),
      ]);

      console.log("\nDownload complete! Merging video and audio...");
      mergeAudioVideo(videoPath, audioPath, outputPath, promptForURL);
    }
  );
}

promptForURL();
