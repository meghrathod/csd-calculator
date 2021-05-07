const express = require("express");
const mongoose = require("mongoose")

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/marksDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const PercentSchema = new mongoose.Schema({
    name: String,
    percentageNumber: Number,
});

const Percent = mongoose.model("Percent", PercentSchema);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/calculate.html");
});

app.post("/", async function (req, res) {
    const Name = req.body.Name;
    const Quiz1 = parseFloat(req.body.Quiz1);
    const Quiz2 = parseFloat(req.body.Quiz2);
    const Quiz3 = parseFloat(req.body.Quiz3);
    const Lab1 = parseFloat(req.body.Lab1);
    const Lab2 = parseFloat(req.body.Lab2);
    var MidsemObj = parseFloat(req.body.MidsemObj);
    var MidsemSub = parseFloat(req.body.MidsemSub);
    const ClassAssign = parseFloat(req.body.ClassAssign);

    var totalQuiz = Quiz1 / 15 + Quiz2 / 15 + Quiz3 / 10;
    totalQuiz *= 5;
    var totalLab = Lab1 / 5 + Lab2 / 7;
    totalLab *= 10;

    MidsemObj /= 20;
    MidsemSub /= 40;
    MidsemObj *= 30;
    MidsemSub *= 70;

    var midsemTotal = (MidsemSub + MidsemObj) * 25;
    midsemTotal /= 100;
    var totalSoFar = totalLab + midsemTotal + totalQuiz + ClassAssign;
    var finalPercentage = totalSoFar + (totalSoFar / 65) * 35;
    var percentage = finalPercentage.toFixed(2)

    const Person = new Percent({
        name: Name,
        percentageNumber: finalPercentage,
    });

    await Person.save();

    var sum = 0;
    var responses = 0;
    var average = 0;

    const filter = {};
    const all = await Percent.find(filter);
    all.map(person => {
        sum+=person.percentageNumber;
        responses+=1;
        average = sum/responses
    })
    console.log(sum);
    console.log(average)

// await(sum/responses);
//     console.log(average);

    res.render("success", {data: { percentage: percentage, responses: responses, average: average }});
});

app.post("/failure", function (req, res) {
    res.sendFile(__dirname + "/failure.html");
});

app.get("/view", async function(req, res){
    var sum = 0;
    var responses = 0;
    var average = 0;

    const filter = {};
    const all = await Percent.find(filter);
    all.map((person) => {
        sum += person.percentageNumber;
        responses += 1;
        average = sum / responses;
    });
    console.log(sum);
    console.log(average);

    // await(sum/responses);
    //     console.log(average);

    res.render("view", {
        data: {
            responses: responses,
            average: average,
        },
    });
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server started at port 3000");
});

