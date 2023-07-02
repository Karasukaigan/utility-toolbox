const multer = require('multer');
const path = require('path');
const router = require('express').Router();
const sharp = require('sharp');

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

function convertImageFormat(inputPath, outputPath, targetFormat) {
    return new Promise((resolve, reject) => {
        sharp(inputPath)
            .toFormat(targetFormat)
            .toFile(outputPath, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
    });
}

router.post('/', upload.array('images'), async (req, res) => {
    try {
        const targetFormat = req.body.targetFormat;
        const outputPath = 'public/image-result-cache';

        const convertedImages = [];
        for (const file of req.files) {
            const inputPath = file.path;
            const inputFilename = path.parse(file.filename).name;
            const outputFilename = `${inputFilename}.${targetFormat}`;
            const outputFile = path.join(outputPath, outputFilename);

            await convertImageFormat(inputPath, outputFile, targetFormat);

            convertedImages.push(`/image-result-cache/${outputFilename}`);
        }

        res.json({ images: convertedImages });
    } catch (error) {
        console.error('Image format conversion error:', error);
        res.status(500).json({ error: 'Image format conversion failed' });
    }
});

module.exports = router;
