var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var slideChangeInterval = 3000;
var currentSlideIndex = 0;
var presentationData;

//Get the Google Slides data from the server
google.script.run.withSuccessHandler(function (response) {
    //Hide the loading text and show the canvas
    document.getElementById("loading").style.display = "none";
    canvas.style.display = "initial";

    presentationData = response;

    //Adjust the canvas dimensions to fill the screen
    resizeCanvas();
    drawSlide();

    window.addEventListener("resize", function () {
        resizeCanvas();
        drawSlide();
    });

    //Interval to change the slide
    setInterval(function () {
        //Loop back to the first slide if we are currently on the last slide
        if (presentationData.slides.length - 1 == currentSlideIndex) {
            currentSlideIndex = 0;
        } else {
            currentSlideIndex++;
        }

        drawSlide();
    }, slideChangeInterval)
}).getGoogleSlidesData();

//Function to draw the current slide onto the canvas
function drawSlide() {
    var slide = presentationData.slides[currentSlideIndex];
    console.log(slide);

    //Paint white background as the bottom layer
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Draw the slide background      
    if (slide.background.type == "COLOR") {
        ctx.fillStyle = slide.background.color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        var backgroundImage = new Image();
        backgroundImage.src = slide.background.imageURL;

        backgroundImage.onload = function () {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        }
    }

    //Draw the slide elements
    for (var elem in slide.elements) {
        if (elem.type == "IMAGE") {
            var image = new Image();
            image.src = elem.imageURL;

            image.onload = function () {
                ctx.drawImage(image, elem.x, elem.y, elem.width, elem.height);
            }
        }
    }
}

//Function to resize the canvas to fit the screen
function resizeCanvas() {
    //Get the window dimensions
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    //Calculate the scale factor based on the window size and aspect ratio
    var scale = Math.min(windowWidth / presentationData.pageWidth, windowHeight / presentationData.pageHeight);

    //Set the canvas width and height based on the scale
    canvas.width = presentationData.pageWidth * scale;
    canvas.height = presentationData.pageHeight * scale;
}