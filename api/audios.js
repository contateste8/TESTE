const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    try {
        const uploadsDir = path.join(__dirname, '../uploads');
        
        // Verifica se a pasta uploads existe
        if (!fs.existsSync(uploadsDir)) {
            return res.json([]);
        }
        
        const files = fs.readdirSync(uploadsDir);
        const audios = files.map(file => {
            const stats = fs.statSync(path.join(uploadsDir, file));
            
            // Extrai o nome do autor do nome do arquivo (formato: author_timestamp.ext)
            const [author, ...rest] = file.split('_');
            const originalName = rest.join('_');
            
            return {
                filename: file,
                author: decodeURIComponent(author),
                uploadDate: stats.birthtime,
                mimetype: getMimeType(path.extname(file))
            };
        });
        
        // Ordena do mais recente para o mais antigo
        audios.sort((a, b) => b.uploadDate - a.uploadDate);
        
        res.json(audios);
    } catch (error) {
        console.error('Error fetching audio list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

function getMimeType(ext) {
    const types = {
        '.mp3': 'audio/mpeg',
        '.m4a': 'audio/mp4',
        '.ogg': 'audio/ogg',
        '.wav': 'audio/wav'
    };
    return types[ext.toLowerCase()] || 'audio/mpeg';
}
