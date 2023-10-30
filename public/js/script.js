const employeeIDInput = document.getElementById('input');
function handleInput() {
    const inputValue = employeeIDInput.value;

    // Check if the input is an 8-digit number
    if (/^\d{8}$/.test(inputValue)) {
        // Run your custom function here
        // For example, you can display a message, record the time in, etc.
        // console.log(`Employee ID entered: ${inputValue}`);
        document.getElementById('myForm').submit();
    }
}
employeeIDInput.addEventListener('input', handleInput);

document.addEventListener('DOMContentLoaded', function () {
    const timePlaceholder = document.getElementById('timePlaceholder');

    function updateTime() {
        fetch('/get-time') // Send an AJAX request to the server
            .then(response => response.json())
            .then(data => {
                const time = data.time;
                timePlaceholder.textContent = time; // Update the content on the page
            })
            .catch(error => {
                console.error('Error fetching time:', error);
            });
    }

    // Initial time update
    updateTime();

    // Update the time every second (1000 milliseconds)
    setInterval(updateTime, 1000);
});