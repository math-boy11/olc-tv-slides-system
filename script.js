var slideContainer = $("#slide-container");
var slide = $("#slide");
var slideChangeInterval = 5000;
var currentSlideIndex = 0;
var data;

//Get the Google Slides pdf from the server
$.ajax({
    url: "https://script.google.com/macros/s/AKfycbzGiG4PXzJbdYSFdbK0OyTA6L1CUH-Dyhd6Iw_rlF_B2vAiCBUu5Ip2v43gy4P1aKkC-w/exec",
    type: "POST",
    dataType: "json"
}).done(function (slideshowData) {
    //Hide the loading text and show the slide container
    $("#loading").css("display", "none");
    slideContainer.css("display", "initial");

    //Assign the data as a global variable
    data = slideshowData;

    //Adjust the slide dimensions to fill the screen
    resize();
    drawSlide();

    $(window).resize(resize);

    //Interval to change the slide
    setInterval(function () {
        //Loop back to the first slide if we are currently on the last slide
        if (data.slides.length - 1 == currentSlideIndex) {
            currentSlideIndex = 0;
        } else {
            currentSlideIndex++;
        }

        drawSlide();
    }, slideChangeInterval);
});

//Function to draw the current slide onto the DOM
function drawSlide() {
    slide.attr("src", data.slides[currentSlideIndex]);
}

//Function to resize the canvas to fit the screen
function resize() {
    //Get the window dimensions
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    //Calculate the scale factor based on the window size and aspect ratio
    var scale = Math.min(windowWidth / data.width, windowHeight / data.height);

    //Set the canvas width and height based on the scale
    slide.width(data.width * scale);
    slide.height(data.height * scale);
}