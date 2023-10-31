const ejs = require("ejs");
const csv = require('./csv');

const tool = require('./tool');

const residency = {
    render: function(req, res) {
        let dailyRecords = leftJoin(csv.members, csv.dailyRecords, tool.getDate(), tool.getDate());
        sort(dailyRecords);
        dailyRecords.reverse();
        dailyRecords = dailyRecords.slice(0, 6);
        res.render('index', {dailyRecords});
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

function sort(records) {
    records.sort((a, b) => {
        const aTime = a.ClockOutTime || a.ClockInTime;
        const bTime = b.ClockOutTime || b.ClockInTime;
        return aTime.localeCompare(bTime);
    });
}

function leftJoin(members, records, startDate, endDate) {
    const result = [];

    for (const record of records) {
      // Check if the record's date is within the specified range
      if (record.Date >= startDate && record.Date <= endDate) {
        const matchingMember = members.find((member) => member.ID == record.ID );
        if (matchingMember) {
            // Combine record and member data
            const combinedData = { ...matchingMember, ...record };
            if (combinedData.Position === "Kasapi" || combinedData.Position === 'Senyor na Kasapi' || combinedData.Position === 'Korespondente') combinedData.Position += ' ng ' + combinedData.Section;
            result.push(combinedData);
        }
      }
    }
    return result;
  }

function clockOut(id) {
    console.log("clockout");
    const date = tool.getDate();
    const clockOutTime = tool.getTime();
    const indexToMove = csv.dailyRecords.findIndex((record) => record.ID == id);
    if (indexToMove !== -1) {
        // Remove the record from its current position
        const recordToMove = csv.dailyRecords.splice(indexToMove, 1)[0];
        recordToMove.ClockOutTime = clockOutTime;
        
        // Push the record to the end of the array
        csv.dailyRecords.push(recordToMove);
    }
    csv.edit(csv.recordPath, function(records) {
        const targetRow = records.find(row => row.ID === id && row.Date == date);
        if (targetRow) targetRow.ClockOutTime = clockOutTime;
    });
}

function clockIn(id) {
    console.log("clockin");
    const date = tool.getDate();
    const time = tool.getTime();
    csv.dailyRecords.push({
        ID: id, 
        Date: date,
        ClockInTime: time,
    })
    csv.append(csv.recordPath, id + "," + date + "," + time);
}

function hasMember(id, members) {
    for (const row of members) if (`${row.ID}` == id) return row;
}

function hasClockedIn(id, records) {
    for (const row of records) if (`${row.ID}` == id && `${row.Date}` == tool.getDate()) return row;
}

module.exports = residency;