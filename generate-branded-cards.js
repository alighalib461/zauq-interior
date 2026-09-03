const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, 'assets', 'images', 'services');

const brandedServices = [
  {
    key: 'decking-floors',
    title: 'DECKING FLOORS',
    subtitle: 'Weatherproof Outdoor Luxury',
    desc: "Bazauq Interiors' WPC composite decking combines the natural beauty of wood with high weather resistance, perfect for terraces, pools & balconies.",
    imageFile: 'decking-floors.jpg'
  },
  {
    key: 'carpet-tiles',
    title: 'CARPET TILES',
    subtitle: 'Smart, Silent & Commercial Grade',
    desc: 'Bazauq Interiors delivers premium modular acoustic carpet tiles with high durability and plush comfort for executive offices and suites.',
    imageFile: 'carpet-tiles.jpg'
  },
  {
    key: '3d-wall-patterns',
    title: '3D WALL PATTERNS',
    subtitle: 'Architectural Feature Walls',
    desc: 'Bazauq Interiors brings tactile 3D geometric wall patterns and acoustic panels that transform plain rooms into architectural statements.',
    imageFile: '3d-wall-patterns.jpg'
  },
  {
    key: 'canvas-pictures',
    title: 'CANVAS ART',
    subtitle: 'That Captivates Your Walls',
    desc: 'Bazauq Interiors provides curated gallery-wrap canvas art, Islamic calligraphy, and luxury framed murals tailored to your room palette.',
    imageFile: 'canvas-pictures.jpg'
  },
  {
    key: 'pvc-mouldings',
    title: 'PVC MOULDINGS',
    subtitle: 'Neoclassical Royal Elegance',
    desc: "Bazauq Interiors' French wall mouldings and wainscoting add timeless architectural symmetry and refined luxury to walls and ceilings.",
    imageFile: 'pvc-mouldings.jpg'
  },
  {
    key: 'ss-bars',
    title: 'SS PVD PROFILES',
    subtitle: 'Titanium Gold Luxury Accents',
    desc: 'Bazauq Interiors installs Grade 304 Titanium PVD coated stainless steel T-bars, U-channels, and luxury partition screens in Gold & Rose Gold.',
    imageFile: 'ss-bars.jpg'
  },
  {
    key: 'moss-hedges',
    title: 'MOSS & HEDGES',
    subtitle: 'Biophilic Natural Greenery',
    desc: 'Bazauq Interiors creates zero-maintenance preserved natural moss walls and dense artificial green vertical gardens for refreshing indoor luxury.',
    imageFile: 'moss-hedges.jpg'
  },
  {
    key: 'antique-stone',
    title: 'ANTIQUE STONE',
    subtitle: 'Natural Rustic Texture & Durability',
    desc: 'Bazauq Interiors crafts natural slate, travertine, stacked ledge stone, and antique brick veneers for luxury feature facades and fireplaces.',
    imageFile: 'antique-stone.jpg'
  },
  {
    key: 'paint-polish',
    title: 'PAINT & POLISH',
    subtitle: 'Velvet Matt & High Gloss PU',
    desc: 'Bazauq Interiors provides ultra-luxurious velvet washable wall paints, decorative stucco marble effects, and mirror PU Italian wood polishes.',
    imageFile: 'paint-polish.jpg'
  },
  {
    key: 'wooden-steel',
    title: 'WOODEN & STEEL',
    subtitle: 'Bespoke Architectural Fabrication',
    desc: 'Bazauq Interiors fabricates custom entertainment media walls, walk-in closets, kitchen cabinets, and minimalist steel glass dividers.',
    imageFile: 'wooden-steel.jpg'
  },
  {
    key: 'electrical-plumbing',
    title: 'SMART LIGHTING',
    subtitle: 'Complete Turnkey MEP Solutions',
    desc: 'Bazauq Interiors plans and executes architectural lighting, magnetic track spots, smart automation, and certified plumbing fit-outs.',
    imageFile: 'electrical-plumbing.jpg'
  }
];

