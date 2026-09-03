const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'assets', 'images');
fs.mkdirSync(targetDir, { recursive: true });

const brainDir = 'C:/Users/Laptech IT/.gemini/antigravity-ide/brain/eb9e532f-26fc-41d2-84ed-861cc5f3b1f5';
try {
  fs.copyFileSync(path.join(brainDir, 'hero_living_room_1788280023630.jpg'), path.join(targetDir, 'hero-living-room.jpg'));
  console.log('✓ Hero image copied');
} catch (e) {
  console.log('Hero image copy note:', e.message);
}

try {
  fs.copyFileSync(path.join(brainDir, 'about_tv_wall_1788280057198.jpg'), path.join(targetDir, 'about-tv-wall.jpg'));
  console.log('✓ About image copied');
} catch (e) {
  console.log('About image copy note:', e.message);
}

console.log('Asset setup completed.');
