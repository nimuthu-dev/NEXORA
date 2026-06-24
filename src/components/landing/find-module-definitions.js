const { execSync } = require('child_process');
const fs = require('fs');

const DEPLOYMENT_URL = 'https://zip-hzlujev2w-nimuthurp-1387s-projects.vercel.app';
const chunks = [
  'static/chunks/bc9e92e6-f2fd3c35173ad6c2.js',
  'static/chunks/ceb9e9aa-646b5dc4c633188f.js',
  'static/chunks/c15bf2b0-52e8419f34af26ab.js',
  'static/chunks/591-574ffef7befcc0c9.js',
  'static/chunks/285-4de8a95aa4d6a663.js',
  'static/chunks/194-ae311bb8dc38e31d.js',
  'static/chunks/619-f072ac750404f9da.js',
  'static/chunks/396-7e9ea8f682553d52.js',
  'static/chunks/913-3c4c1b0584bc5c61.js',
  'static/chunks/871-5bea79587b8fa6ef.js'
];

const moduleIds = ['13807', '91851', '19701', '59338', '50984'];

async function main() {
  for (const chunk of chunks) {
    const url = `${DEPLOYMENT_URL}/_next/${chunk}`;
    try {
      const code = execSync(`npx vercel curl "${url}"`, { maxBuffer: 15 * 1024 * 1024 }).toString();
      
      for (const id of moduleIds) {
        // Look for the module ID definition e.g. "13807:" or "13807:(" or "13807:("
        const pattern1 = `${id}:`;
        if (code.includes(pattern1)) {
          console.log(`Found module ID ${id} in chunk: ${chunk}`);
          // Print some characters around it
          const idx = code.indexOf(pattern1);
          console.log(`--- Module ${id} snippet ---`);
          console.log(code.substring(idx, idx + 400));
          console.log('---------------------------');
        }
      }
    } catch (e) {
      console.error(`Error with ${chunk}:`, e.message);
    }
  }
}

main();
