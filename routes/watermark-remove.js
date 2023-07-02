const { exec } = require('child_process');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const scriptPath = path.join(__dirname, '..', 'scripts', 'watermark_remove.py');
const router = require('express').Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image-cache');
    },
    filename: function (req, file, cb) {
        const decodedFileName = decodeURIComponent(file.originalname);
        cb(null, decodedFileName);
    },
});
const upload = multer({ storage: storage });

function removeWatermark(inputPath, outputPath, grayscaleMin, grayscaleMax) {
    return new Promise((resolve, reject) => {
        const command = `python ${scriptPath} ${inputPath} ${outputPath} ${grayscaleMin} ${grayscaleMax}`;
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

router.post('/', upload.array('images'), (req, res) => {
    const grayscaleMin = req.body.minGrayscale;
    const grayscaleMax = req.body.maxGrayscale;
    const inputPath = 'public/image-cache';
    const outputPath = 'public/image-result-cache';
    removeWatermark(inputPath, outputPath, grayscaleMin, grayscaleMax)
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            console.error('Watermark removal error:', error);
            res.status(500).json({ error: 'Watermark removal failed' });
        });
});

module.exports = router;
