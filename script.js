var slide = $("#slide");
var overlayContainer = $("#overlay-container");
var slideChangeInterval = 5000;
var currentSlideIndex = 0;
var data;
var scale;
var customOverlays = {};

//Get the Google Slides data from the server
$.ajax({
    url: "https://script.google.com/macros/s/AKfycbzGiG4PXzJbdYSFdbK0OyTA6L1CUH-Dyhd6Iw_rlF_B2vAiCBUu5Ip2v43gy4P1aKkC-w/exec",
    type: "POST",
    dataType: "json"
}).done(function (slideshowData) {
    //Hide the loading text and show the slide container
    $("#loading").css("display", "none");
    $("#slide-container").css("display", "initial");

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
    //Draw the slide
    slide.attr("src", data.slides[currentSlideIndex]);

    //Draw the overlays
    overlayContainer.html("");

    if (customOverlays[currentSlideIndex]) {
        $.each(customOverlays[currentSlideIndex], function (index, overlay) {
            var overlayElement;

            if (overlay.type == "image") {
                //Draw an image overlay (useful for images that can't be exported as SVG, like GIFs)
                overlayElement = $("<img>");
                overlayElement.attr("src", overlay.url);
            } else if (overlay.type == "embed") {
                overlayElement = $("<iframe frameborder='0'></iframe>");
                overlayElement.attr("src", overlay.url);
            }

            overlayElement.width(overlay.width * scale);
            overlayElement.height(overlay.height * scale);
            overlayElement.css("position", "absolute");
            overlayElement.css("left", overlay.x * scale);
            overlayElement.css("top", overlay.y * scale);
            overlayElement.attr("data-overlay-number", index);
            overlayContainer.append(overlayElement);
        });
    }
}

//Function to resize elements to fit the screen
function resize() {
    //Get the window dimensions
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    //Calculate the scale factor based on the window size and aspect ratio
    scale = Math.min(windowWidth / data.width, windowHeight / data.height);

    //Set the slide width and height based on the scale
    slide.width(data.width * scale);
    slide.height(data.height * scale);

    //Resize the overlay elements
    overlayContainer.children().each(function (index, overlayElement) {
        var overlayData = customOverlays[currentSlideIndex][$(overlayElement).attr("data-overlay-number")];

        $(overlayElement).width(overlayData.width * scale);
        $(overlayElement).height(overlayData.height * scale);
        $(overlayElement).css("left", overlayData.x * scale);
        $(overlayElement).css("top", overlayData.y * scale);
    });
}