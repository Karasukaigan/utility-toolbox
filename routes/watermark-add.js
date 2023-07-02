const { exec } = require('child_process');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const scriptPath = path.join(__dirname, '..', 'scripts', 'watermark_add.py');
const router = require('express').Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'images') {
            cb(null, 'public/image-cache');
        } else if (file.fieldname === 'watermark') {
            cb(null, 'public/watermark-cache');
        } else {
            res.status(500).json({ error: 'Watermark add failed' });
        }
    },
    filename: function (req, file, cb) {
        const decodedFileName = decodeURIComponent(file.originalname);
        cb(null, decodedFileName);
    },
});
const upload = multer({ storage: storage });

function addWatermark(inputPath, outputPath, watermarkPath, watermarkType, watermarkLayout) {
    return new Promise((resolve, reject) => {
        const command = `python ${scriptPath} ${inputPath} ${outputPath} ${watermarkPath} ${watermarkType} ${watermarkLayout}`;
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

router.post('/', upload.fields([{ name: 'images' }, { name: 'watermark' }]), (req, res) => {
    const inputPath = 'public/image-cache';
    const outputPath = 'public/image-result-cache';
    const watermarkType = req.body['watermark-type'];
    const watermarkLayout = req.body['watermark-layout'];
    let watermarkPath;
    if (watermarkType === 'image') {
        watermarkPath = 'public/watermark-cache';
    } else if (watermarkType === 'text') {
        watermarkPath = req.body['watermark'];
    } else {
        res.status(500).json({ error: 'Watermark add failed' });
        return;
    }
    
    addWatermark(inputPath, outputPath, watermarkPath, watermarkType, watermarkLayout)
        .then((result) => {
            res.json(result);
        })
        .catch((error) => {
            console.error('Watermark add error:', error);
            res.status(500).json({ error: 'Watermark add failed' });
        });
});

module.exports = router;