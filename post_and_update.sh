#!/bin/bash
# post_and_update.sh <tweet_text>

TWEET_TEXT=$1

if [ -z "$TWEET_TEXT" ]; then
  echo "Usage: ./post_and_update.sh \"Your tweet text\""
  exit 1
fi

# 1. Post to X
source /home/panpawka/.clawdbot/credentials/bird.env
bird tweet "$TWEET_TEXT"

# 2. Add to posts.json (keep last 5)
# This is a bit of a hacky shell/node one-liner to update the JSON
node -e "
const fs = require('fs');
const path = './posts.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
data.recent_posts = [
  {
    text: process.argv[1].substring(0, 80) + (process.argv[1].length > 80 ? '...' : ''),
    url: 'https://x.com/panpawka',
    date: new Date().toLocaleDateString('en-GB')
  },
  ...data.recent_posts
].slice(0, 5);
fs.writeFileSync(path, JSON.stringify(data, null, 2));
" "$TWEET_TEXT"

# 3. Trigger the README update
node index.js

# 4. Commit and push
git add README.md posts.json
git commit -m "Social update: $TWEET_TEXT"
git push
