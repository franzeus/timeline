var Month = function(index, left, year) {

    this.index = index;
    this.number = index + 1;
    this.year = year;

    this.numberOfDays = 31;

    this.events = [];
    this.days = [];
    this.pixelPerDay = Timeline.pixelPerDay;

    this.$month = jQuery('<ul class="month" data-number="' + this.number + '"></ul>');

    this.$month.css({
        left: left
    });

    this.left = left;

    this.generateDays();
    this.setLabel();
};

Month.prototype.getName = function() {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[this.number - 1];
};

Month.prototype.getDom = function() {
    return this.$month;
};

Month.prototype.setLabel = function() {
    this.label  = jQuery('<div class="month-label">' + this.getName() + '</div>');
    this.$month.prepend(this.label);
};

Month.prototype.addEvent = function(event) {

    var dayEvent = new DayEvent(event, event.day - 1, this.number, this.year),
        eventNode = dayEvent.buildNode();

    this.events.push(dayEvent);

    this.$month.append(eventNode);
    return this;
};

Month.prototype.generateDays = function() {

    for (var i = 0; i < this.numberOfDays; i++) {

        var day = new Day(i, this.number, this.year),
            dayNode = day.buildNode();

        this.days.push(day);
        this.$month.append(dayNode);
    }

};