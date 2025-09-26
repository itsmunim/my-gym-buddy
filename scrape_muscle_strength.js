const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const exerciseSearchTerms = {
  'dumbbell-shoulder-row': 'dumbbell upright row',
  'bent-over-row': 'bent over dumbbell row',
  'bicep-curl': 'dumbbell bicep curl',
  'plank-shoulder-taps': 'plank shoulder taps',
  'bench-press': 'dumbbell bench press',
  'incline-dumbbell-press': 'incline dumbbell press',
  'one-arm-dumbbell-row': 'one arm dumbbell row',
  'overhead-press': 'dumbbell shoulder press',
  'goblet-squat': 'goblet squat',
  'kettlebell-rdl': 'romanian deadlift',
  'cable-chest-fly': 'cable chest fly',
  'farmers-walk': 'farmers walk'
};

async function scrapeExercises() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  const results = {};
  
  for (const [exerciseId, searchTerm] of Object.entries(exerciseSearchTerms)) {
    try {
      console.log(`Searching for: ${searchTerm}`);
      
      // Search on muscle & strength with correct format
      const searchUrl = `https://www.muscleandstrength.com/store/search/articles?___store=eu&ccat=exercise&q=${encodeURIComponent(searchTerm)}`;
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      
      // Find exercise URLs with the specific prefix and exercise name in URL
      const exerciseLinks = await page.evaluate((searchTerm) => {
        const links = Array.from(document.querySelectorAll('a[href*="/exercises/"]'));
        const exerciseUrls = links
          .map(link => link.href)
          .filter(href => href.startsWith('https://www.muscleandstrength.com/exercises/') && href.includes('.html'));
        
        // Try to find URL that contains words from search term
        const searchWords = searchTerm.toLowerCase().split(' ');
        const matchingUrls = exerciseUrls.filter(url => {
          const urlLower = url.toLowerCase();
          return searchWords.some(word => urlLower.includes(word));
        });
        
        return matchingUrls.length > 0 ? matchingUrls : exerciseUrls;
      }, searchTerm);
      
      if (exerciseLinks.length > 0) {
        const exerciseUrl = exerciseLinks[0];
        console.log(`Found exercise URL: ${exerciseUrl}`);
        
        // Visit the exercise page
        await page.goto(exerciseUrl, { waitUntil: 'networkidle2' });
        
        // Get YouTube embed URL
        const youtubeEmbed = await page.evaluate(() => {
          const iframe = document.querySelector('iframe[src*="youtube.com"]');
          return iframe ? iframe.src : null;
        });
        
        // Get exercise image
        const exerciseImage = await page.evaluate(() => {
          const img = document.querySelector('.exercise-image img, .exercise-main-image img, img[alt*="exercise"]');
          return img ? img.src : null;
        });
        
        results[exerciseId] = {
          url: exerciseUrl,
          youtubeEmbed: youtubeEmbed,
          image: exerciseImage
        };
        
        console.log(`${exerciseId}: YouTube=${!!youtubeEmbed}, Image=${!!exerciseImage}`);
      } else {
        console.log(`No exercise URL found for ${searchTerm}`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error processing ${exerciseId}:`, error.message);
    }
  }
  
  await browser.close();
  
  // Update exercises.json
  const exercisesPath = path.join(__dirname, 'src/data/exercises.json');
  const exercises = JSON.parse(fs.readFileSync(exercisesPath, 'utf8'));
  
  exercises.forEach(exercise => {
    if (results[exercise.id]) {
      if (results[exercise.id].youtubeEmbed) {
        exercise.youtubeEmbed = results[exercise.id].youtubeEmbed;
      }
      if (results[exercise.id].image) {
        exercise.thumbnail = results[exercise.id].image;
      }
    }
  });
  
  fs.writeFileSync(exercisesPath, JSON.stringify(exercises, null, 2));
  console.log('Updated exercises.json with YouTube embeds and images');
  
  // Save results for reference
  fs.writeFileSync('scrape_results.json', JSON.stringify(results, null, 2));
}

scrapeExercises().catch(console.error);