const fs = require('fs');
function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = dir + '/' + file;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
}
const allFiles = getFiles('C:/Users/DAMIAN FLOREZ/.gemini/antigravity/scratch/juventud-viva/src/app/api');
let count = 0;
allFiles.forEach(file => {
  if (file.endsWith('route.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('export async function GET') && !content.includes('force-dynamic')) {
      content = 'export const dynamic = "force-dynamic";\n' + content;
      fs.writeFileSync(file, content);
      count++;
    }
  }
});
console.log('Fixed ' + count + ' API routes.');
