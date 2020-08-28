$(document).ready(function () {
    var answers = [];
    var questions = [];
    var userid = $("#userid").attr("data-userid");
    //Function for game functionality
    //AJAX calls
    //For OpenTDB
    // const apiKey = "3ea8b303cd602013a12b5951a3aed1b054818b323040af7d2231ede668458f80";
    // var queryURL = "https://opentdb.com/api.php?amount=10";
    // URL to request new API Key because they are deleted after 6 hours of inactivity. Just run the link in the browser
    //https://opentdb.com/api_token.php?command=request 

    //timer for the game
    function countdown() {
        var timeLeft = 90;
        var timeInterval = setInterval(function () {
            let timer = $("#timer")
            timeLeft--;
            timer.text("You have " + timeLeft + " seconds remaining ...");
            if (timeLeft === 0 || answers.length>= 10) {
                let point = 0;
    // push scores to api
                for (let i = 0; i < questions.length; i++) {
                    if (i >= answers.length) {
                        point = 0;
                    } else {
                        if (answers[i][2] === "right") {
                            point = 1;
                        } else {
                            point = 0;
                        }
                    }
                    $.ajax("/api/update", {
                        type: "POST",
                        data: {
                            userId: userid,
                            scores: [{
                                cat: questions[i][1],
                                ques: 1,
                                right: point
                            }]
                        }
                    }).then(function (data) {
                        console.log(data);
                        //  window.location.replace("/")
                    })
                }
                clearInterval(timeInterval);
                timer.text("Your time is up!");
                setInterval(function () {
                    window.location.replace("/profile");
                }, 1000)

            }
        }, 1000)
    }
    // creating div with questions and answers
    $("#back-btn").on("click", function () {
        window.location.replace("/profile");
    })
    $("#quest-btn").on("click", function () {
        countdown();
        $("#quest-btn").hide()
        $("#back-btn").hide()
        let queryURL = "https://opentdb.com/api.php?amount=10";
        // let results =[];
        let quesDiv = $("#myQuestions");
        answers = [];
        questions = [];
        quesDiv.empty();
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let results = response.results;
            for (let i = 0; i < results.length; i++) {
                let options = results[i].incorrect_answers;
                options.push(results[i].correct_answer);
                options.sort();
                let newQuestions = $(`
                   <h3 class="roll">Question ${i + 1}: ${results[i].question}</h3>
                   <p>Choose answer:</p>`);
                quesDiv.append(newQuestions);
                questions.push([`ques${i}`, results[i].category]);
                for (let j = 0; j < options.length; j++) {
                    if (options[j] === results[i].correct_answer) {
                        let newAnswers = $(`<p><button class="answer ques${i} btn btn-primary btn-rounded roll" data-cat="${results[i].category}" data-right="right">${options[j]}</button></p>`);
                        quesDiv.append(newAnswers);
                    } else {
                        let newAnswers = $(`<p><button class="answer ques${i} btn btn-primary btn-rounded roll" data-cat="${results[i].category}" data-right="wrong">${options[j]}</button></p>`)
                        quesDiv.append(newAnswers);
                    }
                }
                $(".ques" + i).on("click", function (event) {
                    let found = false;
                    let classes = $(this)[0].classList;
                    for (let m = 0; m < answers.length; m++) {
                        if (answers[m][0] === classes[1]) {
                            found = true;
                        }
                    }
                    if (!found) {
                        if ($(this).attr("data-right") === "right") {
                            $(this).addClass("btn-success");
                        } else {
                            $(this).addClass("btn-danger");
                        }
                        let classes = $(this)[0].classList;
                        answers.push([classes[1], $(this).attr("data-cat"), $(this).attr("data-right")]);
                    }
                })
            }
        })
    })
});
