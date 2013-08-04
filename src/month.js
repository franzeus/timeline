var Month = function(options) {

    this.timeline = options.timeline;

    this.index = options.index;
    this.monthIndex = options.monthIndex;

    this.year = options.year;
    this.number = this.monthIndex + 1;
    this.numberOfDays = this.getNumberOfDays(this.monthIndex, this.year);
    this.id = this.number + '_' + this.year;

    this.isTodaysYear = this.year === new Date().getFullYear();
    this.isTodaysMonth = this.monthIndex === new Date().getMonth() && this.isTodaysYear;

    this.labelText = this.getName() + "." + this.year;

    this.events = [];
    this.days = [];

    this.scale = this.timeline.scale;
    this.baseWidth = options.baseWidth;

    this.height = 20 * this.timeline.scale;
    this.width = 2 * this.timeline.scale;

    this.x = options.x;
    this.offsetX = 0;
    this.y = (this.timeline.height / 2) - (this.height / 2);

    this.color = '#222';

    this.labelY = this.y - 15;
    this.fontSize = 8;

    this.generateDays();
};

Month.prototype.draw = function(ctx) {

    var x = this.x + this.offsetX;

    this.drawDays(ctx);

    ctx.fillStyle = this.color;
    ctx.fillRect(x, this.y, this.width, this.height);

    this.labelX = x;
    var fontSize = this.fontSize;

    ctx.font = fontSize + "pt Arial";
    ctx.fillText(this.labelText, this.labelX, this.labelY);

};

Month.prototype.update = function() {
    /*
    var timeline = this.timeline;

    this.baseWidth = timeline.width / this.timeline.scale;
    var index = this.index;

    if (index === 0) {
        index = -1;
    }

    this.x = this.baseWidth * index + this.offsetX;

    this.y = timeline.height / 2 - (this.height / 2);
    this.width = 2 * timeline.scale;
    this.height = 20 * timeline.scale;
    */

    var pixelPerDay = Math.floor(this.baseWidth / this.numberOfDays);

};

Month.prototype.drawDays = function(ctx) {

    var pixelPerDay = Math.floor(this.baseWidth / this.numberOfDays);

    this.traverseDays(function(day) {
        day.draw(ctx, this, { y: 75 }, pixelPerDay, this.timeline.scale);
    });
};

Month.prototype.getName = function() {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[this.monthIndex];
};

Month.prototype.addEvent = function(event) {

    var dayEvent = new DayEvent(event, event.day - 1, this.number, this.year),
        eventNode = dayEvent.buildNode();

    this.events.push(dayEvent);

    return this;
};

Month.prototype.generateDays = function() {

    for (var i = 1; i <= this.numberOfDays; i++) {

        var day = new Day({
            index: i,
            month: this,
            year: this.year,
            x : this.x + i * this.pixelPerDay * this.scale,
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

    //return this.timeline.width / this.timeline.scale;
    return this.numberOfDays * this.pixelPerDay * this.scale;
};

Month.prototype.getComputedX = function() {
    return this.getComputedWidth() * this.monthIndex;
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