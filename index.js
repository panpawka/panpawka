require('dotenv').config();
const Mustache = require('mustache');
const fs = require('fs');

const MUSTACHE_MAIN_DIR = './main.mustache';
const POSTS_DATA_DIR = './posts.json';

let DATA = {
  refresh_date: new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Warsaw',
  }),
};

// Load recent posts if they exist
try {
  const postsJson = fs.readFileSync(POSTS_DATA_DIR, 'utf8');
  const postsData = JSON.parse(postsJson);
  DATA.recent_posts = postsData.recent_posts || [];
} catch (e) {
  DATA.recent_posts = [];
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

async function action() {
  /**
   * Generate README
   */
  await generateReadMe();

  console.log('✅ README.md updated successfully!');
  console.log(`📅 Last update: ${DATA.refresh_date}`);
}

action();
