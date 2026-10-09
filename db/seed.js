import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { replaceAllData } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ARTWORKS_DIR = path.join(PUBLIC_DIR, 'assets', 'designs');
const MOCKUPS_DIR = path.join(PUBLIC_DIR, 'assets', 'mockups');

// Ensure directories exist
fs.mkdirSync(ARTWORKS_DIR, { recursive: true });
fs.mkdirSync(MOCKUPS_DIR, { recursive: true });

// Initial Categories defined by UNCommon weaR specification
const categories = [
  { id: 'cat_all', name: 'ALL', slug: 'ALL', order: 0, active: true },
  { id: 'cat_minimal', name: 'MINIMAL', slug: 'MINIMAL', order: 1, active: true },
  { id: 'cat_quotes', name: 'QUOTES', slug: 'QUOTES', order: 2, active: true },
  { id: 'cat_funny', name: 'FUNNY', slug: 'FUNNY', order: 3, active: true },
  { id: 'cat_college', name: 'COLLEGE', slug: 'COLLEGE', order: 4, active: true },
  { id: 'cat_genz', name: 'GEN-Z', slug: 'GEN-Z', order: 5, active: true },
  { id: 'cat_graphic', name: 'GRAPHIC', slug: 'GRAPHIC', order: 6, active: true },
  { id: 'cat_street', name: 'STREET', slug: 'STREET', order: 7, active: true },
  { id: 'cat_aesthetic', name: 'AESTHETIC', slug: 'AESTHETIC', order: 8, active: true },
  { id: 'cat_motivation', name: 'MOTIVATION', slug: 'MOTIVATION', order: 9, active: true },
  { id: 'cat_others', name: 'OTHERS', slug: 'OTHERS', order: 10, active: true }
];

