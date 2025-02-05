const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

app.get('/hello', (req, res) => {
    res.send('Hello World from Backend!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
