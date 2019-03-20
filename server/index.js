const path = require('path');
const express = require('express');
const { spriteHandler } = require('./routes');

const app = express();
const publicPath = path.join(__dirname, '..');

app.use(express.static(publicPath));

app.post('/', spriteHandler)

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'svg-sprite-index.html'));
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`app is up on port ${port} - ${new Date()}`);
});