function generateSvgCard(item) {
  let imgBase64 = '';
  const imgPath = path.join(servicesDir, item.imageFile);
  if (fs.existsSync(imgPath)) {
    const ext = path.extname(imgPath).replace('.', '') || 'jpeg';
    imgBase64 = `data:image/${ext};base64,${fs.readFileSync(imgPath).toString('base64')}`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&amp;family=Plus+Jakarta+Sans:wght@500;600;700;800&amp;display=swap');
      .title-text { font-family: 'Outfit', sans-serif; font-weight: 900; fill: #ffffff; text-anchor: start; }
      .sub-title { font-family: 'Outfit', sans-serif; font-weight: 800; fill: #111111; }
      .desc-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 19px; fill: #334155; font-weight: 500; line-height: 1.5; }
      .brand-highlight { font-weight: 800; fill: #049189; }
      .footer-text { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 700; fill: #1e293b; }
      .logo-eng { font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 800; fill: #334155; letter-spacing: 2px; }
      .urdu-logo { font-family: 'Amiri', serif; font-size: 44px; font-weight: 700; fill: #111111; }
    </style>
    <filter id="cardShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000000" flood-opacity="0.16"/>
    </filter>
    <filter id="ribbonShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="-4" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.18"/>
    </filter>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00d5c8"/>
      <stop offset="50%" stop-color="#049189"/>
      <stop offset="100%" stop-color="#026d67"/>
    </linearGradient>
    <clipPath id="mainPhotoClip">
      <rect x="52" y="80" width="248" height="390" rx="6"/>
    </clipPath>
    <clipPath id="circlePhotoClip">
      <circle cx="176" cy="275" r="140"/>
    </clipPath>
  </defs>

  <!-- Clean Background -->
  <rect width="800" height="800" fill="#f8fafb"/>
  
  <!-- Subtle Architectural Grid Background -->
  <path d="M0,0 L800,0 L800,800 L0,800 Z" fill="#ffffff"/>
  <circle cx="700" cy="150" r="320" fill="#049189" fill-opacity="0.04"/>

  <!-- Top-Left Dark & Teal Geometric Corner Ribbons (Matching Client Brochure) -->
  <polygon points="0,0 75,0 0,130" fill="#111111"/>
  <polygon points="0,130 50,130 0,220" fill="#049189"/>

  <!-- Top Right Ba Zauq Official Logo & Tag -->
  <g transform="translate(620, 52)">
    <!-- Stylized Ba Zauq Brand Representation -->
    <path d="M-60,0 C-40,-25 -10,-35 25,-15 C45,-2 55,20 60,35" stroke="#049189" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <text x="35" y="28" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="900" fill="#049189" text-anchor="end">با</text>
    <text x="75" y="28" font-family="'Plus Jakarta Sans', sans-serif" font-size="34" font-weight="900" fill="#111111" text-anchor="end">ذوق</text>
    <text x="40" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#64748b" text-anchor="middle">انٹیریئرز</text>
    <text x="40" y="60" class="logo-eng" text-anchor="middle">INTERIORS &amp; EXTERIORS</text>
  </g>

  <!-- Left Framed Image Container (Client Style) -->
  <g filter="url(#cardShadow)">
    <rect x="46" y="74" width="260" height="402" rx="10" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    ${imgBase64 ? `<image href="${imgBase64}" x="52" y="80" width="248" height="390" preserveAspectRatio="xMidYMid slice" clip-path="url(#mainPhotoClip)"/>` : `<rect x="52" y="80" width="248" height="390" fill="#049189" rx="6"/>`}
    <rect x="52" y="80" width="248" height="390" fill="none" stroke="#ffffff" stroke-width="4" rx="6"/>
  </g>

  <!-- Main Signature Teal Angled Title Banner (Exact Client Style) -->
  <g filter="url(#ribbonShadow)">
    <polygon points="318,130 800,130 800,420 318,420" fill="url(#tealGrad)"/>
    <!-- Fold Accent -->
    <polygon points="318,130 338,110 318,110" fill="#025752"/>
  </g>

  <!-- Main Headline Inside Teal Banner -->
  <g transform="translate(345, 235)">
    <text x="0" y="0" class="title-text" font-size="${item.title.length > 14 ? '44' : '52'}">${item.title}</text>
    <text x="0" y="60" class="title-text" font-size="${item.title.length > 14 ? '44' : '52'}">SOLUTIONS</text>
  </g>

  <!-- Subtitle Ribbon Below Teal Banner -->
  <g transform="translate(340, 455)">
    <text x="0" y="0" class="sub-title" font-size="24">${item.subtitle}</text>
  </g>

  <!-- Description Narrative Box -->
  <g transform="translate(340, 505)">
    <foreignObject x="0" y="0" width="420" height="150">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; line-height: 1.55; color: #334155;">
        <strong style="color: #049189; font-weight: 800;">Bazauq Interiors</strong> ${item.desc.replace('Bazauq Interiors', '').trim()}
      </div>
    </foreignObject>
  </g>

  <!-- Bottom Details Bar with Contact Numbers & Showroom Address (Exact Client Style) -->
  <rect x="0" y="720" width="800" height="80" fill="#f1f8f7" stroke="#049189" stroke-width="1.5" stroke-opacity="0.2"/>
  <rect x="0" y="796" width="800" height="4" fill="#049189"/>

  <!-- Left: Phone Icons & Numbers -->
  <g transform="translate(24, 755)">
    <circle cx="16" cy="0" r="14" fill="#049189"/>
    <path d="M11,-4 C11,-4 13,-2 14,-2 C15,-2 16,-3 17,-3 C18,-3 19,-2 20,-1 C21,0 21,1 21,2 C21,4 19,6 17,6 C14,6 11,4 9,2 C7,0 6,-3 6,-6 C6,-8 8,-10 10,-10 C11,-10 12,-9 13,-8 C14,-7 13,-6 13,-5 C13,-4 11,-4 11,-4 Z" fill="#ffffff" transform="scale(0.8) translate(3, 4)"/>
    <text x="38" y="5" class="footer-text">0321 5508454  0331-5508454</text>
    <text x="38" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#049189">www.bazauqinteriors.com</text>
  </g>

  <!-- Right: Location Pin & Address -->
  <g transform="translate(370, 755)">
    <circle cx="16" cy="0" r="14" fill="#ef4444"/>
    <path d="M16,-8 C12,-8 9,-5 9,-1 C9,4 16,10 16,10 C16,10 23,4 23,-1 C23,-5 20,-8 16,-8 Z M16,1 C14.9,1 14,0.1 14,-1 C14,-2.1 14.9,-3 16,-3 C17.1,-3 18,-2.1 18,-1 C18,0.1 17.1,1 16,1 Z" fill="#ffffff"/>
    <text x="38" y="-2" class="footer-text">Shop no. 1-2, Ground Floor, Masood Arcade</text>
    <text x="38" y="16" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600" fill="#64748b">Allergy Centre Plaza, IJP Road, Pandora Rawalpindi</text>
  </g>
</svg>`;
}

console.log('Generating branded SVG cards for all remaining services...');
brandedServices.forEach(item => {
  const svgContent = generateSvgCard(item);
  const outPath = path.join(servicesDir, `${item.key}.svg`);
  fs.writeFileSync(outPath, svgContent, 'utf8');
  console.log(`✓ Generated branded card: ${item.key}.svg`);
});
console.log('All branded graphics generated successfully!');
