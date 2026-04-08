// Create a page that shows a navigation bar of Myntra 
// with the following links:

// A. Home
// B. Men
// C. Women
// D. Kids
// E. Cart

// Clicking on each link page should navigate to that page and 
// a “welcome to section” text is shown there.

const http = require("http");

const server = http.createServer((req,res)=>{
    res.setHeader("Content-Type","text/html");
    res.write("<h1>Welcome to Myntra</h1>");
    res.write("<nav><a href='/home'>Home</a> | <a href='/men'>Men</a> | <a href='/women'>Women</a> | <a href='/kids'>Kids</a> | <a href='/cart'>Cart</a></nav>");
    if(req.url === "/home"){
        res.write("<h2>Welcome to Home Section</h2>");
    } else if(req.url === "/men"){
        res.write("<h2>Welcome to Men Section</h2>");
    } else if(req.url === "/women"){
        res.write("<h2>Welcome to Women Section</h2>");
    } else if(req.url === "/kids"){
        res.write("<h2>Welcome to Kids Section</h2>");
    } else if(req.url === "/cart"){
        res.write("<h2>Welcome to Cart Section</h2>");
    } else {
        res.write("<h2>Page Not Found</h2>");
    }
    res.end();
})

const PORT = 3000;
server.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})