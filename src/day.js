var Day = function(options) {

    if (!options) return;

    this.index = options.index;
    this.month = options.month;
    this.year = options.year;

    this.isToday = this.isDayToday();

    this.scale = options.scale;

    this.width = 1;
    this.height = 10;
    this.color = this.isToday ? '#FF0000' : '#BBB';

    this.labelY = 0;
    this.fontSize = 5;
};

Day.prototype = {
    draw : function(ctx, month, year, pixelPerDay, scale) {

        this.x = month.x + month.offsetX + this.index * pixelPerDay;
        this.y = year.y - (this.height * scale / 2);

        var width = this.width * scale;
        var height = this.height * scale;

        this.labelY = this.y + height + 10;

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, width, height);

        //TODO: Scaleable
        if (this.isToday) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = this.color;
            ctx.stroke();
            ctx.strokeRect(this.x - 5, this.labelY + scale - 9, width + 9, 11);
        }

        var fontSize = this.fontSize + Math.round(scale);
        ctx.font = fontSize + "pt Arial";
        ctx.fillText(this.index, this.x - 2, this.labelY + scale);
    },

    isDayToday : function() {
        
        var isCurrentDay = new Date().getDate() === this.index;

        return this.month.isTodaysMonth && isCurrentDay;
    }
};

// ====================================================================
var DayEvent = function(options) {

    Day.apply(this, [options]);

    this.event = optins.event;
    this.x = this.event.day * Timeline.pixelPerDay;
};
DayEvent.prototype = new Day();