const { exec } = require('child_process');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = require('express').Router();

const scriptPath = path.join(__dirname, '..', 'scripts', 'pdf2img.py');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/pdf-cache');
    },
    filename: function (req, file, cb) {
        const decodedFileName = decodeURIComponent(file.originalname);
        const sanitizedFileName = decodedFileName.replace(/\s/g, '_');
        cb(null, sanitizedFileName);
    },
});
const upload = multer({ storage: storage });

function convertToImages(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        const command = `python ${scriptPath} ${inputPath} ${outputPath}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                const processedImages = getProcessedImages(outputPath);
                resolve({ images: processedImages });
            }
        });
    });
}

function getProcessedImages(outputPath) {
    const imageFiles = fs.readdirSync(outputPath).filter((file) => file.endsWith('.jpg'));
    const processedImages = imageFiles.map((file) => `/image-result-cache/${file}`);
    return processedImages;
}

router.post('/', upload.single('pdfFile'), (req, res) => {
    const pdfFilePath = req.file.path;
    const outputPath = 'public/image-result-cache';

    convertToImages(pdfFilePath, outputPath)
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            console.error('PDF to Images conversion error:', error);
            res.status(500).json({ error: 'PDF to Images conversion failed' });
        });
});

module.exports = router;
