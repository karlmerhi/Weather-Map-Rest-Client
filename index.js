const HTTP_PORT = 8080;
const express = require("express");
//const path = require('path');
const { engine } = require('express-handlebars');
const app = express();

app.use(express.static(__dirname + '/public'));

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

// routes
app.get('/', (req, res) => {
    res.render('home', {
        layout: false
    });
});

app.listen(HTTP_PORT, onHttpStart);