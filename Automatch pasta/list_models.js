import fs from 'fs';

async function run() {
    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDV8f0SyYh_9m83KpWYFmk1kMHCfRc9FwE");
        const data = await response.json();
        fs.writeFileSync('models.json', JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(error);
    }
}
run();
