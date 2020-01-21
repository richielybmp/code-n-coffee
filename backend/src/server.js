const express = require('express');

const app = express();

app.get('/', (req, res) => {
    return res.json({ message: 'Hello' });
});

app.listen(3333);

//aula 2 - 19 minutos