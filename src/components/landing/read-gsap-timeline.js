const fs = require('fs');

const code = fs.readFileSync('/Users/nimuthupathirathne/Desktop/zip/src/components/landing/found-code.js', 'utf8');

// The GSAP timeline usually starts with something like:
// gsap.timeline({ ... })
// Let's find "gsap.timeline" or "ScrollTrigger" or the timeline initialization inside found-code.js
// and print the surrounding code block.
const idx = code.indexOf('scrollTrigger:');
if (idx !== -1) {
  const start = Math.max(0, idx - 800);
  const end = Math.min(code.length, idx + 2500);
  console.log('--- GSAP TIMELINE CODE ---');
  console.log(code.substring(start, end));
  console.log('--------------------------');
} else {
  console.log('scrollTrigger not found in code');
}
