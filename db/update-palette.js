import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedFile = path.join(__dirname, 'seed.js');

let content = fs.readFileSync(seedFile, 'utf8');

// Replace green / lime accents with Crimson Red, Silver, or White
content = content.replaceAll("'#d4ff00'", "'#ff2a4b'");
content = content.replaceAll('"#d4ff00"', '"#ff2a4b"');
content = content.replaceAll("'#00ff66'", "'#ff2a4b'");
content = content.replaceAll("'#84cc16'", "'#ffffff'");
content = content.replaceAll("'#a3e635'", "'#e2e8f0'");
content = content.replaceAll("'#22c55e'", "'#ff2a4b'");
content = content.replaceAll("'#34d399'", "'#ffffff'");
content = content.replaceAll("'#4ade80'", "'#e2e8f0'");

// Update fonts inside SVG templates
content = content.replaceAll("'Syne', 'Inter', sans-serif", "'Space Grotesk', 'Inter', sans-serif");
content = content.replaceAll("'Syne', 'Space Grotesk', sans-serif", "'Space Grotesk', 'Syncopate', sans-serif");
content = content.replaceAll("'Syne', 'Arial Black', sans-serif", "'Syncopate', 'Space Grotesk', sans-serif");
content = content.replaceAll("'Syne', sans-serif", "'Space Grotesk', sans-serif");
content = content.replaceAll("'Plus Jakarta Sans', sans-serif", "'Inter', sans-serif");

// Update default fallback accent
content = content.replaceAll("accent || '#d4ff00'", "accent || '#ff2a4b'");

// Ensure UW-047 is specifically INTROVERT MODE in rawDesigns
content = content.replace(
  /name:\s*'INTROVERT MODE'[\s\S]*?subtext:\s*'[^']*'/,
  `name: 'INTROVERT MODE',
    category: 'QUOTES',
    style: 'Typographic',
    mood: 'Chill',
    color: 'Crimson',
    tags: ['introvert', 'battery', 'peace', 'quiet', 'statement'],
    description: 'Official uniform of social exhaustion. Low battery icon with "PLEASE DO NOT DISTURB".',
    bg: '#0a0a0d',
    accent: '#ff2a4b',
    subtext: 'DO NOT INTERACT // RECHARGING'`
);

fs.writeFileSync(seedFile, content, 'utf8');
console.log('Successfully updated seed.js with luxury Black, Grey, Red, White palette!');
