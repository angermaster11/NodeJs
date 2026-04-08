const http = require("http");
const addition = require("./add");

const server = http.createServer((req,res)=>{
    res.setHeader("Content-Type","text/html");
    res.write("<h1>Welcome to Calculator</h1>");
    res.write("<nav><a href='/'>Home</a> | <a href='/calculator'>Calculator</a></nav>");
    if(req.url === "/"){
        res.write("<h2>Welcome to Home Page</h2>");
    } else if(req.url === "/calculator"){
        res.write(`
            <form action="/calculate-result" method="POST">
                <input type="number" name="num1" placeholder="Enter first number" required>
                <input type="number" name="num2" placeholder="Enter second number" required>
                <button type="submit">Sum</button>
            </form>
        `);

        

        
    }
    else if (req.url === "/calculate-result" && req.method === "POST"){
        let data = [];
        req.on("data", (chunk)=>{
            data.push(chunk);
        })
        req.on("end", ()=>{
            const parsedData = Buffer.concat(data).toString();
            console.log(parsedData);
            const params = new URLSearchParams(parsedData);
            const obj = Object.fromEntries(params);
            console.log(obj);
            res.write("<h2> Output: "+ addition(Number(obj.num1), Number(obj.num2))+"</h2>");
            return res.end();
        });
    }
    else{
        res.write("<h2>Page Not Found</h2>");
    }

});

module.exports = server;