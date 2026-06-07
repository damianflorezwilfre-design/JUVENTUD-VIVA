const fs = require('fs');
const files = [
  'C:/Users/DAMIAN FLOREZ/.gemini/antigravity/scratch/juventud-viva/src/app/(public)/page.tsx',
  'C:/Users/DAMIAN FLOREZ/.gemini/antigravity/scratch/juventud-viva/src/app/(public)/nosotros/page.tsx',
  'C:/Users/DAMIAN FLOREZ/.gemini/antigravity/scratch/juventud-viva/src/app/(public)/programas/page.tsx',
  'C:/Users/DAMIAN FLOREZ/.gemini/antigravity/scratch/juventud-viva/src/app/(public)/noticias/page.tsx',
  'C:/Users/DAMIAN FLOREZ/.gemini/antigravity/scratch/juventud-viva/src/app/(public)/documentos/page.tsx',
  'C:/Users/DAMIAN FLOREZ/.gemini/antigravity/scratch/juventud-viva/src/app/(public)/galeria/page.tsx',
  'C:/Users/DAMIAN FLOREZ/.gemini/antigravity/scratch/juventud-viva/src/app/(public)/contacto/page.tsx'
];
files.forEach(file => {
  if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      if (!content.includes('force-dynamic')) {
        content = 'export const dynamic = "force-dynamic";\n' + content;
        fs.writeFileSync(file, content);
      }
  }
});
console.log('Dynamic flags added');