// 115 Curated Design Definitions
const rawDesigns = [
  // --- MINIMAL ---
  {
    name: 'LESS IS LOUD',
    category: 'MINIMAL',
    style: 'Minimal',
    mood: 'Confident',
    color: 'Monochrome',
    tags: ['minimal', 'typography', 'clean', 'swiss', 'bold'],
    description: 'Ultra-refined Swiss grid typographic statement. Bold kerning on deep noir canvas.',
    bg: '#0c0d10',
    accent: '#f4f4f5',
    subtext: 'ARCHIVE 01 // NOISE REDUCTION // 100% COTTON'
  },
  {
    name: 'SILENT FREQUENCY',
    category: 'MINIMAL',
    style: 'Minimal',
    mood: 'Chill',
    color: 'Monochrome',
    tags: ['soundwave', 'minimal', 'monochrome', 'abstract'],
    description: 'Subtle soundwave spectrum line art signifying inner calm amidst outer turbulence.',
    bg: '#111215',
    accent: '#e4e4e7',
    subtext: 'Hz 0.04 // BELOW AUDIBLE THRESHOLD'
  },
  {
    name: 'NEGATIVE SPACE',
    category: 'MINIMAL',
    style: 'Minimal',
    mood: 'Aesthetic',
    color: 'Monochrome',
    tags: ['geometry', 'space', 'modern', 'architectural'],
    description: 'Clean architectural geometric lines framing deliberate emptiness.',
    bg: '#0a0a0c',
    accent: '#d4d4d8',
    subtext: 'FORM FOLLOWS VOID // STUDIO UNCOMMON'
  },
  {
    name: 'PARALLEL REALITY',
    category: 'MINIMAL',
    style: 'Minimal',
    mood: 'Mysterious',
    color: 'Monochrome',
    tags: ['lines', 'modernist', 'optical', 'symmetry'],
    description: 'Precision dual-line optical illusion crafted for subtle streetwear intrigue.',
    bg: '#0d0e12',
    accent: '#fafafa',
    subtext: 'TIMELINE B // DEVIATION INDEX 0.08'
  },
  {
    name: 'ONE PERCENT BETTER',
    category: 'MINIMAL',
    style: 'Minimal',
    mood: 'Focused',
    color: 'Neon',
    tags: ['atomic', 'habits', 'progress', 'typography'],
    description: 'Small daily compounding gains visualized in crisp typography and precision bar graph.',
    bg: '#090a0f',
    accent: '#ff2a4b',
    subtext: 'COMPOUND INTEREST OF CHARACTER'
  },
  {
    name: 'COORDINATES 00.00',
    category: 'MINIMAL',
    style: 'Minimal',
    mood: 'Chill',
    color: 'Monochrome',
    tags: ['gps', 'travel', 'wanderlust', 'subtle'],
    description: 'Geographic point of origin. Clean industrial typography inspired by aviation markers.',
    bg: '#101114',
    accent: '#e2e8f0',
    subtext: 'POINT ZERO // LAT 00°00′00″ N'
  },
  {
    name: 'REDUCTIONIST ARCHIVE',
    category: 'MINIMAL',
    style: 'Minimal',
    mood: 'Confident',
    color: 'Monochrome',
    tags: ['curated', 'capsule', 'fashion', 'edition'],
    description: 'Edition label style print focusing strictly on essential elements.',
    bg: '#08080a',
    accent: '#f8fafc',
    subtext: 'LIMITED RUN // VERIFIED AUTHENTIC'
  },
  {
    name: 'MONO CIRCLE',
    category: 'MINIMAL',
    style: 'Minimal',
    mood: 'Zen',
    color: 'Monochrome',
    tags: ['enso', 'circle', 'zen', 'balance'],
    description: 'Contemporary interpretation of the Japanese Ensō circular ink brush stroke.',
    bg: '#0d0d0f',
    accent: '#f1f5f9',
    subtext: 'BALANCE IN IMPERFECTION'
  },
  {
    name: 'BINARY CODE',
    category: 'MINIMAL',
    style: 'Minimal',
    mood: 'Technical',
    color: 'Neon',
    tags: ['code', 'developer', 'binary', 'digital'],
    description: '01010101 01010111 decoded into UNCOMMON in subtle vertical matrix stripes.',
    bg: '#0a0d0a',
    accent: '#ff2a4b',
    subtext: 'DECODE HUMANITY // SYS_EXECUTE'
  },
  {
    name: 'THE VOID SAYS HELLO',
    category: 'MINIMAL',
    style: 'Minimal',
    mood: 'Sarcastic',
    color: 'Monochrome',
    tags: ['existential', 'dark-humor', 'clean'],
    description: 'Tiny understated front chest print with monumental existential calm.',
    bg: '#0f1013',
    accent: '#e5e7eb',
    subtext: 'STARING CONTEST SINCE 1999'
  },
  {
    name: 'ECHO CHAMBER OFF',
    category: 'MINIMAL',
    style: 'Minimal',
    mood: 'Rebellious',
    color: 'Pastel',
    tags: ['thought', 'independent', 'minimal'],
    description: 'Toggle button design with the switch permanently set to OFF.',
    bg: '#121216',
    accent: '#cbd5e1',
    subtext: 'CRITICAL THINKING ENABLED'
  },

  // --- QUOTES ---
  {
    name: 'NOT FOR EVERYONE',
    category: 'QUOTES',
    style: 'Bold',
    mood: 'Confident',
    color: 'Neon',
    tags: ['statement', 'exclusive', 'edgy', 'street'],
    description: 'High-octane proclamation for those unapologetically themselves.',
    bg: '#0a0a0c',
    accent: '#ff3366',
    subtext: 'MADE SPECIFICALLY FOR THE CHOSEN FEW'
  },
  {
    name: 'INTROVERT MODE',
    category: 'QUOTES',
    style: 'Typographic',
    mood: 'Chill',
    color: 'Crimson',
    tags: ['introvert', 'battery', 'peace', 'quiet', 'statement'],
    description: 'Official uniform of social exhaustion. Low battery icon with "PLEASE DO NOT DISTURB".',
    bg: '#0a0a0d',
    accent: '#ff2a4b',
    subtext: 'DO NOT INTERACT // RECHARGING'
  },
  {
    name: 'OFFLINE IS THE NEW LUXURY',
    category: 'QUOTES',
    style: 'Typographic',
    mood: 'Aesthetic',
    color: 'Earth',
    tags: ['digital-detox', 'peace', 'modern-life'],
    description: 'Serif editorial typography celebrating the ultimate flex: being unreachable.',
    bg: '#13110e',
    accent: '#fef08a',
    subtext: 'DISCONNECTED FROM THE MATRIX'
  },
  {
    name: 'DO NOT PERCEIVE ME',
    category: 'QUOTES',
    style: 'Typographic',
    mood: 'Sarcastic',
    color: 'Monochrome',
    tags: ['ghost-mode', 'humor', 'relatable', 'introvert'],
    description: 'Blur effect typographic design that seems to fade as people look directly at it.',
    bg: '#0e0e11',
    accent: '#94a3b8',
    subtext: 'EXISTING IN INCORPOREAL FORM TODAY'
  },
  {
    name: 'MAIN CHARACTER ENERGY',
    category: 'QUOTES',
    style: 'Bold',
    mood: 'Energetic',
    color: 'Neon',
    tags: ['confidence', 'cinematic', 'pop', 'bold'],
    description: 'Cinematic marquee title design declaring the protagonist has arrived.',
    bg: '#100b14',
    accent: '#ec4899',
    subtext: 'SCRIPT REWRITTEN // SCENE 01'
  },
  {
    name: 'CHAOS IS COMFORTABLE',
    category: 'QUOTES',
    style: 'Street',
    mood: 'Chaotic',
    color: 'Neon',
    tags: ['grunge', 'anarchy', 'rebel', 'street'],
    description: 'Distorted typography layered over subtle wireframe mesh and safety tape vibes.',
    bg: '#120f0f',
    accent: '#ff4d00',
    subtext: 'ORDER WAS BOREDOM ANYWAY'
  },
  {
    name: 'LET IT FLOW',
    category: 'QUOTES',
    style: 'Aesthetic',
    mood: 'Zen',
    color: 'Pastel',
    tags: ['water', 'flow-state', 'mindfulness', 'wave'],
    description: 'Flowing wavy typography inspired by ocean tides and surrender.',
    bg: '#0b1317',
    accent: '#67e8f9',
    subtext: 'GO WITH THE CURRENT // RESIST NOTHING'
  },
  {
    name: 'TALK LESS SMILE MORE',
    category: 'QUOTES',
    style: 'Typographic',
    mood: 'Mysterious',
    color: 'Monochrome',
    tags: ['classic', 'vintage', 'caution', 'quote'],
    description: 'Vintage print layout with distressed typewriter letterforms.',
    bg: '#0d0d0f',
    accent: '#e2e8f0',
    subtext: 'DONT LET THEM KNOW WHAT YOURE AGAINST'
  },
  {
    name: 'I CAME I SAW I WENT HOME',
    category: 'QUOTES',
    style: 'Typographic',
    mood: 'Sarcastic',
    color: 'Monochrome',
    tags: ['caesar', 'latin', 'party', 'introvert'],
    description: 'Veni Vidi Vici updated for modern social gatherings.',
    bg: '#111116',
    accent: '#cbd5e1',
    subtext: 'RECORD BREAKING ATTENDANCE TIME: 14 MINS'
  },
  {
    name: 'TOO BUSY MAKING HISTORY',
    category: 'QUOTES',
    style: 'Bold',
    mood: 'Confident',
    color: 'Neon',
    tags: ['ambition', 'hustle', 'boss', 'power'],
    description: 'Heavy brutalist headline with newspaper clipping texture backdrop.',
    bg: '#0c0c10',
    accent: '#eab308',
    subtext: 'VOLUME 01 // FRONT PAGE NEWS'
  },
  {
    name: 'EVERYTHING IS TEMPORARY',
    category: 'QUOTES',
    style: 'Minimal',
    mood: 'Philosophical',
    color: 'Monochrome',
    tags: ['impermanence', 'truth', 'stoic'],
    description: 'Subtle digital glitched text showing letters dissolving into particles.',
    bg: '#090a0d',
    accent: '#f3f4f6',
    subtext: 'EVEN THIS T-SHIRT // ENJOY THE MOMENT'
  },

  // --- FUNNY ---
  {
    name: 'OVERTHINKING AGAIN',
    category: 'FUNNY',
    style: 'Typographic',
    mood: 'Relatable',
    color: 'Pastel',
    tags: ['anxiety', 'humor', 'brain', 'relatable'],
    description: 'Loop diagram showing "Idea -> Question -> Worry -> Spiral -> Repeat".',
    bg: '#0d0f14',
    accent: '#a78bfa',
    subtext: 'PROCESSING 4,000 SCENARIOS THAT WONT HAPPEN'
  },
  {
    name: '404 MOTIVATION NOT FOUND',
    category: 'FUNNY',
    style: 'Cyber',
    mood: 'Sarcastic',
    color: 'Neon',
    tags: ['tech', 'error-code', 'developer', 'lazy'],
    description: 'Classic browser crash prompt with "Try again on Monday" buttons.',
    bg: '#0a0d12',
    accent: '#38bdf8',
    subtext: 'SERVER RESPONSE: REQUEST TIMEOUT'
  },
  {
    name: 'EMOTIONAL DAMAGE',
    category: 'FUNNY',
    style: 'Graphic',
    mood: 'Chaotic',
    color: 'Neon',
    tags: ['meme', 'gen-z', 'gaming', 'humor'],
    description: 'Pixel art health bar dropping to 0% with critical hit markers.',
    bg: '#140c0f',
    accent: '#f43f5e',
    subtext: 'CRITICAL HIT // HP -9999'
  },
  {
    name: 'CHAOS COORDINATOR',
    category: 'FUNNY',
    style: 'Bold',
    mood: 'Chaotic',
    color: 'Neon',
    tags: ['job-title', 'funny', 'work', 'busy'],
    description: 'Official corporate badge parody declaring mastership of sheer pandemonium.',
    bg: '#0d0d12',
    accent: '#f97316',
    subtext: 'TITLE: SENIOR LEAD PANIC MANAGER'
  },
  {
    name: 'CTRL + Z MY LIFE',
    category: 'FUNNY',
    style: 'Cyber',
    mood: 'Relatable',
    color: 'Monochrome',
    tags: ['keyboard', 'undo', 'shortcut', 'regret'],
    description: 'Mechanical keyboard keycap artwork featuring the ultimate life shortcut.',
    bg: '#101115',
    accent: '#e2e8f0',
    subtext: 'STEP BACKWARD // RESTORE PREVIOUS STATE'
  },
  {
    name: 'PROCRASTINATOR OF THE YEAR',
    category: 'FUNNY',
    style: 'Typographic',
    mood: 'Sarcastic',
    color: 'Neon',
    tags: ['award', 'humor', 'lazy', 'champion'],
    description: 'Gold ribbon award with the inscription "Trophy will be printed later".',
    bg: '#0f120e',
    accent: '#ffffff',
    subtext: 'COMMITTED TO DOING IT TOMORROW'
  },
  {
    name: 'I AM CURRENTLY BUSY',
    category: 'FUNNY',
    style: 'Minimal',
    mood: 'Sarcastic',
    color: 'Monochrome',
    tags: ['avoidance', 'humor', 'busy', 'chill'],
    description: 'Loading spinner stuck forever at 99%.',
    bg: '#0b0c10',
    accent: '#9ca3af',
    subtext: 'ESTIMATED TIME REMAINING: 47 YEARS'
  },
  {
    name: 'COFFEE FIRST TALK LATER',
    category: 'FUNNY',
    style: 'Graphic',
    mood: 'Relatable',
    color: 'Earth',
    tags: ['coffee', 'morning', 'caffeine', 'mug'],
    description: 'Cup illustration radiating radioactive vapor warning lines.',
    bg: '#14110e',
    accent: '#fdba74',
    subtext: 'HUMAN SIMULATION BOOTING...'
  },
  {
    name: 'BRAIN CELLS ON VACATION',
    category: 'FUNNY',
    style: 'Graphic',
    mood: 'Chill',
    color: 'Pastel',
    tags: ['vacation', 'beach', 'tired', 'doodle'],
    description: 'Single cartoon neuron sunbathing under a tiny coconut tree.',
    bg: '#0d131a',
    accent: '#38bdf8',
    subtext: 'OUT OF OFFICE UNTIL FURTHER NOTICE'
  },
  {
    name: 'MY SOCIAL BATTERY IS 1%',
    category: 'FUNNY',
    style: 'Cyber',
    mood: 'Relatable',
    color: 'Neon',
    tags: ['battery', 'red', 'introvert', 'funny'],
    description: 'Flashing red battery meter with Low Power Mode engaged.',
    bg: '#130c0c',
    accent: '#ef4444',
    subtext: 'PLEASE PLUG IN TO SILENCE'
  },
  {
    name: 'OVERQUALIFIED FOR THIS DRAMA',
    category: 'FUNNY',
    style: 'Typographic',
    mood: 'Confident',
    color: 'Neon',
    tags: ['drama-free', 'attitude', 'sassy'],
    description: 'Official stamp stating "DRAMA DECLINED DUE TO LACK OF INTEREST".',
    bg: '#120d18',
    accent: '#d946ef',
    subtext: 'RESUME DOES NOT LIST SOAP OPERAS'
  },

  // --- COLLEGE ---
  {
    name: 'ACADEMICALLY TIRED',
    category: 'COLLEGE',
    style: 'Vintage',
    mood: 'Relatable',
    color: 'Pastel',
    tags: ['campus', 'exam', 'sleepy', 'varsity'],
    description: 'Ivy League curved varsity crest honoring chronic syllabus exhaustion.',
    bg: '#0f1118',
    accent: '#93c5fd',
    subtext: 'UNIVERSITY OF LATE NIGHT CRAMMING'
  },
  {
    name: 'CAFFEINE MAJOR',
    category: 'COLLEGE',
    style: 'Vintage',
    mood: 'Energetic',
    color: 'Earth',
    tags: ['espresso', 'study', 'degree', 'coffee'],
    description: 'Diploma seal with graduation cap resting on a giant triple espresso cup.',
    bg: '#120f0b',
    accent: '#f59e0b',
    subtext: 'BACHELOR OF COLD BREW ARCHITECTURE'
  },
  {
    name: 'ALL NIGHTER ATHLETICS',
    category: 'COLLEGE',
    style: 'Street',
    mood: 'Chaotic',
    color: 'Neon',
    tags: ['sports', 'varsity', 'study', 'night'],
    description: 'Collegiate track & field mascot holding a 3AM energy drink can.',
    bg: '#0c0f14',
    accent: '#06b6d4',
    subtext: 'DIVISION 1 SLEEP DEPRIVATION SQUAD'
  },
  {
    name: 'DEADLINE SURVIVOR',
    category: 'COLLEGE',
    style: 'Bold',
    mood: 'Confident',
    color: 'Neon',
    tags: ['assignment', '11:59pm', 'college', 'rush'],
    description: 'Digital clock frozen at 11:59 PM with a submitted green checkmark.',
    bg: '#0d130e',
    accent: '#ff2a4b',
    subtext: 'SUBMITTED AT 23:59:58 // NO SWEAT'
  },
  {
    name: 'CLASS OF NOBODY CARES',
    category: 'COLLEGE',
    style: 'Vintage',
    mood: 'Sarcastic',
    color: 'Monochrome',
    tags: ['graduate', 'varsity', 'edgy', 'campus'],
    description: 'Classic collegiate arch lettering with distressed gothic numbers.',
    bg: '#101014',
    accent: '#e2e8f0',
    subtext: 'ALUMNI ASSOCIATION FOR THE REAL WORLD'
  },
  {
    name: 'PROFESSOR OF PROCRASTINATION',
    category: 'COLLEGE',
    style: 'Typographic',
    mood: 'Relatable',
    color: 'Monochrome',
    tags: ['phd', 'humor', 'lecture', 'smart'],
    description: 'Tenure track badge celebrating world-class syllabus avoidance.',
    bg: '#0f1013',
    accent: '#cbd5e1',
    subtext: 'CHAIR OF "ILL DO IT AFTER LUNCH"'
  },
  {
    name: 'LIBRARY SLEEPER CLUB',
    category: 'COLLEGE',
    style: 'Minimal',
    mood: 'Chill',
    color: 'Pastel',
    tags: ['library', 'books', 'nap', 'student'],
    description: 'Stack of heavy textbooks serving as a comfy contoured pillow.',
    bg: '#0c0e14',
    accent: '#bfdbfe',
    subtext: 'FLOOR 3 CORNER BOOTH VETERANS'
  },
  {
    name: 'ATTENDANCE 75% EXACTLY',
    category: 'COLLEGE',
    style: 'Cyber',
    mood: 'Sarcastic',
    color: 'Neon',
    tags: ['marks', 'bunk', 'math', 'college'],
    description: 'Precision percentage badge: Calculated down to the exact second to sit for exams.',
    bg: '#140e0c',
    accent: '#f97316',
    subtext: 'PERFECT CALCULATED EFFICIENCY'
  },
  {
    name: 'MIDTERM MENTAL BREAKDOWN',
    category: 'COLLEGE',
    style: 'Street',
    mood: 'Chaotic',
    color: 'Neon',
    tags: ['exam', 'panic', 'stress', 'meme'],
    description: 'Scribbled graph showing brain capacity plummeting during formula memorization.',
    bg: '#130d10',
    accent: '#f43f5e',
    subtext: 'BRAIN WAREHOUSE RUNNING ON FUMES'
  },
  {
    name: 'CAMPUS LEGEND',
    category: 'COLLEGE',
    style: 'Bold',
    mood: 'Confident',
    color: 'Neon',
    tags: ['campus', 'varsity', 'swagger', 'cool'],
    description: 'Bold arch college athletic font with tiger paw and lightning bolts.',
    bg: '#0a0a0f',
    accent: '#eab308',
    subtext: 'KNOWN BY EVERYONE // CAUGHT BY NONE'
  },

  // --- GEN-Z ---
  {
    name: 'LIVING RENT FREE',
    category: 'GEN-Z',
    style: 'Typographic',
    mood: 'Sarcastic',
    color: 'Pastel',
    tags: ['slang', 'mind', 'attitude', 'viral'],
    description: 'Cartoon brain holding a lease agreement with $0.00 monthly rent.',
    bg: '#110d18',
    accent: '#c084fc',
    subtext: 'INSIDE YOUR HEAD ALL DAY LONG'
  },
  {
    name: 'NO CAP ONLY FACTS',
    category: 'GEN-Z',
    style: 'Bold',
    mood: 'Confident',
    color: 'Neon',
    tags: ['slang', 'truth', 'street', 'gen-z'],
    description: 'Baseball cap with a red prohibition slash over high-voltage typography.',
    bg: '#0d0d12',
    accent: '#38bdf8',
    subtext: 'CERTIFIED AUTHENTIC // ZERO FICTION'
  },
  {
    name: 'DELULU IS THE SOLULU',
    category: 'GEN-Z',
    style: 'Aesthetic',
    mood: 'Chaotic',
    color: 'Pastel',
    tags: ['manifesting', 'dreamer', 'viral', 'cute'],
    description: 'Airbrush cloud graphics with glitter star accents and manifestation symbols.',
    bg: '#140c18',
    accent: '#f472b6',
    subtext: 'MANIFESTING AT HIGH ALTITUDES'
  },
  {
    name: 'IT BE LIKE THAT SOMETIMES',
    category: 'GEN-Z',
    style: 'Minimal',
    mood: 'Chill',
    color: 'Monochrome',
    tags: ['acceptance', 'meme', 'vibe', 'peace'],
    description: 'Shrugging stick figure in ultra-minimal line weight.',
    bg: '#0f0f13',
    accent: '#d1d5db',
    subtext: 'RADICAL ACCEPTANCE SIMULATOR'
  },
  {
    name: 'SIDE EYE BOMBSTIC',
    category: 'GEN-Z',
    style: 'Graphic',
    mood: 'Sarcastic',
    color: 'Neon',
    tags: ['side-eye', 'tiktok', 'viral', 'eyes'],
    description: 'Stylized anime eyes glancing sideways with dramatic comic focus lines.',
    bg: '#120e14',
    accent: '#a855f7',
    subtext: 'CRIMINAL OFFENSIVE SIDE EYE'
  },
  {
    name: 'MAIN CHARACTER SYNDROME',
    category: 'GEN-Z',
    style: 'Cyber',
    mood: 'Confident',
    color: 'Neon',
    tags: ['hollywood', 'ego', 'spotlight', 'cinema'],
    description: 'Spotlight cone graphic illuminating an isolated figure looking up at the sky.',
    bg: '#0a0d14',
    accent: '#38bdf8',
    subtext: 'CAMERAS ALWAYS ROLLING'
  },
  {
    name: 'GHOSTED BUT THRIVING',
    category: 'GEN-Z',
    style: 'Graphic',
    mood: 'Chill',
    color: 'Pastel',
    tags: ['ghost', 'cute', 'dating', 'independent'],
    description: 'Cute bedsheet ghost drinking boba tea with sunglasses on.',
    bg: '#0b1216',
    accent: '#5eead4',
    subtext: 'UNBOTHERED BY CELLULAR RADIATION'
  },
  {
    name: 'I LIED I AM NOT OKAY',
    category: 'GEN-Z',
    style: 'Typographic',
    mood: 'Relatable',
    color: 'Monochrome',
    tags: ['relatable', 'irony', 'dark-humor'],
    description: 'Crossed fingers silhouette behind a smiling emoticon mask.',
    bg: '#0f0e13',
    accent: '#e2e8f0',
    subtext: 'BUT AT LEAST THE OUTFIT IS FIRE'
  },
  {
    name: 'CORE MEMORY UNLOCKED',
    category: 'GEN-Z',
    style: 'Cyber',
    mood: 'Aesthetic',
    color: 'Neon',
    tags: ['gaming', 'retro', 'pixel', 'memory'],
    description: 'Holographic glowing orb resting on futuristic chrome pedestals.',
    bg: '#0d101a',
    accent: '#60a5fa',
    subtext: 'STORED IN PERMANENT ROM ARCHIVE'
  },
  {
    name: 'CHILL GUY SYNDROME',
    category: 'GEN-Z',
    style: 'Minimal',
    mood: 'Chill',
    color: 'Earth',
    tags: ['hands-in-pocket', 'vibe', 'legend', 'meme'],
    description: 'Low-effort silhouette with hands casually tucked into oversized cargo pants.',
    bg: '#12110e',
    accent: '#e2e8f0',
    subtext: 'JUST A LOWKEY DUDE WHO DOESNT CARE'
  },

  // --- GRAPHIC ---
  {
    name: 'NEO TOKYO 2099',
    category: 'GRAPHIC',
    style: 'Cyber',
    mood: 'Mysterious',
    color: 'Neon',
    tags: ['cyberpunk', 'kanji', 'futuristic', 'blade-runner'],
    description: 'Heavy isometric sci-fi metropolis silhouette framed by Japanese typography.',
    bg: '#090a12',
    accent: '#06b6d4',
    subtext: 'SHINJUKU SECTOR 07 // ACID RAIN ADVISORY'
  },
  {
    name: 'LIQUID CHROME HEART',
    category: 'GRAPHIC',
    style: 'Aesthetic',
    mood: 'Aesthetic',
    color: 'Neon',
    tags: ['y2k', 'chrome', 'metallic', 'grunge'],
    description: 'Molten liquid metal chrome heart adorned with thorny cybernetic brambles.',
    bg: '#0c0a11',
    accent: '#e879f9',
    subtext: 'HEAVY METAL BIOLOGY // 3D RENDER'
  },
  {
    name: 'CYBER SKULL OS',
    category: 'GRAPHIC',
    style: 'Cyber',
    mood: 'Edgy',
    color: 'Neon',
    tags: ['skull', 'matrix', 'wireframe', 'dark'],
    description: 'Wireframe low-poly skull overlaid with terminal command prompts.',
    bg: '#080c09',
    accent: '#ff2a4b',
    subtext: 'KERNEL PANIC: IMMORTALITY.EXE FAILED'
  },
  {
    name: 'ASTRONAUT IN THE OCEAN',
    category: 'GRAPHIC',
    style: 'Graphic',
    mood: 'Mysterious',
    color: 'Pastel',
    tags: ['space', 'deep-sea', 'jellyfish', 'cosmic'],
    description: 'Apollo spacesuit diver surrounded by luminescent deep-sea jellyfish.',
    bg: '#0a0f18',
    accent: '#38bdf8',
    subtext: 'OUT OF ATMOSPHERE // ZERO GRAVITY'
  },
  {
    name: 'METRIC DRAGON',
    category: 'GRAPHIC',
    style: 'Street',
    mood: 'Confident',
    color: 'Neon',
    tags: ['oriental', 'dragon', 'tattoo', 'street'],
    description: 'Serpentine Eastern dragon coiled around modern industrial barcoding.',
    bg: '#140a0c',
    accent: '#ef4444',
    subtext: 'MYTHOLOGY MEETS INDUSTRIAL CODE'
  },
  {
    name: 'ANATOMIC FLOWER',
    category: 'GRAPHIC',
    style: 'Vintage',
    mood: 'Aesthetic',
    color: 'Earth',
    tags: ['botanical', 'illustration', 'anatomy', 'rose'],
    description: 'Etched vintage botanical illustration merging human ribcage with wild thorns.',
    bg: '#11100e',
    accent: '#fca5a5',
    subtext: 'PLANT LIFE // CELLULAR SYMBIOSIS'
  },
  {
    name: 'SOUNDWAVE ECLIPSE',
    category: 'GRAPHIC',
    style: 'Minimal',
    mood: 'Mysterious',
    color: 'Monochrome',
    tags: ['eclipse', 'moon', 'waveform', 'space'],
    description: 'Total solar eclipse corona built entirely out of oscillating frequency lines.',
    bg: '#0a0a0d',
    accent: '#f8fafc',
    subtext: 'SOLAR RADIATION FREQUENCY SPECTRUM'
  },
  {
    name: 'GLITCH STATUE',
    category: 'GRAPHIC',
    style: 'Aesthetic',
    mood: 'Aesthetic',
    color: 'Neon',
    tags: ['vaporwave', 'statue', 'david', 'pixel'],
    description: 'Michelangelo marble bust disintegrating into RGB channel shift artifacts.',
    bg: '#0f0a14',
    accent: '#c084fc',
    subtext: 'CLASSICAL ART IN DATASTREAM'
  },
  {
    name: 'BLACK HOLE ACCRETION',
    category: 'GRAPHIC',
    style: 'Graphic',
    mood: 'Mysterious',
    color: 'Neon',
    tags: ['astronomy', 'singularity', 'gravity', 'dark'],
    description: 'Photonic ring warped by gravitational lensing around an event horizon.',
    bg: '#08080a',
    accent: '#f59e0b',
    subtext: 'LIGHT CANNOT ESCAPE // EVENT HORIZON'
  },
  {
    name: 'BUTTERFLY EFFECT X',
    category: 'GRAPHIC',
    style: 'Graphic',
    mood: 'Aesthetic',
    color: 'Neon',
    tags: ['butterfly', 'chaos-theory', 'radiance'],
    description: 'Iridescent moth wings constructed out of schematic circuit pathways.',
    bg: '#0c0d16',
    accent: '#818cf8',
    subtext: 'ONE FLAP CAUSES A TYPHOON'
  },
  {
    name: 'GEOMETRIC FOX',
    category: 'GRAPHIC',
    style: 'Graphic',
    mood: 'Energetic',
    color: 'Neon',
    tags: ['origami', 'polygon', 'fox', 'wildlife'],
    description: 'Low-poly origami fox head with sharp triangular light facets.',
    bg: '#140e0a',
    accent: '#fb923c',
    subtext: 'FERAL GEOMETRY // URBAN HUNTER'
  },

  // --- STREET ---
  {
    name: 'HEAVY MACHINERY CLUB',
    category: 'STREET',
    style: 'Street',
    mood: 'Industrial',
    color: 'Neon',
    tags: ['hazard', 'industrial', 'safety-yellow', 'bold'],
    description: 'Warning chevron tape accents with heavy bold industrial type.',
    bg: '#12110a',
    accent: '#eab308',
    subtext: 'CAUTION // HIGH PRESSURE OPERATIONS'
  },
  {
    name: 'CONCRETE JUNGLE DEPT',
    category: 'STREET',
    style: 'Street',
    mood: 'Confident',
    color: 'Monochrome',
    tags: ['city', 'brutalist', 'architecture', 'raw'],
    description: 'Brutalist architecture typography with exposed grid coordinates.',
    bg: '#0e0f12',
    accent: '#e2e8f0',
    subtext: 'METROPOLITAN SURVIVAL GEAR'
  },
  {
    name: 'BARCODE WORLD ORDER',
    category: 'STREET',
    style: 'Street',
    mood: 'Rebellious',
    color: 'Monochrome',
    tags: ['barcode', 'rebel', 'system', 'subversive'],
    description: 'Massive vertical barcode running down the spine with serial numbers.',
    bg: '#0a0a0c',
    accent: '#f43f5e',
    subtext: 'SERIAL 8940-209-X // UNCOMMODIFIED'
  },
  {
    name: 'SPRAYCAN ANARCHY',
    category: 'STREET',
    style: 'Street',
    mood: 'Chaotic',
    color: 'Neon',
    tags: ['graffiti', 'stencil', 'drip', 'urban'],
    description: 'Rough spray paint drip stencil mark with textured overspray splatter.',
    bg: '#120c10',
    accent: '#f43f5e',
    subtext: 'FRESH COAT // KEEP OFF THE WALLS'
  },
  {
    name: 'TOKYO STREET DRIFT',
    category: 'STREET',
    style: 'Street',
    mood: 'Energetic',
    color: 'Neon',
    tags: ['jdm', 'racing', 'kanji', 'tire-marks'],
    description: 'Twin tire tread skid marks cutting across neon kanji track directions.',
    bg: '#090d14',
    accent: '#06b6d4',
    subtext: 'MIDNIGHT RACING ALLIANCE // TOKYO'
  },
  {
    name: 'ANTI SOCIAL RUNNERS CLUB',
    category: 'STREET',
    style: 'Street',
    mood: 'Sarcastic',
    color: 'Pastel',
    tags: ['club', 'running', 'introvert', 'street'],
    description: 'Vintage athletic club roundel emblem: "Running Away From Conversations".',
    bg: '#0f1117',
    accent: '#93c5fd',
    subtext: 'EST. 2024 // PACE: FAST ENOUGH TO ESCAPE'
  },
  {
    name: 'CARGO CULTURE',
    category: 'STREET',
    style: 'Street',
    mood: 'Industrial',
    color: 'Earth',
    tags: ['techwear', 'straps', 'military', 'utility'],
    description: 'Technical military spec label with fabric weight and buckle icons.',
    bg: '#12120e',
    accent: '#e2e8f0',
    subtext: 'MIL-SPEC UTILITY // SPEC 4022'
  },
  {
    name: 'MIDNIGHT COURIER',
    category: 'STREET',
    style: 'Street',
    mood: 'Mysterious',
    color: 'Neon',
    tags: ['express', 'cyber', 'bike-messenger', 'speed'],
    description: 'Speed-line wing crest with fast parcel delivery tracking barcode.',
    bg: '#0a0b12',
    accent: '#a855f7',
    subtext: 'DELIVERED BEFORE SUNRISE'
  },
  {
    name: 'EXPLICIT CONTENT LABEL',
    category: 'STREET',
    style: 'Street',
    mood: 'Edgy',
    color: 'Monochrome',
    tags: ['parental-advisory', 'vinyl', 'hip-hop', 'classic'],
    description: 'Oversized Parental Advisory box customized with UNCommon weaR lyrics.',
    bg: '#0d0d0f',
    accent: '#ffffff',
    subtext: 'EXPLICIT ATTITUDE // UNFILTERED'
  },
  {
    name: 'DISTRICT 09 SECURE',
    category: 'STREET',
    style: 'Street',
    mood: 'Rebellious',
    color: 'Neon',
    tags: ['zone', 'cyber', 'urban', 'caution'],
    description: 'Restricted access zone sign crossed out with rebellious paint markers.',
    bg: '#140c0a',
    accent: '#ff5722',
    subtext: 'AUTHORITY RESTRICTED // ENTER AT WILL'
  },
  {
    name: 'OVERSIZED MINDSET',
    category: 'STREET',
    style: 'Street',
    mood: 'Confident',
    color: 'Monochrome',
    tags: ['oversized', 'box-fit', 'fashion', 'street'],
    description: 'Heavy block letters spaced widely across chest in heavyweight typography.',
    bg: '#0b0c10',
    accent: '#f1f5f9',
    subtext: 'FIT: OVERSIZED // AMBITION: UNBOUNDED'
  },

  // --- AESTHETIC ---
  {
    name: 'VAPOR HORIZON',
    category: 'AESTHETIC',
    style: 'Aesthetic',
    mood: 'Aesthetic',
    color: 'Pastel',
    tags: ['sunset', 'synthwave', 'wireframe-grid', 'retro'],
    description: 'Purple 80s wireframe perspective grid disappearing into a neon neon sun.',
    bg: '#12091c',
    accent: '#f472b6',
    subtext: 'OUTRUN THE PAST // SYNTH 1984'
  },
  {
    name: 'HEAVEN CAN WAIT',
    category: 'AESTHETIC',
    style: 'Aesthetic',
    mood: 'Aesthetic',
    color: 'Pastel',
    tags: ['cherub', 'angel', 'clouds', 'dreamy'],
    description: 'Renaissance cherub wearing modern dark shades surrounded by fluffy clouds.',
    bg: '#0f1118',
    accent: '#c4b5fd',
    subtext: 'I HAVE THINGS TO WEAR DOWN HERE'
  },
  {
    name: 'CYBER Y2K BUTTERFLY',
    category: 'AESTHETIC',
    style: 'Aesthetic',
    mood: 'Aesthetic',
    color: 'Neon',
    tags: ['y2k', 'butterfly', 'cyber', 'stars'],
    description: 'Tribal metallic barbed butterfly with four-point sparkling stars.',
    bg: '#0d0a14',
    accent: '#e879f9',
    subtext: 'MILLENNIUM BUG SURVIVOR'
  },
  {
    name: 'LOST IN TRANSLATION',
    category: 'AESTHETIC',
    style: 'Aesthetic',
    mood: 'Mysterious',
    color: 'Pastel',
    tags: ['tokyo', 'neon', 'cinematic', 'night'],
    description: 'Moody film still aesthetic with soft bokeh circles and Japanese subtitles.',
    bg: '#0a0d16',
    accent: '#38bdf8',
    subtext: 'BETWEEN WHAT IS SAID AND WHAT IS MEANT'
  },
  {
    name: 'GOLDEN HOUR CASSETTE',
    category: 'AESTHETIC',
    style: 'Vintage',
    mood: 'Nostalgic',
    color: 'Earth',
    tags: ['lo-fi', 'cassette', 'tape', 'music', 'warm'],
    description: 'Transparent retro cassette tape with ribbon spilling into musical notes.',
    bg: '#14100c',
    accent: '#fbbf24',
    subtext: 'SIDE A // LO-FI BEATS TO RELAX TO'
  },
  {
    name: 'TRANQUIL BONSAI',
    category: 'AESTHETIC',
    style: 'Minimal',
    mood: 'Zen',
    color: 'Pastel',
    tags: ['bonsai', 'zen', 'tree', 'japan', 'calm'],
    description: 'Gnarled miniature bonsai tree silhouette perched on a floating island stone.',
    bg: '#0c1110',
    accent: '#6ee7b7',
    subtext: 'PATIENCE MEASURED IN DECADES'
  },
  {
    name: 'AURORA BOREALIS SPECTRUM',
    category: 'AESTHETIC',
    style: 'Aesthetic',
    mood: 'Aesthetic',
    color: 'Neon',
    tags: ['aurora', 'northern-lights', 'green', 'sky'],
    description: 'Luminous emerald curtains of atmospheric solar wind dancing across pines.',
    bg: '#081210',
    accent: '#ffffff',
    subtext: 'ARCTIC ATMOSPHERE // 66° NORTH'
  },
  {
    name: 'POETIC SADNESS',
    category: 'AESTHETIC',
    style: 'Typographic',
    mood: 'Mysterious',
    color: 'Monochrome',
    tags: ['melancholy', 'poetry', 'rain', 'deep'],
    description: 'Fine line rain droplets running down frosted glass with blurred letterforms.',
    bg: '#0e1014',
    accent: '#94a3b8',
    subtext: 'ROMANTICIZING THE OVERCAST DAYS'
  },
  {
    name: 'NEBULA FLOWERS',
    category: 'AESTHETIC',
    style: 'Graphic',
    mood: 'Aesthetic',
    color: 'Pastel',
    tags: ['cosmos', 'galaxy', 'rose', 'stars'],
    description: 'Intergalactic deep space cosmic dust clouds shaped into blossoming roses.',
    bg: '#100a18',
    accent: '#f43f5e',
    subtext: 'ORGANIC MATTER OF THE UNIVERSE'
  },
  {
    name: 'ACID SMILE ARCHIVE',
    category: 'AESTHETIC',
    style: 'Street',
    mood: 'Chaotic',
    color: 'Neon',
    tags: ['acid-house', 'smiley', 'rave', '90s'],
    description: 'Classic yellow rave smiley melting down the canvas into neon puddles.',
    bg: '#11120a',
    accent: '#facc15',
    subtext: 'HAPPINESS OVERFLOW ERROR'
  },

  // --- MOTIVATION ---
  {
    name: 'DISCIPLINE OVER MOTIVATION',
    category: 'MOTIVATION',
    style: 'Bold',
    mood: 'Focused',
    color: 'Monochrome',
    tags: ['stoic', 'gym', 'focus', 'grind', 'grit'],
    description: 'Heavy military stencil lettering: Motivation is a mood, discipline is a lifestyle.',
    bg: '#0d0d10',
    accent: '#f8fafc',
    subtext: 'DO WHAT MUST BE DONE REGARDLESS'
  },
  {
    name: 'OUTWORK EVERYONE',
    category: 'MOTIVATION',
    style: 'Bold',
    mood: 'Confident',
    color: 'Neon',
    tags: ['work-ethic', 'grind', 'gym', 'unstoppable'],
    description: 'Lightning bolt striking an anvil with sparking impact particles.',
    bg: '#100a0c',
    accent: '#f43f5e',
    subtext: 'WHILE THEY REST // WE BUILD'
  },
  {
    name: 'MAKE TODAY COUNT',
    category: 'MOTIVATION',
    style: 'Typographic',
    mood: 'Focused',
    color: 'Pastel',
    tags: ['carpe-diem', 'hours', 'clock', 'action'],
    description: 'Countdown timer displaying 86,400 seconds remaining in your day.',
    bg: '#0b1014',
    accent: '#38bdf8',
    subtext: 'NON-REFUNDABLE TIME DEPOSIT'
  },
  {
    name: 'REST IS PRODUCTIVE',
    category: 'MOTIVATION',
    style: 'Minimal',
    mood: 'Chill',
    color: 'Pastel',
    tags: ['mental-health', 'recharge', 'anti-burnout'],
    description: 'Battery charging up to 100% with leafy green vines wrapping the cell.',
    bg: '#0c1210',
    accent: '#e2e8f0',
    subtext: 'YOU CANNOT SERVE FROM AN EMPTY VESSEL'
  },
  {
    name: 'SILENT AMBITION',
    category: 'MOTIVATION',
    style: 'Minimal',
    mood: 'Mysterious',
    color: 'Monochrome',
    tags: ['stealth', 'growth', 'moves', 'power'],
    description: 'Understated front chest print: Move in silence, let the results make the noise.',
    bg: '#090a0d',
    accent: '#e2e8f0',
    subtext: 'NO ANNOUNCEMENTS // ONLY UPGRADES'
  },
  {
    name: 'DEATH TO AVERAGE',
    category: 'MOTIVATION',
    style: 'Street',
    mood: 'Rebellious',
    color: 'Neon',
    tags: ['excellence', 'intensity', 'grit', 'rebel'],
    description: 'Crossbones resting beneath the word "MEDIOCRE" crossed out with red paint.',
    bg: '#120b0c',
    accent: '#ef4444',
    subtext: 'STANDARD IS SET BY NO ONE ELSE'
  },
  {
    name: 'UNCOMFORTABLE IS THE GOAL',
    category: 'MOTIVATION',
    style: 'Bold',
    mood: 'Confident',
    color: 'Neon',
    tags: ['growth-zone', 'gym', 'mindset', 'comfort-zone'],
    description: 'Dotted threshold line separating the Comfort Zone from the Expansion Zone.',
    bg: '#0d110d',
    accent: '#e2e8f0',
    subtext: 'CROSS OVER TO GROW'
  },
  {
    name: 'PRESSURE MAKES DIAMONDS',
    category: 'MOTIVATION',
    style: 'Graphic',
    mood: 'Confident',
    color: 'Neon',
    tags: ['diamond', 'strength', 'tough', 'resilience'],
    description: 'Geometric diamond facet refracting multicolored beams under sheer weight.',
    bg: '#0c0d16',
    accent: '#67e8f9',
    subtext: 'TONS PER SQUARE INCH // IMMORTAL SHINE'
  },
  {
    name: 'CONSISTENCY IS KING',
    category: 'MOTIVATION',
    style: 'Vintage',
    mood: 'Focused',
    color: 'Earth',
    tags: ['crown', 'daily', 'routine', 'mastery'],
    description: 'Royal crown silhouette composed of 365 tiny tick-marks.',
    bg: '#14120b',
    accent: '#eab308',
    subtext: 'SHOW UP EVERY SINGLE DAY'
  },
  {
    name: 'NEVER SETTLE',
    category: 'MOTIVATION',
    style: 'Bold',
    mood: 'Confident',
    color: 'Monochrome',
    tags: ['relentless', 'hunger', 'vision', 'forward'],
    description: 'Directional forward arrows pulsing with increasing stroke weights.',
    bg: '#0a0a0c',
    accent: '#ffffff',
    subtext: 'THE NEXT LEVEL ALWAYS WAITS'
  },

  // --- OTHERS & SPECIAL EDITIONS ---
  {
    name: 'SIGNATURE LOGO CREST',
    category: 'OTHERS',
    style: 'Bold',
    mood: 'Confident',
    color: 'Neon',
    tags: ['brand', 'official', 'uncommon', 'monogram'],
    description: 'Official UNCommon weaR interlocking typography crest and motto.',
    bg: '#08080a',
    accent: '#ff2a4b',
    subtext: 'CREATED BY YOU // CRAFTED BY US'
  },
  {
    name: 'CUSTOM PRINT INITIATIVE',
    category: 'OTHERS',
    style: 'Street',
    mood: 'Industrial',
    color: 'Neon',
    tags: ['cart', 'custom', 'live-print', 'exclusive'],
    description: 'Cart printing graphic showing screenprint squeegee moving over live ink.',
    bg: '#0e0e12',
    accent: '#38bdf8',
    subtext: 'FRESH OFF THE SQUEEGEE // LIVE CARTS'
  },
  {
    name: 'NOVELTY BARCODE SPEC',
    category: 'OTHERS',
    style: 'Minimal',
    mood: 'Industrial',
    color: 'Monochrome',
    tags: ['utility', 'raw', 'industrial', 'spec'],
    description: 'Raw product specification label with washing instructions and batch ID.',
    bg: '#101114',
    accent: '#cbd5e1',
    subtext: 'WASH COLD // WEAR DAILY // BE UNCOMMON'
  },
  {
    name: 'TAROT CARD THE CREATOR',
    category: 'OTHERS',
    style: 'Vintage',
    mood: 'Mysterious',
    color: 'Earth',
    tags: ['tarot', 'occult', 'hand', 'spark', 'mystic'],
    description: 'Mystic ornate gold foil tarot card with the Magician hand creating sparks.',
    bg: '#14110d',
    accent: '#fcd34d',
    subtext: 'CARD 01 // THE ARCHITECT OF DREAMS'
  },
  {
    name: 'WORLD TOUR UNCOMMON',
    category: 'OTHERS',
    style: 'Vintage',
    mood: 'Nostalgic',
    color: 'Neon',
    tags: ['band-tee', 'tour', 'dates', 'heavy-metal'],
    description: 'Vintage 90s rock tour dates listed across the back for cities of the mind.',
    bg: '#0d0a0f',
    accent: '#ec4899',
    subtext: 'TOKYO • BERLIN • NEW YORK • CART 01'
  }
];

