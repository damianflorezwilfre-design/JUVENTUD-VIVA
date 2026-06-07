const fs = require('fs');
const paths = [
  'src/app/(public)/contacto/page.tsx',
  'src/app/(public)/documentos/page.tsx',
  'src/app/(public)/galeria/page.tsx',
  'src/app/(public)/nosotros/page.tsx',
  'src/app/(public)/noticias/page.tsx',
  'src/app/(public)/page.tsx',
  'src/app/(public)/programas/page.tsx'
];

for (let p of paths) {
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace('export const dynamic = "force-dynamic";\r\n"use client"', '"use client"\r\nexport const dynamic = "force-dynamic";');
  content = content.replace('export const dynamic = "force-dynamic";\n"use client"', '"use client"\nexport const dynamic = "force-dynamic";');
  fs.writeFileSync(p, content);
}
console.log("Fixed directives in 7 files");
