const { initializeApp } = require('firebase/app');
const { getStorage, uploadBytes, ref, getDownloadURL } = require('firebase/storage');

const firebaseConfig = { /* suas credenciais */ };
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

module.exports = async (req, res) => {
  try {
    const file = req.files.audio;
    const storageRef = ref(storage, `audios/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file.data);
    const url = await getDownloadURL(storageRef);
    
    res.json({ url, author: req.body.author });
  } catch (error) {
    res.status(500).json({ error: "Erro no upload" });
  }
};
