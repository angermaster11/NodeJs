// Create a Calculator
// Create a new Node.js project named "Calculator".
// On the home page (route "/"), show a welcome message and a link to the calculator page.
// On the "/calculator" page, display a form with two input fields and a "Sum" button.
// When the user clicks the "Sum" button, they should be taken to the "/calculate-result" page, which shows the sum of the two numbers.
// Make sure the request goes to the server.
// Create a separate module for the addition function.
// Create another module to handle incoming requests.
// On the "/calculate-result" page:
// Parse the user input
// Use the addition module to calculate the sum
// Display the result on a new HTML page

// const http = require("http");
const addition = require("./add");
const server = require("./server");


const PORT = 3000;
server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})