const tool = {
    combineArrays: function(records, members) {
        const combinedData = [];
      
        for (const record of records) {
            const matchingMember = members.find((member) => member.ID === record.ID);

            if (matchingMember) {
                matchingMember.ID = record.ID;
                const combinedEntry = {
                ...record,
                Name: matchingMember.Name,
                Position: matchingMember.Position,
                Section: matchingMember.Section,
                };
                combinedData.push(combinedEntry);
            }
        }
      
        return combinedData;
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

module.exports = tool;