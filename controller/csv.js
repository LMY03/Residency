const csvp = require('csv-parser');
const fs = require('fs');

const csv = {
    memberPath: './public/csv/members.csv',
    recordPath: './public/csv/records.csv',
    members: [],
    records: [],
    append: function(path, dataToAppend) {
        fs.readFile(path, 'utf8', (err, fileData) => {
            if (err) {
                console.error("Error reading CSV file:", err);
                return;
            }
    
            // Combine the existing data and new data
            const updatedData = fileData + '\n' + dataToAppend; // Assuming each new entry is on a new line
    
            // Write the updated data back to the CSV file
            fs.writeFile(path, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error("Error writing to CSV file:", err);
                } else {
                    console.log("Data appended to CSV file.");
                }
            });
        });
    },
    edit: function(path, func) {
        fs.readFile(path, 'utf8', (err, fileData) => {
            if (err) {
                console.error('Error reading the file:', err);
                return;
            }
        
            const lines = fileData.split('\n');
            const headers = lines[0].split(','); // Assuming the first row contains headers
            const data = lines.slice(1).map(line => {
                const values = line.split(',');
                return headers.reduce((obj, header, index) => {
                    obj[header] = values[index];
                    return obj;
                }, {});
            });
            
            func(data);
        
            // Join the data back into a CSV string
            const updatedLines = [headers.join(',')].concat(data.map(row => Object.values(row).join(',')));
            const updatedData = updatedLines.join('\n');
            
            // Write the updated data back to the CSV file
            fs.writeFile(path, updatedData, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to the file:', err);
                } else {
                    console.log('Row updated successfully.');
                }
            });
        });
    }
}

function loadCSV(list, path) {
    fs.createReadStream(path)
        .pipe(csvp())
        .on('data', (data) => list.push(data));
}

function initialize(list, path) {
    loadCSV(list, path);
    fs.watch(path, (event) => {
        list.length = 0;
        if (event === 'change') loadCSV(list, path);
    });
}

initialize(csv.members, csv.memberPath);
initialize(csv.records, csv.recordPath);

module.exports = csv;