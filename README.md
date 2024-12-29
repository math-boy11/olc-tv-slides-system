# OLC TV Slides System
This is the repository for the TV Slides system designed for Oakride Lutheran Church (OLC).

- [OLC TV Slides System](#olc-tv-slides-system)
  - [How it works](#how-it-works)
  - [Customization](#customization)
  - [Calendars](#calendars)
  - [Auto refresh](#auto-refresh)
  - [Running the app](#running-the-app)

## How it works
This program is designed to overlay custom elements on top of an existing Google Slides presentation. It works by using a [Google Apps Script](https://developers.google.com/apps-script) project to connect to the internal OLC Google Workspace resources. The script converts the slides, calendar data, etc. into a format that the main program can understand. This makes the program seperate from any internal OLC content. You can even use something different from Google Slides/Calendar entirely, since it's not tied to any particular system. The program takes the individual slides as SVGs and displays them in a loop. Then you can add your own elements to any of the slides that aren't nativley supported by Google Slides (such as HTML embeds or live calendars) or elements that won't converted properly (such as videos, GIFs, or any moving object). The code is designed to make it super simple to implement as many custom elements as you want, and you can add new types of custom elements really easilly.

## Customization
You can customize all the key aspects of this program easilly. To adjust the interval between the slide changes, just use the ```slideChangeIntervalDuration``` global variable in ```main.js```. To change the url where the slides and calendar data is stored, just change the url in the AJAX request in ```main.js```. To add custom elements, you can customize the ```customOverlays``` global object to add anything you want in this format:

```
{
    SLIDE_INDEX: [{
        type: "CUSTOM_ELEMENT_TYPE",
        ---FIELDS REQUIRED BY THE CUSTOM ELEMENT---
        x: 50,
        y: 40,
        width: 1340,
        height: 730
    }]
}
```

The slide index (starting from 0) is the slide you want to add overlays to. It takes an array so you can add multiple custom elements to the same slide. The coordanites (x, y, width, height) use the same coordanite system as Google slides and they are completley indepent of the screen resolution or DPI. Here is an example of adding an image overlay to slide #1:
```
{
    0: [{
        type: "image",
        url: IMAGE_URL",
        x: 100,
        y: 100,
        width: 500,
        height: 500
    }]
}
```

## Calendars
The calendars are implemented using the [FullCalendar](https://fullcalendar.io/) plugin, which allows for extremly customizable and good-looking calendars. All the logic for the calendar system is handled seperatly in the ```calendar.js``` file.

## Auto refresh
The app will refresh itself automaticlly at 1:00AM every day. This will ensure that your data is kept up-to-date hands-free. If you want to disable this functionality, simply set the ```enableAutoRefresh``` boolean in ```main.js```.

## Running the app
The app is just a simple static HTML website. Just clone the repo and open the ```index.html``` file in a web browser. It will grab the data from the server and when it's finished loading it will immediatly start cycling through the individual slides with the given time delay. Since the app is just a static website, you can deploy to many cloud services that are completly free such as [GitHub Pages](https://pages.github.com/). The main deployment on GitHub Pages can be accesed [here](https://math-boy11.github.io/olc-tv-slides-system/).