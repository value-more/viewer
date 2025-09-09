const fs = require('fs');
const path = require('path');

const localesDir = path.join('public', 'locales');

function validateJSONFiles(dir) {
    const errors = [];

    fs.readdirSync(dir).forEach((subdir) => {
        const subPath = path.join(dir, subdir);
        if (!fs.statSync(subPath).isDirectory()) {
            return;
        }
        // locale dirs 'en', 'de', ..
        fs.readdirSync(subPath).forEach((file) => {
            if (!file.endsWith('.json')) return;
            const filePath = path.join(subPath, file);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                JSON.parse(content);
            } catch (err) {
                errors.push(`❌ Invalid JSON: ${filePath}\n   ${err.message}`);
            }
        });
    });

    if (errors.length > 0) {
        console.error('\n🚨 JSON Validation Errors:\n');
        errors.forEach((e) => console.error(e));
        process.exit(1);
    } else {
        console.log('✅ All translation JSON files are valid!');
    }
}

validateJSONFiles(localesDir);
