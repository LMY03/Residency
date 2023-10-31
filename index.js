const express = require("express");

const routes = require('./route.js');

const app = new express();
app.use(express.urlencoded({extended: true}));

// View .ejs files 
app.set('view engine', 'ejs');
// app.set('views', 'view'); 

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log("server is running at port: " + port);
});

app.use('/', routes);