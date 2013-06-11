var Month = function(options) {

    this.index = options.index;
    this.number = this.index + 1;
    this.year = options.year;
    this.id = this.number + '_' + this.year;
    this.numberOfDays = 31;

    this.events = [];
    this.days = [];
    this.pixelPerDay = Timeline.pixelPerDay;

    this.height = 20;
    this.width = 2;
    this.yearY = options.y;
    this.x = options.x;
    this.y = options.y - (this.height / 2);
    this.color = '#222';

    this.generateDays();
};

Month.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.font = "8pt Arial";
    ctx.fillText(this.getName(), this.x, this.y + 35);

    this.drawDays(ctx);
};

Month.prototype.drawDays = function(ctx) {
    this.traverseDays(function(day) {
        day.draw(ctx);
    });
};

Month.prototype.getName = function() {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[this.number - 1];
};

Month.prototype.addEvent = function(event) {

    var dayEvent = new DayEvent(event, event.day - 1, this.number, this.year),
        eventNode = dayEvent.buildNode();

    this.events.push(dayEvent);

    return this;
};

Month.prototype.generateDays = function() {

    var pixelPerDay = this.pixelPerDay;

    for (var i = 0; i < this.numberOfDays; i++) {

        var day = new Day({
            index: i,
            month: this.number,
            year: this.year,
            x : this.x + i * pixelPerDay,
            y : this.yearY
        });

        this.days.push(day);
    }

};

Month.prototype.traverseDays = function(callback) {
    var i = 0,
        len = this.days.length,
        self = this;

    for (i = 0; i < len; i++) {
        callback.call(self, this.days[i]);
    }
};
