const fs = require('fs');
const files = [
  'js/state.js', 'js/utils.js', 'js/audio.js', 
  'js/modes/dzialania.js', 'js/modes/rozklad.js', 'js/modes/wzory.js', 'js/modes/pitagoras.js',
  'js/keyboard.js', 'js/app.js'
];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  // Remove import { block } from 'path';
  c = c.replace(/import[\s\S]*?from\s+['"][^'"]+['"];?\n?/gi, '');
  // Remove import(...).then(m => m.fn(...));
  c = c.replace(/import\([^)]*\)\.then\([^\)]*\s*=>\s*[a-zA-Z0-9_]+\.(odswiezTabyA\([^)]*\))\);?/g, '$1;');
  // Remove export keywords
  c = c.replace(/^export\s+/gm, '');
  fs.writeFileSync(f, c);
});
console.log('Fixed JS exports for local file execution.');
