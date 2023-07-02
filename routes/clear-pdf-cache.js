const fs = require('fs');
const path = require('path');
const router = require('express').Router();

function clearPdfCache() {
    const paths = [
        path.join(__dirname, '..', 'public', 'image-result-cache'),
        path.join(__dirname, '..', 'public', 'pdf-cache')
    ];

    paths.forEach((dirPath) => {
        fs.readdirSync(dirPath).forEach((file) => {
            const filePath = path.join(dirPath, file);
            fs.unlinkSync(filePath);
        });
    });
}

router.get('/', (req, res) => {
    clearPdfCache();
    res.send('PDF cache cleared.');
});

module.exports = router;
