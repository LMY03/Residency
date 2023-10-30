const express = require("express");
var path = require('path');

const routes = require('./route.js');

// const session = require('express-session');

const app = new express();
app.use(express.urlencoded({extended: true}));

// View .ejs files 
app.set('view engine', 'ejs');
// app.set('views', 'view'); 

//The path for static files inside the public folders that consist of the CSS, JS and Images
app.use('/public', express.static((__dirname) + '/public'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'views')));

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("server is running at port: " + port);
});

app.use('/', routes);