// Let's expand rawDesigns to 110+ items by generating curated variations
// with genuine codes from UW-001 to UW-115
const targetTotal = 115;
const additionalThemes = [
  { name: 'NIGHT OWL SYNDICATE', category: 'GEN-Z', style: 'Cyber', mood: 'Chill', color: 'Neon', tags: ['night', 'owl', '3am', 'sleep'], subtext: 'ACTIVE FROM 02:00 TO 06:00', accent: '#a855f7', bg: '#0d0b14' },
  { name: 'ANALOGUE HEART', category: 'AESTHETIC', style: 'Vintage', mood: 'Nostalgic', color: 'Pastel', tags: ['vinyl', 'record', 'warmth'], subtext: 'SOUNDTRACK OF LOST MEMORIES', accent: '#f472b6', bg: '#120b12' },
  { name: 'ANTI HERO ARC', category: 'QUOTES', style: 'Bold', mood: 'Edgy', color: 'Neon', tags: ['villain', 'rebel', 'story'], subtext: 'TIRED OF SAVING EVERYONE ELSE', accent: '#f43f5e', bg: '#140c0f' },
  { name: 'OFFLINE MODE ONLY', category: 'MINIMAL', style: 'Minimal', mood: 'Chill', color: 'Monochrome', tags: ['airplane-mode', 'zen'], subtext: 'AIRPLANE MODE FOR THE SOUL', accent: '#e2e8f0', bg: '#0c0d10' },
  { name: 'CAFFEINE & CODE', category: 'COLLEGE', style: 'Cyber', mood: 'Focused', color: 'Neon', tags: ['developer', 'syntax', 'coffee'], subtext: 'WHILE (BREATHING) { CODE(); }', accent: '#ff2a4b', bg: '#090d0b' },
  { name: 'SEROTONIN LEVEL 0%', category: 'FUNNY', style: 'Graphic', mood: 'Relatable', color: 'Neon', tags: ['tired', 'meter', 'meme'], subtext: 'PLEASE INSERT SUNLIGHT OR COFFEE', accent: '#eab308', bg: '#12100a' },
  { name: 'NEVER EXPLAIN YOURSELF', category: 'QUOTES', style: 'Typographic', mood: 'Confident', color: 'Monochrome', tags: ['silence', 'peace', 'bold'], subtext: 'THOSE WHO CARE DONT NEED IT', accent: '#f8fafc', bg: '#0b0c0f' },
  { name: 'CHASING GHOSTS', category: 'AESTHETIC', style: 'Minimal', mood: 'Mysterious', color: 'Pastel', tags: ['nostalgia', 'fog', 'night'], subtext: 'SEARCHING FOR FAMILIAR FACES', accent: '#93c5fd', bg: '#0c1017' },
  { name: 'FUTURE IN REVERSE', category: 'GRAPHIC', style: 'Cyber', mood: 'Mysterious', color: 'Neon', tags: ['time', 'glitch', 'rewind'], subtext: 'TEMPORAL DRIFT // 2099', accent: '#06b6d4', bg: '#080e14' },
  { name: 'STREET MATRIX', category: 'STREET', style: 'Street', mood: 'Industrial', color: 'Neon', tags: ['cyber', 'urban', 'tokyo'], subtext: 'SECTOR 04 CONCRETE GRID', accent: '#ff2a4b', bg: '#0a0d08' },
  { name: 'UNDERDOG STORY', category: 'MOTIVATION', style: 'Bold', mood: 'Confident', color: 'Monochrome', tags: ['comeback', 'grit', 'fight'], subtext: 'THE VICTORY IS ALREADY WRITTEN', accent: '#e2e8f0', bg: '#0f0e12' },
  { name: 'OVERTHINKERS CLUB', category: 'FUNNY', style: 'Typographic', mood: 'Relatable', color: 'Pastel', tags: ['club', 'empathy', 'brain'], subtext: 'MEETING CANCELLED DUE TO WORRY', accent: '#c084fc', bg: '#110d18' },
  { name: 'DONT TALK TO ME YET', category: 'FUNNY', style: 'Typographic', mood: 'Sarcastic', color: 'Monochrome', tags: ['morning', 'quiet', 'humor'], subtext: 'STILL PROCESSING REALITY', accent: '#cbd5e1', bg: '#101115' },
  { name: 'CYBER SUNSET 84', category: 'AESTHETIC', style: 'Aesthetic', mood: 'Nostalgic', color: 'Neon', tags: ['miami', 'synth', 'retro'], subtext: 'NEON DUST ACROSS THE HIGHWAY', accent: '#ec4899', bg: '#140a18' },
  { name: 'GRAVITY IS OPTIONAL', category: 'GRAPHIC', style: 'Graphic', mood: 'Chill', color: 'Pastel', tags: ['astronaut', 'floating', 'space'], subtext: 'WEIGHTLESS STATE OF MIND', accent: '#38bdf8', bg: '#0a0f16' },
  { name: 'DOPAMINE DETOX', category: 'MINIMAL', style: 'Minimal', mood: 'Zen', color: 'Monochrome', tags: ['clean', 'focus', 'clarity'], subtext: 'ZERO NOTIFICATIONS SQUAD', accent: '#f1f5f9', bg: '#0b0c0f' },
  { name: 'SURVIVING ON VIBES', category: 'GEN-Z', style: 'Typographic', mood: 'Chill', color: 'Pastel', tags: ['vibe', 'slang', 'energy'], subtext: 'NOT A SINGLE PLAN IN SIGHT', accent: '#a78bfa', bg: '#100e18' },
  { name: 'THE LAST REBEL', category: 'STREET', style: 'Street', mood: 'Rebellious', color: 'Neon', tags: ['anarchy', 'punk', 'bold'], subtext: 'STANDING TALL AMIDST UNIFORMITY', accent: '#f43f5e', bg: '#130c10' },
  { name: 'ENERGY NEVER LIES', category: 'QUOTES', style: 'Minimal', mood: 'Aesthetic', color: 'Pastel', tags: ['aura', 'instinct', 'intuition'], subtext: 'VIBES ARE FASTER THAN WORDS', accent: '#67e8f9', bg: '#091014' },
  { name: 'CAMPUS NIGHT SHIFT', category: 'COLLEGE', style: 'Vintage', mood: 'Relatable', color: 'Earth', tags: ['study', 'all-nighter', 'student'], subtext: '3AM PIZZA & CODING', accent: '#fbbf24', bg: '#14110a' },
  { name: 'BEYOND THE HORIZON', category: 'MOTIVATION', style: 'Graphic', mood: 'Confident', color: 'Neon', tags: ['mountain', 'journey', 'peak'], subtext: 'THE SUMMIT IS ONLY THE START', accent: '#ffffff', bg: '#08120e' },
  { name: 'HEAVY METAL FLOWERS', category: 'AESTHETIC', style: 'Aesthetic', mood: 'Edgy', color: 'Neon', tags: ['goth', 'roses', 'grunge'], subtext: 'BEAUTY WITH THORNS OF STEEL', accent: '#f43f5e', bg: '#120a10' },
  { name: 'DO MORE TALK LESS', category: 'MOTIVATION', style: 'Bold', mood: 'Focused', color: 'Monochrome', tags: ['action', 'silent', 'hustle'], subtext: 'PROOF IN THE PRODUCTION', accent: '#ffffff', bg: '#090a0d' },
  { name: 'SYSTEM ERROR CRITICAL', category: 'GRAPHIC', style: 'Cyber', mood: 'Chaotic', color: 'Neon', tags: ['glitch', 'terminal', 'cyberpunk'], subtext: 'REBOOT UNCOMMON_PROTOCOL', accent: '#ff2a4b', bg: '#0a0d08' },
  { name: 'VINTAGE 1999 CASSETTE', category: 'COLLEGE', style: 'Vintage', mood: 'Nostalgic', color: 'Pastel', tags: ['tape', 'retro', 'analog'], subtext: 'UNCOMMON CAMPUS TAPES VOL 1', accent: '#fda4af', bg: '#140c10' },
  { name: 'NOT IMPRESSED', category: 'QUOTES', style: 'Minimal', mood: 'Sarcastic', color: 'Monochrome', tags: ['attitude', 'poker-face', 'edgy'], subtext: 'SHOW ME SOMETHING RARE', accent: '#94a3b8', bg: '#0d0e12' },
  { name: 'DEEP FOCUS SOUNDTRACK', category: 'AESTHETIC', style: 'Minimal', mood: 'Chill', color: 'Neon', tags: ['music', 'headphones', 'zen'], subtext: 'HEADPHONES ON // WORLD MUTED', accent: '#38bdf8', bg: '#080d14' },
  { name: 'CHAOS INTO ART', category: 'STREET', style: 'Street', mood: 'Chaotic', color: 'Neon', tags: ['create', 'artist', 'raw'], subtext: 'EVERY STROKE A REVOLUTION', accent: '#ff5722', bg: '#140d0a' },
  { name: 'LOWKEY GENIUS', category: 'GEN-Z', style: 'Typographic', mood: 'Confident', color: 'Pastel', tags: ['humor', 'smart', 'chill'], subtext: 'JUST PRETENDING TO BE CLUELESS', accent: '#e879f9', bg: '#120a16' },
  { name: 'ALONE BUT NOT LONELY', category: 'MINIMAL', style: 'Minimal', mood: 'Chill', color: 'Monochrome', tags: ['solitude', 'peace', 'introvert'], subtext: 'COMPLETE WITHIN ONESELF', accent: '#e2e8f0', bg: '#0b0c0f' },
  { name: 'CERTIFIED NIGHT OWL', category: 'COLLEGE', style: 'Vintage', mood: 'Relatable', color: 'Earth', tags: ['campus', 'owl', 'exam'], subtext: 'THE WORLD SLEEPS // WE CREATE', accent: '#fb923c', bg: '#14100c' },
  { name: 'DIGITAL MONK', category: 'AESTHETIC', style: 'Minimal', mood: 'Zen', color: 'Monochrome', tags: ['stoic', 'code', 'minimalist'], subtext: 'MEDITATION IN THE DATASTREAM', accent: '#f1f5f9', bg: '#090a0d' },
  { name: 'UNFILTERED THOUGHTS', category: 'QUOTES', style: 'Typographic', mood: 'Confident', color: 'Neon', tags: ['raw', 'truth', 'bold'], subtext: 'SORRY IF THE TRUTH HURTS', accent: '#f43f5e', bg: '#130c0f' },
  { name: 'SPEED OF LIGHT', category: 'MOTIVATION', style: 'Bold', mood: 'Energetic', color: 'Neon', tags: ['fast', 'momentum', 'kinetic'], subtext: 'VELOCITY = 299,792 KM/S', accent: '#facc15', bg: '#12110a' },
  { name: 'WABI SABI CRACK', category: 'AESTHETIC', style: 'Minimal', mood: 'Zen', color: 'Earth', tags: ['kintsugi', 'gold', 'beauty'], subtext: 'PERFECTION IN THE BREAKAGE', accent: '#d97706', bg: '#14100b' },
  { name: 'SLEEP OVERRIDE', category: 'FUNNY', style: 'Cyber', mood: 'Relatable', color: 'Neon', tags: ['bedtime', 'insomnia', 'phone'], subtext: 'SCROLLING UNTIL BATTERY REACHES 0', accent: '#38bdf8', bg: '#090d14' },
  { name: 'RESERVED TABLE 01', category: 'OTHERS', style: 'Minimal', mood: 'Confident', color: 'Monochrome', tags: ['vip', 'table', 'statement'], subtext: 'SEAT SAVED FOR THE PROTAGONIST', accent: '#f8fafc', bg: '#0b0c10' },
  { name: 'GRAFFITI SKETCHBOOK', category: 'STREET', style: 'Street', mood: 'Chaotic', color: 'Neon', tags: ['blackbook', 'sketches', 'ink'], subtext: 'PAGES FROM THE UNDERGROUND', accent: '#ec4899', bg: '#130a14' },
  { name: 'NO BAD DAYS', category: 'MOTIVATION', style: 'Typographic', mood: 'Energetic', color: 'Neon', tags: ['positive', 'smile', 'energy'], subtext: 'ONLY LESSONS AND UPGRADES', accent: '#ff2a4b', bg: '#08120a' },
  { name: 'TOO LOUD FOR SILENCE', category: 'STREET', style: 'Bold', mood: 'Confident', color: 'Neon', tags: ['boombox', 'sound', 'subwoofer'], subtext: 'DECIBELS EXCEEDING REGULATION', accent: '#ff4d00', bg: '#140c0a' },
  { name: 'AURA 10,000+', category: 'GEN-Z', style: 'Aesthetic', mood: 'Confident', color: 'Neon', tags: ['slang', 'glow', 'presence'], subtext: 'IMMEASURABLE CHARISMA INDEX', accent: '#c084fc', bg: '#110b18' },
  { name: 'SOLAR FLARE EXPLOSION', category: 'GRAPHIC', style: 'Graphic', mood: 'Energetic', color: 'Neon', tags: ['sun', 'radiation', 'space'], subtext: 'CORONAL MASS EJECTION // CLASS X', accent: '#fb923c', bg: '#140f09' },
  { name: 'DISTRICT UNDERGROUND', category: 'STREET', style: 'Street', mood: 'Mysterious', color: 'Monochrome', tags: ['subway', 'tunnel', 'urban'], subtext: 'WHERE THE CITY SECRETLY LIVES', accent: '#94a3b8', bg: '#0c0d10' },
  { name: 'CHILL MODE ENGAGED', category: 'MINIMAL', style: 'Minimal', mood: 'Chill', color: 'Pastel', tags: ['couch', 'sweatpants', 'vibe'], subtext: 'DO NOT APPLY STRESS TODAY', accent: '#a5f3fc', bg: '#091014' },
  { name: 'NEO RETRO SYNTH', category: 'AESTHETIC', style: 'Cyber', mood: 'Nostalgic', color: 'Neon', tags: ['analog-synth', 'knobs', '80s'], subtext: 'OSCILLATOR FREQUENCY TUNED', accent: '#f43f5e', bg: '#120a10' },
  { name: 'BORN TO CREATE', category: 'MOTIVATION', style: 'Bold', mood: 'Confident', color: 'Monochrome', tags: ['artist', 'artisan', 'maker'], subtext: 'NOT HERE TO MERELY CONSUME', accent: '#f8fafc', bg: '#0a0a0d' },
  { name: 'CROWD CONTROL NEGATIVE', category: 'STREET', style: 'Street', mood: 'Rebellious', color: 'Neon', tags: ['riot', 'stencil', 'rebel'], subtext: 'BARRIERS BREACHED WITH STYLE', accent: '#ff2a4b', bg: '#0d0f09' },
  { name: 'COFFEE IN MY VEINS', category: 'FUNNY', style: 'Graphic', mood: 'Relatable', color: 'Earth', tags: ['drip', 'caffeine', 'heart'], subtext: 'HEART RATE: 140 BPM // HAPPILY', accent: '#fdba74', bg: '#14100c' },
  { name: 'UNAPOLOGETICALLY ME', category: 'QUOTES', style: 'Typographic', mood: 'Confident', color: 'Neon', tags: ['authenticity', 'bold', 'standout'], subtext: 'NO APOLOGIES FOR WHO I AM', accent: '#e879f9', bg: '#130a16' },
  { name: 'TERMINAL BOOT SEQUENCE', category: 'GRAPHIC', style: 'Cyber', mood: 'Technical', color: 'Neon', tags: ['linux', 'prompt', 'green-screen'], subtext: 'INITIALIZING BRAIN_OS V4.2', accent: '#ff2a4b', bg: '#080d09' },
  { name: 'THE ART OF NOT CARING', category: 'QUOTES', style: 'Minimal', mood: 'Chill', color: 'Monochrome', tags: ['peace', 'stoicism', 'quiet'], subtext: 'PEACE OF MIND PRESERVED', accent: '#cbd5e1', bg: '#0e0f13' }
];

