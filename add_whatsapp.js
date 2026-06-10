const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const whatsappCode = `

      // Notify via WhatsApp
      const { sendWhatsAppNotification } = await import('@/lib/whatsapp');
      await sendWhatsAppNotification(\`⚠️ *Nueva Solicitud de Edición*\\n\\nUn administrador secundario ha solicitado permiso para editar o borrar un registro.\\n\\n*Acción:* \${action}\\n*Módulo:* \${modelName}\\n\\nRevisa el panel de administrador para aprobar o rechazar.\`);
`;

walkDir('./src/app/api', (filePath) => {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('sendEmailNotification') && content.includes('Nueva Solicitud de Edición') && !content.includes('sendWhatsAppNotification')) {
      content = content.replace(/await sendEmailNotification\([\s\S]*?\);/g, match => match + whatsappCode);
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + filePath);
    }
  }
});
