const fs = require('fs');
const path = require('path');
const https = require('https');

const servicesDir = path.join(__dirname, 'assets', 'images', 'services');
const workDir = path.join(__dirname, 'assets', 'images', 'work');

fs.mkdirSync(servicesDir, { recursive: true });
fs.mkdirSync(workDir, { recursive: true });

const serviceImages = {
  'wallpapers.jpg': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
  'pvc-panels.jpg': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  'wpc-panels.jpg': 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=600&q=80',
  'window-blinds.jpg': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  'roof-ceilings.jpg': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
  'wooden-floors.jpg': 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80',
  'vinyl-flooring.jpg': 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=600&q=80',
  'decking-floors.jpg': 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
  'carpet-tiles.jpg': 'https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&w=600&q=80',
  'artificial-grass.jpg': 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?auto=format&fit=crop&w=600&q=80',
  '3d-wall-patterns.jpg': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
  'canvas-pictures.jpg': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
  'pvc-mouldings.jpg': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
  'ss-bars.jpg': 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=600&q=80',
  'moss-hedges.jpg': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80',
  'antique-stone.jpg': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
  'paint-polish.jpg': 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
  'wooden-steel.jpg': 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
  'electrical-plumbing.jpg': 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=600&q=80',
};

const workImages = {
  'work-1.jpg': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'work-2.jpg': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
  'work-3.jpg': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'work-4.jpg': 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  'work-5.jpg': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => { file.close(resolve); });
        }).on('error', (err) => { fs.unlink(dest, () => reject(err)); });
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  console.log('Downloading service assets...');
  for (const [filename, url] of Object.entries(serviceImages)) {
    const dest = path.join(servicesDir, filename);
    try {
      await download(url, dest);
      console.log(`✓ ${filename}`);
    } catch (e) {
      console.error(`✗ ${filename}:`, e.message);
    }
  }

  console.log('Downloading work gallery assets...');
  for (const [filename, url] of Object.entries(workImages)) {
    const dest = path.join(workDir, filename);
    try {
      await download(url, dest);
      console.log(`✓ ${filename}`);
    } catch (e) {
      console.error(`✗ ${filename}:`, e.message);
    }
  }
  console.log('All image assets ready!');
}

run();
