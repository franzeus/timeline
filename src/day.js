var Day = function(options) {

    if (!options) return;

    this.index = options.index;
    this.month = options.month;
    this.year = options.year;

    this.width = 1;
    this.height = 10;
    this.x = options.x;
    this.y = options.y - (this.height / 2);
    this.color = '#CCC';
};

Day.prototype = {
    draw : function(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

// ====================================================================
var DayEvent = function(options) {

    Day.apply(this, [options]);

    this.event = optins.event;
    this.x = this.event.day * Timeline.pixelPerDay;
};
DayEvent.prototype = new Day();