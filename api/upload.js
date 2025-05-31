const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
    try {
        if (!req.headers['content-type'].includes('multipart/form-data')) {
            return res.status(400).json({ error: 'Invalid content type' });
        }
        
        const author = req.body.author;
        if (!author || !req.files || !req.files.audio) {
            return res.status(400).json({ error: 'Author and audio file are required' });
        }
        
        const audioFile = req.files.audio;
        const fileExt = path.extname(audioFile.name);
        const allowedExtensions = ['.mp3', '.m4a', '.ogg', '.wav'];
        
        if (!allowedExtensions.includes(fileExt.toLowerCase())) {
            return res.status(400).json({ error: 'Invalid file type' });
        }
        
        // Cria a pasta uploads se não existir
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }
        
        // Gera um nome único para o arquivo (author_timestamp_uuid.ext)
        const safeAuthor = encodeURIComponent(author).replace(/%20/g, '_');
        const timestamp = Date.now();
        const uniqueName = `${safeAuthor}_${timestamp}_${uuidv4()}${fileExt}`;
        const filePath = path.join(uploadsDir, uniqueName);
        
        // Move o arquivo para a pasta uploads
        await audioFile.mv(filePath);
        
        res.status(200).json({ 
            success: true,
            filename: uniqueName
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
