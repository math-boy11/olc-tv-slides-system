function createCalendar(container, events, eventColor) {
    var calendar = new FullCalendar.Calendar(container, {
        initialView: "dayGridMonth",
        eventColor: eventColor,
        events: events,
        fixedWeekCount: false,
        headerToolbar: {
            left: "",
            center: "title",
            right: ""
        }
    });

    return calendar;
}