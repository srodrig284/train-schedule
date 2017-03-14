
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
    frequency = parseInt($("#frequencyInput").val().trim());
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
    frequency = parseInt(snapshot.val().frequency);
    firstTime = snapshot.val().first;


    $("#trainTbl > tbody")
        .append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td></tr>");

    // If any errors are experienced, log them to console.
}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});
