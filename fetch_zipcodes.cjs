const https = require('https');
const fs = require('fs');

const citiesUrl = 'https://psgc.cloud/api/cities';
const municipalitiesUrl = 'https://psgc.cloud/api/municipalities';
const outputPath = 'zipcodes.json';

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    try {
        console.log('Fetching cities...');
        const cities = await fetch(citiesUrl);
        console.log(`Fetched ${cities.length} cities.`);

        console.log('Fetching municipalities...');
        const municipalities = await fetch(municipalitiesUrl);
        console.log(`Fetched ${municipalities.length} municipalities.`);

        const zipMap = {};

        const processEntry = (entry) => {
            if (entry.zip_code) {
                // Normalize name: Remove "City of ", "Municipality of "
                let name = entry.name.replace(/City of /i, '').replace(/Municipality of /i, '').trim();
                // Lowercase for easy lookup key? No, keep original casing for display if needed? 
                // But we use it for LOOKUP. So lowercase key is best.
                // But wait, the previous logic used fuzzy search.
                // Let's store: { "normalized_lowercase_name": "zip" }

                // Also handle special chars by normalizing?
                // PSGC Cloud seems to use UTF8 properly. 
                // We will store clean name as key.
                zipMap[name.toLowerCase()] = entry.zip_code;

                // Also store normalized version?
                const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                if (normalized !== name.toLowerCase()) {
                    zipMap[normalized] = entry.zip_code;
                }
            }
        };

        cities.forEach(processEntry);
        municipalities.forEach(processEntry);

        fs.writeFileSync(outputPath, JSON.stringify(zipMap, null, 2), 'utf8');
        console.log(`Saved ${Object.keys(zipMap).length} zip codes to ${outputPath}`);

    } catch (err) {
        console.error('Error:', err);
    }
}

main();
