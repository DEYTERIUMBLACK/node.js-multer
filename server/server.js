const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use('/public', express.static('public'));

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get('host')}/public/${req.file.filename}`;

      const dbJson = await fs.readFile('db.json', 'utf-8');
      const data = JSON.parse(dbJson);

      data.images.push(imageUrl);

      await fs.writeFile('db.json', JSON.stringify(data, null, 2));

      res.json({ url: imageUrl });
    } else {
      res.status(400).json({ error: 'No file uploaded.' });
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
