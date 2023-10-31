const ejs = require("ejs");
const csv = require('./csv');

const tool = require('./tool');

const report = {
    render: function(req, res) {
        csv.records;
        list = csv.members;
        res.render('report', {
            
        });
    }
}
module.exports = report;