// Combine raw designs with additional themes
const fullList = [...rawDesigns];
additionalThemes.forEach(item => {
  if (fullList.length < targetTotal) {
    fullList.push({
      ...item,
      description: item.description || `${item.name} graphic design. Crafted with clean streetwear precision.`
    });
  }
});

// Fill up to targetTotal (115) with dynamic distinct designs if needed
while (fullList.length < targetTotal) {
  const i = fullList.length + 1;
  const cats = ['MINIMAL', 'QUOTES', 'FUNNY', 'COLLEGE', 'GEN-Z', 'GRAPHIC', 'STREET', 'AESTHETIC', 'MOTIVATION'];
  const cat = cats[i % cats.length];
  fullList.push({
    name: `SIGNATURE SERIES ${String(i).padStart(2, '0')}`,
    category: cat,
    style: i % 2 === 0 ? 'Minimal' : 'Street',
    mood: i % 3 === 0 ? 'Chill' : 'Confident',
    color: i % 2 === 0 ? 'Neon' : 'Monochrome',
    tags: ['signature', 'limited', cat.toLowerCase()],
    description: `Signature edition design #${i} exclusively crafted for UNCommon weaR printing carts.`,
    bg: '#0a0a0d',
    accent: '#ff2a4b',
    subtext: `SPECIAL ARCHIVE // CODE UW-${String(i).padStart(3, '0')}`
  });
}

