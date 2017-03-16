$(document).ready(function(){

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBydy17uPLA6BPRRKDnj1OjdgBLtKesvVY",
        authDomain: "traintime-89f55.firebaseapp.com",
        databaseURL: "https://traintime-89f55.firebaseio.com",
        storageBucket: "traintime-89f55.appspot.com",
        messagingSenderId: "314113227903"
    };
    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();


    var trainName;
    var destination;
    var firstTime;
    var frequency;


    // Whenever a user clicks the submit-bid button
    $("#addTrainButton").on("click", function(event){
        // Prevent form from submitting
        event.preventDefault();

        // Get the input values
        trainName = $("#trainNameInput").val().trim();
        destination = $("#destinationInput").val().trim();
        frequency = $("#frequencyInput").val().trim();
        firstTime =  moment($("#firstTimeInput").val().trim(), "HH:mm").format("X");


        if(trainName != "" && destination != "" && firstTime != "" && frequency != "")
        {
            // Change what is saved in firebase
            database.ref().push({
                trainName: trainName,
                destin: destination,
                first: firstTime,
                frequency: frequency
            });

            // clear the input boxes
            $("#trainNameInput").val("");
            $("#destinationInput").val("");
            $("#frequencyInput").val("");
            $("#firstTimeInput").val("");
        }
        else
        {
            alert("Error!  Missing train data");
        }

    });


    // At the initial load and whenever a new train is added.
    database.ref().on("child_added", function(snapshot) {

        // update display
        trainName = snapshot.val().trainName;
        destination = snapshot.val().destin;
        frequency = snapshot.val().frequency;
        firstTime = snapshot.val().first;

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

        // Convert the current time to Unix time for moment.js
        var currentTimeConverted = moment(currentTime).format("X");
        console.log("CURRENT TIME CONVERTED TO UNIX: " + currentTimeConverted);

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "X").subtract(1, "years");
        console.log("First Time Conv: " + firstTimeConverted);


        // Difference between the times
        var diffTime = moment(currentTimeConverted, "X").diff(moment(firstTimeConverted, "X"), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");
        console.log("ARRIVAL TIME: " + nextTrain);

        $("#trainTbl > tbody")
            .append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain +  "</td></tr>");

        // If any errors are experienced, log them to console.
    }, function(errorObject) {
        console.log("The read failed: " + errorObject.code);
    });

}); // end doument ready

/*
 ref = new Firebase("myfirebase.com")
 ref.child(key).remove();

 */