const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const emailCode = `

      // Send email notification
      const { sendEmailNotification } = await import('@/lib/email');
      await sendEmailNotification(
        "Nueva Solicitud de Edición - Juventud ViVa",
        "Un editor ha solicitado un cambio. Revisa el portal de administrador.",
        "<p>Un editor ha solicitado un cambio que requiere tu aprobación.</p><p>Puedes revisarlo en el <a href='https://juventud-viva.vercel.app/admin/solicitudes'>panel de administrador (Solicitudes)</a>.</p>"
      );
`;

walkDir('./src/app/api', (filePath) => {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('prisma.editRequest.create(') && !content.includes('sendEmailNotification')) {
      content = content.replace(/await prisma\.editRequest\.create\(\{[\s\S]*?\}\);/g, match => match + emailCode);
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + filePath);
    }
  }
});
