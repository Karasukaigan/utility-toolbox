const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();

const watermarkRemove = require('./routes/watermark-remove');
const watermarkRemoveRgb = require('./routes/watermark-remove-rgb');
const watermarkAdd = require('./routes/watermark-add');
const pdfToImages = require('./routes/pdf-to-images');
const imagesToPdf = require('./routes/images-to-pdf');
const imageFormatConverter = require('./routes/image-format-converter');
const clearImageCacheModule = require('./routes/clear-image-cache');
const clearPdfCacheModule = require('./routes/clear-pdf-cache');
const downloadResultImagesRouter = require('./routes/download-result-images');

const port = process.env.PORT;

app.use(express.static('public'));

app.use('/watermark-remove', watermarkRemove);
app.use('/watermark-remove-rgb', watermarkRemoveRgb);
app.use('/watermark-add', watermarkAdd);
app.use('/pdf-to-images', pdfToImages);
app.use('/images-to-pdf', imagesToPdf);
app.use('/image-format-converter', imageFormatConverter);
app.use('/download-result-images', downloadResultImagesRouter);
app.use('/clear-image-cache', clearImageCacheModule);
app.use('/clear-pdf-cache', clearPdfCacheModule);

app.get('/image-format-conversion-tool', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'image-format-conversion-tool.html')); });
app.get('/remove-watermark-tool', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'remove-watermark-tool.html')); });
app.get('/remove-watermark-tool-rgb', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'remove-watermark-tool-rgb.html')); });
app.get('/add-watermark-tool-image', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'add-watermark-tool-image.html')); });
app.get('/add-watermark-tool-text', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'add-watermark-tool-text.html')); });
app.get('/pdf2image-tool', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'pdf2image-tool.html')); });
app.get('/image2pdf-tool', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'image2pdf-tool.html')); });

app.listen(port, () => {
    console.log(`The utility toolbox has been started. Please access the following address in your browser: http://127.0.0.1:${port}`);
});

