document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const audioContainer = document.getElementById('audioContainer');
    
    // Carregar áudios quando a página é aberta
    loadAudios();
    
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const authorName = document.getElementById('authorName').value;
        const audioFile = document.getElementById('audioFile').files[0];
        
        if (authorName && audioFile) {
            uploadAudio(authorName, audioFile);
        }
    });
    
    async function uploadAudio(authorName, audioFile) {
        const formData = new FormData();
        formData.append('author', authorName);
        formData.append('audio', audioFile);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                alert('Áudio enviado com sucesso!');
                uploadForm.reset();
                loadAudios();
            } else {
                throw new Error('Falha no upload');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar áudio');
        }
    }
    
    async function loadAudios() {
        try {
            const response = await fetch('/api/audios');
            const audios = await response.json();
            
            audioContainer.innerHTML = '';
            
            if (audios.length === 0) {
                audioContainer.innerHTML = '<p>Nenhum áudio publicado ainda.</p>';
                return;
            }
            
            audios.forEach(audio => {
                const audioItem = document.createElement('div');
                audioItem.className = 'audio-item';
                
                audioItem.innerHTML = `
                    <h3>${audio.author}</h3>
                    <audio controls>
                        <source src="/uploads/${audio.filename}" type="${audio.mimetype}">
                        Seu navegador não suporta o elemento de áudio.
                    </audio>
                    <p>Publicado em: ${new Date(audio.uploadDate).toLocaleString()}</p>
                `;
                
                audioContainer.appendChild(audioItem);
            });
        } catch (error) {
            console.error('Erro ao carregar áudios:', error);
            audioContainer.innerHTML = '<p>Erro ao carregar áudios.</p>';
        }
    }
});