// Function to generate high-aesthetic SVG Artwork
function generateArtworkSVG(design, code) {
  const width = 800;
  const height = 1000;
  const bg = design.bg || '#0b0c10';
  const accent = design.accent || '#ff2a4b';
  const name = design.name || 'UNTITLED';
  const subtext = design.subtext || 'UNCOMMON WEAR // LIMITED EDITION';
  const cat = design.category || 'GRAPHIC';

  // Choose visual motif based on category/style
  let graphicElements = '';

  if (design.category === 'MINIMAL') {
    graphicElements = `
      <g opacity="0.85">
        <circle cx="400" cy="460" r="160" stroke="${accent}" stroke-width="2.5" fill="none" stroke-dasharray="8 6"/>
        <line x1="200" y1="460" x2="600" y2="460" stroke="${accent}" stroke-width="1.5" opacity="0.4"/>
        <line x1="400" y1="260" x2="400" y2="660" stroke="${accent}" stroke-width="1.5" opacity="0.4"/>
        <circle cx="400" cy="460" r="28" fill="${accent}"/>
        <rect x="360" y="420" width="80" height="80" stroke="#ffffff" stroke-width="1.5" fill="none" opacity="0.6"/>
      </g>
    `;
  } else if (design.category === 'QUOTES') {
    graphicElements = `
      <g>
        <text x="180" y="320" font-family="'Space Grotesk', 'Inter', sans-serif" font-weight="900" font-size="120" fill="${accent}" opacity="0.35">“</text>
        <rect x="220" y="380" width="360" height="2" fill="${accent}" opacity="0.6"/>
        <circle cx="220" cy="380" r="4" fill="${accent}"/>
        <circle cx="580" cy="380" r="4" fill="${accent}"/>
        <text x="590" y="580" font-family="'Space Grotesk', 'Inter', sans-serif" font-weight="900" font-size="120" fill="${accent}" opacity="0.35">”</text>
      </g>
    `;
  } else if (design.category === 'CYBER' || design.style === 'Cyber' || design.category === 'GEN-Z') {
    graphicElements = `
      <g>
        <rect x="220" y="300" width="360" height="320" rx="16" fill="none" stroke="${accent}" stroke-width="3" opacity="0.8"/>
        <path d="M 220 350 L 580 350" stroke="${accent}" stroke-width="1.5" opacity="0.4"/>
        <circle cx="250" cy="325" r="5" fill="${accent}"/>
        <circle cx="270" cy="325" r="5" fill="${accent}" opacity="0.5"/>
        <circle cx="290" cy="325" r="5" fill="${accent}" opacity="0.3"/>
        <text x="560" y="330" font-family="'JetBrains Mono', monospace" font-size="14" fill="${accent}" text-anchor="end">SYS.READY</text>
        <polygon points="400,380 470,520 330,520" fill="none" stroke="${accent}" stroke-width="3"/>
        <circle cx="400" cy="460" r="45" fill="${accent}" opacity="0.25"/>
        <text x="400" y="575" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="4">EXE_VERIFIED</text>
      </g>
    `;
  } else if (design.category === 'STREET') {
    graphicElements = `
      <g>
        <rect x="180" y="320" width="440" height="280" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.8"/>
        <rect x="200" y="340" width="400" height="240" fill="${accent}" opacity="0.12"/>
        <line x1="160" y1="380" x2="640" y2="380" stroke="${accent}" stroke-width="6"/>
        <line x1="160" y1="540" x2="640" y2="540" stroke="${accent}" stroke-width="6"/>
        <text x="400" y="475" font-family="'Syncopate', 'Space Grotesk', sans-serif" font-weight="900" font-size="54" fill="#ffffff" text-anchor="middle" letter-spacing="8">RAW DIVISION</text>
        <text x="400" y="515" font-family="'JetBrains Mono', monospace" font-size="16" fill="${accent}" text-anchor="middle" letter-spacing="6">UNCOMMON DEPT.</text>
      </g>
    `;
  } else if (design.category === 'COLLEGE') {
    graphicElements = `
      <g>
        <path d="M 400 280 C 520 280 580 340 580 440 C 580 540 480 620 400 640 C 320 620 220 540 220 440 C 220 340 280 280 400 280 Z" fill="none" stroke="${accent}" stroke-width="4"/>
        <path d="M 400 300 C 500 300 550 350 550 435 C 550 520 470 590 400 615 C 330 590 250 520 250 435 C 250 350 300 300 400 300 Z" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.5"/>
        <text x="400" y="440" font-family="'Syne', 'Impact', sans-serif" font-weight="900" font-size="90" fill="${accent}" text-anchor="middle">UW</text>
        <text x="400" y="490" font-family="'JetBrains Mono', monospace" font-size="18" fill="#ffffff" text-anchor="middle" letter-spacing="6">VARSITY 2024</text>
      </g>
    `;
  } else if (design.category === 'MOTIVATION') {
    graphicElements = `
      <g>
        <polygon points="400,290 490,460 310,460" fill="none" stroke="${accent}" stroke-width="4"/>
        <polygon points="400,630 490,460 310,460" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.5"/>
        <circle cx="400" cy="460" r="60" fill="${accent}" opacity="0.2"/>
        <circle cx="400" cy="460" r="15" fill="${accent}"/>
        <line x1="240" y1="460" x2="560" y2="460" stroke="${accent}" stroke-width="2" stroke-dasharray="10 5"/>
      </g>
    `;
  } else {
    // Aesthetic & Graphic default
    graphicElements = `
      <g>
        <circle cx="400" cy="450" r="140" fill="none" stroke="${accent}" stroke-width="3"/>
        <path d="M 280 450 Q 400 340 520 450 T 760 450" fill="none" stroke="${accent}" stroke-width="3" opacity="0.8"/>
        <path d="M 280 470 Q 400 360 520 470 T 760 470" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.5"/>
        <polygon points="400,340 450,450 350,450" fill="${accent}" opacity="0.3"/>
        <circle cx="400" cy="450" r="22" fill="#ffffff"/>
      </g>
    `;
  }

  // Barcode representation for industrial aesthetic
  const barcode = Array.from({ length: 28 }, (_, i) => {
    const x = 260 + i * 10;
    const w = (i % 3 === 0) ? 4 : (i % 2 === 0 ? 2 : 1);
    return `<rect x="${x}" y="820" width="${w}" height="45" fill="${accent}" opacity="0.75"/>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#050608"/>
    </linearGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="${accent}"/>
    </linearGradient>
  </defs>

  <!-- Background Canvas -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  
  <!-- Subtle Industrial Framing & Grid Lines -->
  <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.12"/>
  <rect x="52" y="52" width="${width - 104}" height="${height - 104}" fill="none" stroke="#ffffff" stroke-width="0.5" opacity="0.08"/>
  
  <!-- Corner Crosshairs -->
  <path d="M 40 70 L 40 40 L 70 40 M ${width - 70} 40 L ${width - 40} 40 L ${width - 40} 70 M 40 ${height - 70} L 40 ${height - 40} L 70 ${height - 40} M ${width - 70} ${height - 40} L ${width - 40} ${height - 40} L ${width - 40} ${height - 70}" fill="none" stroke="${accent}" stroke-width="2" opacity="0.8"/>

  <!-- Top Metadata Bar -->
  <text x="70" y="85" font-family="'JetBrains Mono', 'Space Grotesk', monospace" font-size="16" font-weight="700" fill="${accent}" letter-spacing="3">${code}</text>
  <text x="${width - 70}" y="85" font-family="'JetBrains Mono', monospace" font-size="14" fill="#a1a1aa" text-anchor="end" letter-spacing="2">${cat}</text>

  <!-- Central Graphic Motif -->
  ${graphicElements}

  <!-- Main Typographic Name -->
  <g transform="translate(400, 720)">
    <text x="0" y="0" font-family="'Space Grotesk', 'Syncopate', sans-serif" font-weight="900" font-size="${name.length > 18 ? 38 : (name.length > 12 ? 46 : 56)}" fill="url(#textGrad)" text-anchor="middle" letter-spacing="3">${name}</text>
    <text x="0" y="42" font-family="'JetBrains Mono', monospace" font-size="15" fill="#a1a1aa" text-anchor="middle" letter-spacing="4">${subtext}</text>
  </g>

  <!-- Industrial Barcode & Bottom Signature -->
  ${barcode}
  <text x="400" y="890" font-family="'JetBrains Mono', monospace" font-size="13" fill="${accent}" text-anchor="middle" letter-spacing="6">UNCOMMON weaR // ${code}</text>
  <text x="400" y="930" font-family="'Inter', sans-serif" font-size="12" fill="#71717a" text-anchor="middle" letter-spacing="2">CREATED BY YOU. CRAFTED BY US.</text>
</svg>`;
}

// Function to generate realistic Oversized Streetwear T-Shirt Mockup SVG
function generateMockupSVG(design, code, artworkSvgRelativePath) {
  const width = 800;
  const height = 950;
  const teeColor = design.bg === '#ffffff' ? '#18181b' : '#0e0f12';
  const teeShadow = '#050608';
  const accent = design.accent || '#ff2a4b';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bgStudio" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#18181c"/>
      <stop offset="100%" stop-color="#0c0d10"/>
    </linearGradient>
    <filter id="teeShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="25" stdDeviation="35" flood-color="#000000" flood-opacity="0.8"/>
    </filter>
    <linearGradient id="fabricCrease" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.06"/>
      <stop offset="50%" stop-color="#000000" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04"/>
    </linearGradient>
  </defs>

  <!-- Studio Background -->
  <rect width="${width}" height="${height}" fill="url(#bgStudio)"/>
  
  <!-- Subtle Studio Grid -->
  <circle cx="400" cy="460" r="320" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.04"/>
  <circle cx="400" cy="460" r="420" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.02"/>

  <!-- T-SHIRT SILHOUETTE (Oversized Boxy Fit) -->
  <g filter="url(#teeShadow)">
    <!-- Base Tee Body -->
    <path d="M 270 120 
             C 320 145 480 145 530 120 
             L 660 210 
             L 590 320 
             L 535 285 
             L 535 830 
             C 450 840 350 840 265 830 
             L 265 285 
             L 210 320 
             L 140 210 
             Z" 
          fill="${teeColor}" stroke="#27272a" stroke-width="2"/>

    <!-- Collar Ribbing -->
    <path d="M 330 125 C 360 160 440 160 470 125 C 440 145 360 145 330 125 Z" fill="#1f2024" stroke="#3f3f46" stroke-width="1.5"/>
    <path d="M 320 123 C 360 168 440 168 480 123" fill="none" stroke="#3f3f46" stroke-width="2" opacity="0.7"/>

    <!-- Shoulder Stitches & Drop Seams -->
    <path d="M 270 120 L 140 210" stroke="#27272a" stroke-width="1.5" stroke-dasharray="4 3"/>
    <path d="M 530 120 L 660 210" stroke="#27272a" stroke-width="1.5" stroke-dasharray="4 3"/>

    <!-- Sleeve Hem Seams -->
    <path d="M 140 210 L 210 320" stroke="#27272a" stroke-width="1.5"/>
    <path d="M 660 210 L 590 320" stroke="#27272a" stroke-width="1.5"/>

    <!-- Bottom Hem -->
    <path d="M 265 805 C 350 815 450 815 535 805" stroke="#27272a" stroke-width="2" fill="none" stroke-dasharray="6 3"/>

    <!-- Subtle Fabric Creases Overlay -->
    <path d="M 270 290 Q 320 340 310 420 Q 330 520 290 620" fill="none" stroke="url(#fabricCrease)" stroke-width="12" opacity="0.3"/>
    <path d="M 530 290 Q 480 340 490 420 Q 470 520 510 620" fill="none" stroke="url(#fabricCrease)" stroke-width="12" opacity="0.3"/>
  </g>

  <!-- PRINT EMBEDDED ON TEE CHEST -->
  <g transform="translate(290, 230) scale(0.275)">
    <!-- Clipped or scaled Artwork frame on chest -->
    <rect width="800" height="1000" rx="12" fill="${design.bg || '#090a0d'}" stroke="#ffffff" stroke-width="2" opacity="0.9"/>
    
    <!-- Chest print artwork graphics miniature -->
    <text x="400" y="160" font-family="'JetBrains Mono', monospace" font-size="34" font-weight="bold" fill="${accent}" text-anchor="middle">${code}</text>
    <circle cx="400" cy="420" r="160" fill="none" stroke="${accent}" stroke-width="6"/>
    <circle cx="400" cy="420" r="40" fill="${accent}"/>
    <text x="400" y="680" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="62" fill="#ffffff" text-anchor="middle">${design.name}</text>
    <text x="400" y="750" font-family="'JetBrains Mono', monospace" font-size="28" fill="${accent}" text-anchor="middle">${design.subtext || 'UNCOMMON weaR'}</text>
    <line x1="250" y1="840" x2="550" y2="840" stroke="${accent}" stroke-width="4"/>
  </g>

  <!-- Hanging Brand Tag / Clamp Badge -->
  <g transform="translate(520, 720)">
    <rect x="0" y="0" width="38" height="52" fill="#000000" stroke="#3f3f46" stroke-width="1"/>
    <rect x="0" y="44" width="38" height="8" fill="${accent}"/>
    <text x="19" y="26" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">UW</text>
  </g>

  <!-- Bottom Visual Info Badge -->
  <rect x="50" y="${height - 75}" width="700" height="50" rx="8" fill="#121317" stroke="#27272a" stroke-width="1"/>
  <text x="75" y="${height - 44}" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="bold" fill="${accent}">${code}</text>
  <text x="175" y="${height - 44}" font-family="'Inter', sans-serif" font-size="13" font-weight="600" fill="#f4f4f5">${design.name}</text>
  <text x="${width - 75}" y="${height - 44}" font-family="'Inter', sans-serif" font-size="12" fill="#a1a1aa" text-anchor="end">Oversized Heavyweight Cotton (240 GSM)</text>
</svg>`;
}

// Generate the 115 design objects and write artwork + mockup SVGs
console.log(`Generating ${fullList.length} designs, artworks, and mockups...`);

const seededDesigns = fullList.map((item, index) => {
  const codeNum = index + 1;
  const code = `UW-${String(codeNum).padStart(3, '0')}`;
  
  const artworkFileName = `${code}-art.svg`;
  const mockupFileName = `${code}-mockup.svg`;
  
  const artworkFilePath = path.join(ARTWORKS_DIR, artworkFileName);
  const mockupFilePath = path.join(MOCKUPS_DIR, mockupFileName);

  // Generate SVG files
  const artworkSvg = generateArtworkSVG(item, code);
  const mockupSvg = generateMockupSVG(item, code, `/assets/designs/${artworkFileName}`);

  fs.writeFileSync(artworkFilePath, artworkSvg, 'utf8');
  fs.writeFileSync(mockupFilePath, mockupSvg, 'utf8');

  // Featured flags on selected hero designs
  const isFeatured = [1, 2, 7, 12, 17, 23, 31, 47, 52, 68, 77, 88, 99, 108].includes(codeNum);

  return {
    id: `des_${String(codeNum).padStart(3, '0')}`,
    code,
    name: item.name,
    image: `/assets/designs/${artworkFileName}`,
    mockupImage: `/assets/mockups/${mockupFileName}`,
    category: item.category.toUpperCase(),
    tags: item.tags || [item.category.toLowerCase(), 'streetwear', 'uncommon'],
    style: item.style || 'Modern',
    mood: item.mood || 'Aesthetic',
    color: item.color || 'Monochrome',
    description: item.description || `${item.name} custom graphics ready for instant printing at our cart.`,
    featured: isFeatured,
    status: 'published',
    views: Math.floor(Math.random() * 85) + 15,
    copies: Math.floor(Math.random() * 25) + 2,
    order: codeNum,
    createdAt: new Date(Date.now() - (115 - codeNum) * 3600 * 1000).toISOString()
  };
});

// Construct initial analytics seed
const seedAnalytics = {
  catalogueViews: 428,
  searches: {
    introvert: { count: 34, lastAt: new Date().toISOString() },
    minimal: { count: 28, lastAt: new Date().toISOString() },
    vintage: { count: 19, lastAt: new Date().toISOString() },
    funny: { count: 18, lastAt: new Date().toISOString() },
    cyber: { count: 15, lastAt: new Date().toISOString() },
    'uw-047': { count: 12, lastAt: new Date().toISOString() },
    college: { count: 11, lastAt: new Date().toISOString() }
  },
  categoryViews: {
    'GEN-Z': 89,
    'MINIMAL': 76,
    'STREET': 72,
    'QUOTES': 68,
    'FUNNY': 54,
    'GRAPHIC': 49,
    'COLLEGE': 42,
    'AESTHETIC': 38,
    'MOTIVATION': 30,
    'OTHERS': 18
  },
  designViews: {
    'UW-047': 88,
    'UW-001': 74,
    'UW-012': 65,
    'UW-023': 58,
    'UW-088': 52
  },
  copyActions: {
    'UW-047': 29,
    'UW-001': 22,
    'UW-012': 18,
    'UW-088': 14
  }
};

const fullDbData = {
  designs: seededDesigns,
  categories,
  analytics: seedAnalytics,
  settings: {
    adminPin: '1337',
    brandName: 'UNCommon weaR',
    tagline: 'Created by you. Crafted by us.',
    subline: 'Find something that feels like you.',
    instagramHandle: '@uncommonwear.official',
    instagramUrl: 'https://instagram.com/uncommonwear.official',
    cartQrTargetUrl: '/designs'
  }
};

// Save to datastore
replaceAllData(fullDbData);

console.log(`Successfully generated and seeded ${seededDesigns.length} designs into UNCommon weaR database!`);
console.log(`Design codes range: ${seededDesigns[0].code} to ${seededDesigns[seededDesigns.length - 1].code}`);
console.log(`Categories count: ${categories.length}`);
