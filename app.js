const express = require("express");
const https = require("https");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.FirstName;
    const lastName = req.body.LastName;
    const email = req.body.inputEmail;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                },
            },
        ],
    };
    const jsonData = JSON.stringify(data);
    const URL = "https://us1.api.mailchimp.com/3.0/lists/e26331b325";
    const options = {
        method: "POST",
        auth: "meghrathod:069af24e6f6fd5c9cb504af191c60208-us1",
    }
    const request = https.request(URL, options, function(response){
        response.on("data", function (D) {
            const status = response.statusCode;
            if (status === 200){
                res.sendFile(__dirname + "/success.html");            }
            else{
                res.sendFile(__dirname + "/failure.html");
            }
        })
    })
    request.write(jsonData);
    request.end();

});

app.post("/failure", function (req, res){
    res.redirect("https://me.meghrathod.tech");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started at port 3000");
});

//API Key
// 069af24e6f6fd5c9cb504af191c60208-us1
// List ID: e26331b325
