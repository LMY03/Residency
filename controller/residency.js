const ejs = require("ejs");
const csv = require('./csv');

const tool = require('./tool');

const residency = {
    render: function(req, res) {
        res.render('index');
    },
    time: function(req, res) {
        const time = tool.getTime();
        res.json({ time });
    },
    run: function(req, res) {
        const id = req.body.input;
        const members = csv.members;
        const records = csv.records;
        if (hasMember(id, members))
            if (hasClockedIn(id, records)) clockOut(id);
            else clockIn(id);
        res.redirect("/");
    }
}

function clockOut(id) {
    console.log("clockout");
    csv.edit(csv.recordPath, function(records) {
        const targetRow = records.find(row => row.ID === id && row.Date == tool.getDate());
        if (targetRow) targetRow.ClockOutTime = tool.getTime();
    });
}

function clockIn(id) {
    console.log("clockin");
    csv.append(csv.recordPath, id + "," + tool.getDate() + "," + tool.getTime());
}

function hasMember(id, members) {
    for (const row of members) if (`${row.ID}` == id) return row;
}

function hasClockedIn(id, records) {
    for (const row of records) if (`${row.ID}` == id && `${row.Date}` == tool.getDate()) return row;
}

module.exports = residency;