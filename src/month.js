var Month = function(options) {

    var timeline = options.timeline;

    this.index = options.index;
    this.monthIndex = options.monthIndex;
    this.number = this.monthIndex + 1;
    this.year = options.year;
    this.id = this.number + '_' + this.year;
    this.numberOfDays = this.getNumberOfDays(this.monthIndex, this.year);

    this.events = [];
    this.days = [];

    this.scale = timeline.scale;
    this.baseWidth = options.baseWidth;
    this.height = 20 * timeline.scale;
    this.width = 2 * timeline.scale;
    this.x = options.x;
    this.y = (timeline.height / 2) - (this.height / 2);
    this.color = '#222';

    this.labelY = this.y - 5;
    this.fontSize = 8;

    this.generateDays();
};

Month.prototype.draw = function(ctx, scale) {
    var pixelPerDay = Math.round(this.baseWidth / this.numberOfDays);

    this.drawDays(ctx, this, { y: 75 }, pixelPerDay, this.scale);
    
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    this.labelX = this.x;
    var fontSize = this.fontSize;

    ctx.font = fontSize + "pt Arial";
    ctx.fillText(this.getName() + "." + this.year, this.labelX, this.labelY);


    return;
    /*
    var timeline = options.timeline;
    var year = options.year;
    */

    var widthOfOneYear = year.width / 12;
    var width = this.width * scale;
    var height = this.height * scale;
    
    this.x = this.x + this.index * widthOfOneYear * scale;
    this.y = year.y - (height / 2);   

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, width, height);

    this.labelY = this.y - 5;
    this.labelX = (this.x + widthOfOneYear);
    var fontSize = this.fontSize + scale;
    ctx.font = fontSize + "pt Arial";
    ctx.fillText(this.getName(), this.labelX, this.labelY);

};

Month.prototype.drawDays = function(ctx, month, year, pixelPerDay, scale) {

    this.traverseDays(function(day) {
        day.draw(ctx, month, year, pixelPerDay, scale);
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
            index: i - 1,
            month: this.number,
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