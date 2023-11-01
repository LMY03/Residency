const tool = {
    getSaturday() {
        const weekDates = getDatesForWeek();
        const saturdays = weekDates.filter(date => date.getDay() === 6);
        return saturdays.map(date => formatDate(date)).join(', ');
    },
      
    getSunday() {
        const weekDates = getDatesForWeek();
        const sundays = weekDates.filter(date => date.getDay() === 0);
        return sundays.map(date => formatDate(date)).join(', ');
    },
    
    leftJoin: function(members, records, startDate, endDate) {
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
    },

    getTime: function() {
        const currentTime = new Date();
    
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();
    
        // Format the time as "HH:MM:SS"
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    getDate: function() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1
        const day = currentDate.getDate();
    
        // Format the date as "YYYY-MM-DD"
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
  
function getDatesForWeek() {
    const today = new Date();
    const currentDay = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay);

    const dates = [];

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        dates.push(currentDate);
    }
    return dates;
}

module.exports = tool;