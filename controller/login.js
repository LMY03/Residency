const ejs = require("ejs");

const login = {
    render: function(req, res) {
        res.render('login');
    },
    validate: function(req, res) {
        res.redirect("/report");
    }
}

module.exports = login;