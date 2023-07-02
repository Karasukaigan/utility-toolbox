const router = require('express').Router();
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

router.get('/', function (req, res) {
    const directoryPath = path.join(__dirname, '../public/image-result-cache');
    const zipPath = path.join(__dirname, '../public/image-result-cache.zip');

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory(directoryPath, 'image-result-cache');
    archive.finalize();

    // Listening for the completion event, sending the response, and deleting the ZIP file.
    output.on('close', function () {
        res.download(zipPath, 'image-result-cache.zip', function (err) {
            if (err) {
                console.error('Download error:', err);
            }
            fs.unlinkSync(zipPath);
        });
    });
});

module.exports = router;
