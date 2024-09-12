const express = require('express');
const cors = require('cors');
const app = express();

const fs = require('fs');

const multer = require('multer');
const PSD = require('psd');
const sharp = require('sharp');
const path = require('path');
// const { log } = require('console');
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.post('/upload', upload.single('file'), (req, res) => {
  const psdPath = req.file.path;
  

  PSD.open(psdPath)
    .then(psd => {
      psd.image.saveAsPng(psdPath + '.png')  // Save the PNG to a temporary location
        .then(() => {
          // Read the saved PNG file into sharp for conversion to JPEG
          sharp(psdPath + '.png')
            .jpeg({ quality: 80 })
            .toBuffer()
            .then(data => {
              res.set('Content-Type', 'image/jpeg');
              console.log(data);
              res.send(data);
            

              // Clean up the temporary files
              fs.unlink(psdPath, (err) => {
                if (err) console.error('Failed to delete temporary PSD file:', err);
              });
              fs.unlink(psdPath + '.png', (err) => {
                if (err) console.error('Failed to delete temporary PNG file:', err);
              });
            })
            .catch(err => {
              console.error('Error converting PNG to JPG:', err);
              res.status(500).send('Error processing image');
            });
        })
        .catch(err => {
          console.error('Error saving PNG from PSD:', err);
          res.status(500).send('Error saving PNG from PSD');
        });
    })
    .catch(err => {
      console.error('Error reading PSD file:', err);
      res.status(500).send('Error reading PSD file');
    });
    console.log("Request Recieved");    
});



app.listen(9999, ()=>{
    console.log("Server Listening in  PORT 9999");
    
})