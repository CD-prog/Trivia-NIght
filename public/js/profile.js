
//adding functionality to the buttons in the profile page 
$(document).ready(function(){
    $("#start-btn").on("click", function (req, res){
        console.log("clicked")
        window.location.replace("/game")
    })

    $("#logout-btn").on("click", function (req, res){
        console.log("clicked")
        window.location.replace("/logout")
    })

      const id = $(this).attr("data-id")
      $.ajax("/api/user_categories/" + id, {
        type: "GET"
    }).then(function(){
        console.log("Hello")
    //  window.location.replace("/")
    })


    $("#delete-btn").on("click", function (req, res){
        console.log("clicked")
        const id = $(this).attr("data-id")
        $.ajax("/api/user_data/" + id, {
            type: "DELETE"
        }).then(function(){
            console.log("Hello")
         window.location.replace("/")
        })
    })
    //api call to display score information
    //$("#scores-table")
    // $.ajax("/api/game", {
    //     type: "GET"
        
    // })
});

