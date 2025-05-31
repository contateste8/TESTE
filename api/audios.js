const fs = require('fs');
  const path = require('path');

  module.exports = async (req, res) => {
    try {
      const uploadsDir = path.join(__dirname, '../uploads');
      
      if (!fs.existsSync(uploadsDir)) {
        return res.json([]); // Retorna vazio se não houver pasta
      }

      const files = fs.readdirSync(uploadsDir)
        .filter(file => ['.mp3', '.m4a', '.ogg'].includes(path.extname(file).toLowerCase()));

      const audios = files.map(file => {
        const [author, ...rest] = file.split('_');
        return {
          filename: file,
          author: decodeURIComponent(author),
          url: `/uploads/${file}`
        };
      });

      res.json(audios);
    } catch (error) {
      console.error('Erro na API:', error);
      res.status(500).json({ error: "Erro ao carregar áudios" });
    }
  };
