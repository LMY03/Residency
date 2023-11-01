const ejs = require("ejs");
const csv = require('./csv');

const tool = require('./tool');

const report = {
    render: function(req, res) {
        // Parse query parameters from the URL
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;

        if (!startDate) startDate = tool.getSunday();
        if (!endDate) endDate = tool.getSaturday();

        const reports = generateReport(startDate, endDate);
        const sectionReports = generateSectionReports(reports);
        res.render('report', {
            defaultStart: startDate,
            defaultEnd: endDate,
            reports: reports,
            chartScript: appendChart(sectionReports)
        });
    },
}

function appendChart(sectionReports) {
    return `
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
            document.addEventListener("DOMContentLoaded", function () {
                const data = ${JSON.stringify(sectionReports)}; // Serialize the data as JSON
                const labels = data.map((item) => item.Section);
                const values = data.map((item) => item.Residency);

                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Residency',
                                data: values,
                                backgroundColor: [
                                    '#3C7F72',  // Balita 
                                    '#7A5EA8',  // Isports 
                                    '#242223',  // Bayan
                                    '#DC6874',  // BnK
                                    '#083b73',  // Retrato
                                    '#fad02c',  // Sining
                                    '#f9943b',  // IT
                                ],
                                borderColor: [
                                    '#63B98F',
                                    '#9C80C8',
                                    '#474746',
                                    '#E37E8B',
                                    '#2D6BBF',
                                    '#FEEC61',
                                    '#FFB561',
                                ],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    },
                });
            });
        </script>
    `;
}



function generateSectionReports(records) {
    // const reports = [];
    const reports = [
        { Section: 'Balita',  Residency: '1000' },
        { Section: 'Isports', Residency: '0' },
        { Section: 'Bayan',   Residency: '890' },
        { Section: 'BnK',     Residency: '750' },
        { Section: 'Retrato', Residency: '700' },
        { Section: 'Sining',  Residency: '900' },
        { Section: 'IT',      Residency: '1000' },
    ]
    for (const record of records) {
        let report = reports.find((report) => report.Section === record.Section);
        if (report) report.Residency = add(report.Residency, record.Residency);
        else {
            report = {
                Section: record.Section,
                Residency: record.Residency
            }
            reports.push(report);
        }
    }
    return reports;
}

function generateReport(startDate, endDate) {
    const reports = [];
    const records = tool.leftJoin(csv.members, csv.records, startDate, endDate);
    for (const record of records) {
        if (record.Date >= startDate && record.Date <= endDate) {
            // console.log(record);
            if (!record.EB && !record.Position.includes("Senyor") && record.ClockOutTime) {
                let report = csv.findRecord(reports, record);
                const residency = subtractTime(record.ClockOutTime, record.ClockInTime);
                if (report) report.Residency = add(report.Residency, residency);
                else {
                    report = {
                        ID: record.ID,
                        Name: record.Name,
                        Position: record.Position,
                        Section: record.Section,
                        Residency: residency
                    }
                    reports.push(report);
                }
            }
        }
    }
    return reports;
}

function add(value1, value2) {
    return (parseFloat(value1) + parseFloat(value2)).toFixed(2);
}

function subtractTime(time1, time2) {
    const time1Parts = time1.split(':');
    const time2Parts = time2.split(':');
  
    const hours1 = parseInt(time1Parts[0], 10);
    const minutes1 = parseInt(time1Parts[1], 10);
    const seconds1 = parseInt(time1Parts[2], 10);
  
    const hours2 = parseInt(time2Parts[0], 10);
    const minutes2 = parseInt(time2Parts[1], 10);
    const seconds2 = parseInt(time2Parts[2], 10);
  
    const totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1;
    const totalSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2;
  
    const differenceInSeconds = totalSeconds1 - totalSeconds2;
    const differenceInMinutes = differenceInSeconds / 60;
  
    return differenceInMinutes.toFixed(2);
  }

module.exports = report;