const fs = require('fs');
const path = require('path');
const router = require('express').Router();

function clearImageCache() {
    const paths = [
        path.join(__dirname, '..', 'public', 'image-cache'),        
        path.join(__dirname, '..', 'public', 'image-result-cache'), 
        path.join(__dirname, '..', 'public', 'watermark-cache')     
    ];

    paths.forEach((dirPath) => {
        fs.readdirSync(dirPath).forEach((file) => {
            const filePath = path.join(dirPath, file);
            fs.unlinkSync(filePath);
        });
    });
}

// Clearing the image cache directory.
router.get('/', (req, res) => {
    clearImageCache();
    res.send('Image cache cleared.');
});

module.exports = router;
