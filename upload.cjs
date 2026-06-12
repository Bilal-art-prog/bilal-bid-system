const fs = require('fs');
const path = require('path');
const token = process.env.GH_TOKEN;
const owner = 'Bilal-art-prog';
const repo = 'bilal-bid-system';

function walk(dir, base = '') {
  let files = [];
  for (const f of fs.readdirSync(dir)) {
    if (f === 'node_modules' || f === '.git' || f === 'project.zip' || f === 'upload.js') continue;
    const full = path.join(dir, f);
    const rel = base ? base + '/' + f : f;
    if (fs.statSync(full).isDirectory()) files = files.concat(walk(full, rel));
    else files.push({ full, rel });
  }
  return files;
}

(async () => {
  const files = walk('.');
  console.log('Total files:', files.length);
  for (const { full, rel } of files) {
    const content = fs.readFileSync(full).toString('base64');
    const url = 'https://api.github.com/repos/' + owner + '/' + repo + '/contents/' + rel;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': 'token ' + token,
        'Content-Type': 'application/json',
        'User-Agent': 'bolt'
      },
      body: JSON.stringify({ message: 'add ' + rel, content })
    });
    console.log(rel, res.status);
  }
  console.log('DONE');
})();
