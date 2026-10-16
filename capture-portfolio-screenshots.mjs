import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://fj-niger.vercel.app';
const OUTPUT_DIR = path.resolve('portfolio-screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log(`Starting capture for ${BASE_URL}...`);
  const browser = await chromium.launch();

  // 1. Desktop context (Retina @2x, 1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  const desktopPage = await desktopContext.newPage();

  // Screenshot 1: Home Hero
  console.log('Capturing Home Hero...');
  await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(2000); // Wait for GSAP / Lenis animations
  await desktopPage.screenshot({
    path: path.join(OUTPUT_DIR, '01-home-hero.png'),
    fullPage: false,
  });

  // Screenshot 2: Home Full Page
  console.log('Capturing Home Full Scrollytelling...');
  await desktopPage.screenshot({
    path: path.join(OUTPUT_DIR, '02-home-fullpage.png'),
    fullPage: true,
  });

  // Screenshot 3: Blog Page
  console.log('Capturing Blog page...');
  await desktopPage.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1500);
  await desktopPage.screenshot({
    path: path.join(OUTPUT_DIR, '03-blog-overview.png'),
    fullPage: false,
  });

  // Screenshot 4: Blog Full Page
  await desktopPage.screenshot({
    path: path.join(OUTPUT_DIR, '04-blog-fullpage.png'),
    fullPage: true,
  });

  // Screenshot 5: Contact Page
  console.log('Capturing Contact page...');
  await desktopPage.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1500);
  await desktopPage.screenshot({
    path: path.join(OUTPUT_DIR, '05-contact-page.png'),
    fullPage: false,
  });

  // Screenshot 6: Login / Admin Portal Page
  console.log('Capturing Login page...');
  await desktopPage.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1500);
  await desktopPage.screenshot({
    path: path.join(OUTPUT_DIR, '06-login-page.png'),
    fullPage: false,
  });

  await desktopContext.close();

  // 2. Mobile Viewport (iPhone 14 / modern smartphone: 390x844 @3x)
  console.log('Capturing Mobile Viewport...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });

  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({
    path: path.join(OUTPUT_DIR, '07-mobile-home.png'),
    fullPage: false,
  });

  await mobilePage.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1500);
  await mobilePage.screenshot({
    path: path.join(OUTPUT_DIR, '08-mobile-blog.png'),
    fullPage: false,
  });

  await mobileContext.close();
  await browser.close();

  console.log('All screenshots successfully saved to:', OUTPUT_DIR);
}

capture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
