const fs = require('fs');
const https = require('https');
const path = require('path');

// Read exercises.json
const exercisesPath = path.join(__dirname, 'src/data/exercises.json');
const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

// Function to extract video ID from YouTube URL
function extractVideoId(url) {
  const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

// Function to download thumbnail
function downloadThumbnail(videoId, filename) {
  return new Promise((resolve, reject) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const file = fs.createWriteStream(filename);
    
    https.get(thumbnailUrl, (response) => {
      if (response.statusCode === 404) {
        // Try medium quality if maxres not available
        const mediumUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
        https.get(mediumUrl, (response2) => {
          response2.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }
    }).on('error', reject);
  });
}

async function extractAllThumbnails() {
  const imagesDir = path.join(__dirname, 'public/images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  for (const exercise of exercises) {
    if (exercise.youtubeEmbed) {
      const videoId = extractVideoId(exercise.youtubeEmbed);
      if (videoId) {
        const filename = path.join(imagesDir, `${exercise.id}-thumb.jpg`);
        try {
          await downloadThumbnail(videoId, filename);
          exercise.thumbnail = `images/${exercise.id}-thumb.jpg`;
          console.log(`Downloaded thumbnail for ${exercise.name}`);
        } catch (error) {
          console.error(`Failed to download thumbnail for ${exercise.name}:`, error.message);
        }
      }
    }
  }

  // Update exercises.json with thumbnail paths
  fs.writeFileSync(exercisesPath, JSON.stringify(exercises, null, 2));
  console.log('Updated exercises.json with thumbnail paths');
}

extractAllThumbnails().catch(console.error);