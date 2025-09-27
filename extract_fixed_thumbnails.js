const fs = require('fs');
const https = require('https');
const path = require('path');

const fixedExercises = [
  'reverse-fly',
  'farmers-carry', 
  'lateral-lunges',
  'squat-to-press',
  'plank-shoulder-tap',
  'front-raises',
  'bicep-curl-press-combo',
  'cable-crunch',
  'hanging-knee-raise',
  'overhead-cable-tricep-extension'
];

const exercisesPath = path.join(__dirname, 'src/data/exercises.json');
const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));

function extractVideoId(url) {
  const match = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

function downloadThumbnail(videoId, filename) {
  return new Promise((resolve, reject) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const file = fs.createWriteStream(filename);
    
    https.get(thumbnailUrl, (response) => {
      if (response.statusCode === 404) {
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

async function extractFixedThumbnails() {
  const imagesDir = path.join(__dirname, 'public/images');
  
  for (const exercise of exercises) {
    if (fixedExercises.includes(exercise.id) && exercise.youtubeEmbed) {
      const videoId = extractVideoId(exercise.youtubeEmbed);
      if (videoId) {
        const filename = path.join(imagesDir, `${exercise.id}-thumb.jpg`);
        try {
          await downloadThumbnail(videoId, filename);
          console.log(`Downloaded thumbnail for ${exercise.name}`);
        } catch (error) {
          console.error(`Failed to download thumbnail for ${exercise.name}:`, error.message);
        }
      }
    }
  }
  
  console.log('Updated thumbnails for fixed exercises');
}

extractFixedThumbnails().catch(console.error);