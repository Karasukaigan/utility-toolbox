const { exec } = require('child_process');
const multer = require('multer');
const path = require('path');
const router = require('express').Router();
const scriptPath = path.join(__dirname, '..', 'scripts', 'img2pdf.py');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image-result-cache');
    },
    filename: function (req, file, cb) {
        const decodedFileName = decodeURIComponent(file.originalname);
        cb(null, decodedFileName);
    },
});
const upload = multer({ storage: storage });

function convertImagesToPdf(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        const command = `python ${scriptPath} ${inputPath} ${outputPath}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

router.post('/', upload.array('images'), (req, res) => {
    const pdfFileName = req.body.pdfFileName;
    const inputPath = 'public/image-result-cache';
    const outputPath = `public/pdf-cache/${pdfFileName}.pdf`;
    convertImagesToPdf(inputPath, outputPath)
        .then(() => {
            res.json({ success: true, pdfPath: outputPath });
        })
        .catch(error => {
            console.error('Error converting images to PDF:', error);
            res.status(500).json({ error: 'Failed to convert images to PDF' });
        });
});

module.exports = router;
