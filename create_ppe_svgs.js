
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
    console.log("Starting SVG generation...");
    const ppeDir = path.join(__dirname, 'public', 'ppe');
    console.log("Target directory:", ppeDir);

    if (!fs.existsSync(ppeDir)) {
        console.log("Creating directory...");
        fs.mkdirSync(ppeDir, { recursive: true });
    }

    const svgs = {
        'safety_shoes.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="black"><path d="M10,80 Q10,50 40,50 L70,50 Q90,50 90,80 L90,90 L10,90 Z" /></svg>`,
        'grip_gloves.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M30,90 L30,40 Q30,10 50,10 Q70,10 70,40 L70,90 Z" fill="orange" stroke="grey" stroke-width="5"/></svg>`,
        'cotton_gloves.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M30,90 L30,40 Q30,10 50,10 Q70,10 70,40 L70,90 Z" fill="white" stroke="black" stroke-width="2"/><circle cx="40" cy="40" r="2" fill="black"/><circle cx="50" cy="30" r="2" fill="black"/><circle cx="60" cy="40" r="2" fill="black"/></svg>`,
        'hardhat.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M10,60 Q10,10 50,10 Q90,10 90,60 L100,60 L100,70 L0,70 L0,60 Z" fill="yellow" stroke="black"/></svg>`,
        'faceshield.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,20 L80,20 L80,30 L20,30 Z" fill="black"/><path d="M20,30 L80,30 L80,90 Q50,100 20,90 Z" fill="lightblue" opacity="0.5" stroke="blue"/></svg>`,
        'kn95_mask.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,30 Q50,10 80,30 L70,80 Q50,90 30,80 Z" fill="white" stroke="gray"/><line x1="10" y1="40" x2="20" y2="30" stroke="white" stroke-width="2"/><line x1="90" y1="40" x2="80" y2="30" stroke="white" stroke-width="2"/></svg>`,
        'spectacles.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="30" cy="50" r="15" fill="none" stroke="black" stroke-width="2"/><circle cx="70" cy="50" r="15" fill="none" stroke="black" stroke-width="2"/><line x1="45" y1="50" x2="55" y2="50" stroke="black" stroke-width="2"/><line x1="15" y1="50" x2="5" y2="40" stroke="black" stroke-width="2"/><line x1="85" y1="50" x2="95" y2="40" stroke="black" stroke-width="2"/></svg>`,
        'earplug.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,40 L30,40 L30,60 L20,60 Z" fill="yellow"/><path d="M70,40 L80,40 L80,60 L70,60 Z" fill="yellow"/><path d="M30,50 Q50,80 70,50" fill="none" stroke="blue" stroke-width="2"/></svg>`,
        'welding_mask.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="70" rx="10" fill="black"/><rect x="35" y="35" width="30" height="10" fill="blue"/></svg>`,
        'welding_gloves.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M20,90 L20,40 Q20,10 40,10 Q60,10 60,40 L60,90 L80,90 L80,60" fill="orange" stroke="black"/></svg>`,
        'welding_apron.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M30,20 L70,20 L80,90 L20,90 Z" fill="brown"/><line x1="30" y1="20" x2="30" y2="10" stroke="black"/><line x1="70" y1="20" x2="70" y2="10" stroke="black"/></svg>`,
        'full_body_harness.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="30" y="20" width="40" height="60" fill="none" stroke="yellow" stroke-width="5"/><line x1="30" y1="50" x2="70" y2="50" stroke="black" stroke-width="3"/><line x1="30" y1="20" x2="70" y2="80" stroke="black" stroke-width="2"/><line x1="70" y1="20" x2="30" y2="80" stroke="black" stroke-width="2"/></svg>`
    };

    for (const [filename, content] of Object.entries(svgs)) {
        fs.writeFileSync(path.join(ppeDir, filename), content);
        console.log(`Created ${filename}`);
    }
    console.log("Done.");
} catch (error) {
    console.error("Error creating SVGs:", error);
    process.exit(1);
}
