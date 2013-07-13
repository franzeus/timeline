var Month = function(options) {

    this.index = options.index;
    this.number = this.index + 1;
    this.year = options.year;
    this.id = this.number + '_' + this.year;
    this.numberOfDays = this.getNumberOfDays(this.index, this.year);

    this.events = [];
    this.days = [];
    this.pixelPerDay = Timeline.pixelPerDay;

    this.yearOffsetX = options.x;

    this.scale = options.scale;
    this.height = 20;
    this.width = 2;
    this.yearY = options.y;
    this.x = options.x;
    this.y = options.y - (this.height / 2);
    this.color = '#222';

    this.labelY = this.y - 5;
    this.fontSize = 6;

    this.generateDays();
};

Month.prototype.draw = function(ctx, options) {
    
    var timeline = options.timeline;
    var year = options.year;

    var widthOfOneYear = year.width / 12;
    var width = this.width * timeline.scale;
    var height = this.height * timeline.scale;
    
    this.x = year.x + this.index * widthOfOneYear * timeline.scale;
    this.y = year.y - (height / 2);
    
    this.drawDays(ctx, options);

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, width, height);

    this.labelY = this.y - 5;
    this.labelX = (this.x + widthOfOneYear);
    var fontSize = this.fontSize + timeline.scale;
    ctx.font = fontSize + "pt Arial";
    ctx.fillText(this.getName(), this.labelX, this.labelY);

};

Month.prototype.drawDays = function(ctx, options) {

    var pixelPerDay = options.year.width / 12 / this.numberOfDays;

    this.traverseDays(function(day) {
        day.draw(ctx, this, options.year, pixelPerDay, options.timeline.scale);
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
            x : this.x + i * pixelPerDay * this.scale,
            y : this.yearY,
            scale : this.scale
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

Month.prototype.getComputedWidth = function() {
    return this.numberOfDays * this.pixelPerDay * this.scale;
};


Month.prototype.getNumberOfDays = function(month, year) {

    var totalFeb = 28;

    // Feb feels special
    if (month === 1) {
        if ( (year % 100 !== 0) && (year % 4 ===0) || (year % 400 === 0)) {
            totalFeb = 29;
        }
    }

    var dayMap = [31, totalFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return dayMap[month];
}