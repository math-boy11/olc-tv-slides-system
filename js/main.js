var slide = $("#slide");
var overlayContainer = $("#overlay-container");
var slideChangeIntervalDuration = 5000;
var slideChangeInterval;
var currentSlideIndex = 0;
var slidesData;
var calendarData;
var scale;
var customOverlays = {
    8: [{
        type: "calendar",
        calendar: "OLC Events",
        eventColor: "#351C75",
        x: 50,
        y: 40,
        width: 1340,
        height: 730
    }]
};

//Get the Google Slides data from the server
$.ajax({
    url: "https://script.google.com/macros/s/AKfycbzGiG4PXzJbdYSFdbK0OyTA6L1CUH-Dyhd6Iw_rlF_B2vAiCBUu5Ip2v43gy4P1aKkC-w/exec",
    type: "POST",
    dataType: "json"
}).done(function (data) {
    //Hide the loading text and show the slide container
    $("#loading").css("display", "none");
    $("#slide-container").css("display", "initial");

    //Assign the data as global variables
    slidesData = data.slidesData;
    calendarData = data.calendarData

    //Adjust the slide dimensions to fill the screen
    resize();
    drawSlide();

    $(window).resize(resize);

    //Interval to change the slide
    slideChangeInterval = setInterval(function () {
        //Loop back to the first slide if we are currently on the last slide
        if (slidesData.slides.length - 1 == currentSlideIndex) {
            currentSlideIndex = 0;
        } else {
            currentSlideIndex++;
        }

        drawSlide();
    }, slideChangeIntervalDuration);
});

//Function to draw the current slide onto the DOM
function drawSlide() {
    //Draw the slide
    slide.attr("src", slidesData.slides[currentSlideIndex]);

    //Draw the overlays
    overlayContainer.html("");

    if (customOverlays[currentSlideIndex]) {
        $.each(customOverlays[currentSlideIndex], function (index, overlay) {
            var overlayElement;

            //Initial setup of the overlay elements
            if (overlay.type == "image") {
                //Draw an image overlay (useful for images that can't be exported as SVG, like GIFs)
                overlayElement = $("<img>");
                overlayElement.attr("src", overlay.url);
            } else if (overlay.type == "embed") {
                overlayElement = $("<iframe frameborder='0'></iframe>");
                overlayElement.attr("src", overlay.url);
            } else if (overlay.type == "calendar") {
                overlayElement = $("<div>");
                var calendar = createCalendar(overlayElement[0], calendarData[overlay.calendar], overlay.eventColor);
            }

            overlayElement.width(overlay.width * scale);
            overlayElement.height(overlay.height * scale);
            overlayElement.css("maxWidth", overlay.width * scale)
            overlayElement.css("maxHeight", overlay.height * scale)
            overlayElement.css("position", "absolute");
            overlayElement.css("left", overlay.x * scale);
            overlayElement.css("top", overlay.y * scale);
            overlayElement.attr("data-overlay-number", index);
            overlayContainer.append(overlayElement);

            //Additional setup of the overlay elements after they're rendered
            if (overlay.type == "calendar") {
                calendar.render();
            }
        });
    }
}

//Function to resize elements to fit the screen
function resize() {
    //Get the window dimensions
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    //Calculate the scale factor based on the window size and aspect ratio
    scale = Math.min(windowWidth / slidesData.width, windowHeight / slidesData.height);

    //Set the slide width and height based on the scale
    slide.width(slidesData.width * scale);
    slide.height(slidesData.height * scale);

    //Resize the overlay elements
    overlayContainer.children().each(function (index, overlayElement) {
        var overlayData = customOverlays[currentSlideIndex][$(overlayElement).attr("data-overlay-number")];

        $(overlayElement).width(overlayData.width * scale);
        $(overlayElement).height(overlayData.height * scale);
        $(overlayElement).css("maxWidth", overlayData.width * scale)
        $(overlayElement).css("maxHeight", overlayData.height * scale)
        $(overlayElement).css("left", overlayData.x * scale);
        $(overlayElement).css("top", overlayData.y * scale);
    });
}