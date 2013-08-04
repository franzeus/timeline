var Day = function(options) {

    if (!options) return;

    this.index = options.index;
    this.month = options.month;
    this.year = options.year;

    this.isToday = this.isDayToday();
    this.isWeekendDay = this.isDayWeekendDay();

    this.scale = options.scale;

    this.width = 1;
    this.height = 10;

    this.defaultColor = '#BBB';
    this.weekendColor = '#888';
    this.currentDayColor = '#FF0000';
    this.color = this.getColor();

    this.labelY = 0;
    this.fontSize = 5;
};

Day.prototype = {

    getColor : function() {

        var color;

        if (this.isToday) {

            color = this.currentDayColor;

        } else if (this.isWeekendDay) {

            color = this.weekendColor;

        } else {

            color = this.defaultColor;

        }

        return color;
    },

    draw : function(ctx, month, year, pixelPerDay, scale) {

        this.x = month.x + month.offsetX + this.index * pixelPerDay;
        this.y = year.y - (this.height * scale / 2);

        var width = this.width * scale;
        var height = this.height * scale;

        this.labelWeekdayY = this.y - 10;
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

        // Bounding box
        /*
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#00FF00';
        ctx.stroke();
        ctx.strokeRect(this.x - 5, this.y, width + 9, 40);
        */

        var fontSize = this.fontSize + Math.round(scale);
        ctx.font = fontSize + "pt Arial";

        // Weekday
        ctx.fillText(this.getDayName(), this.x - 2, this.labelWeekdayY + scale);

        // Number
        ctx.fillText(this.index, this.x - 2, this.labelY + scale);
    },

    isDayToday : function() {
        
        var isCurrentDay = new Date().getDate() === this.index;

        return this.month.isTodaysMonth && isCurrentDay;
    },

    isDayWeekendDay : function() {
        var weekday = this.getWeekday();

        return weekday === 6 || weekday === 0; // Sunday = 0, Saturday = 6
    },

    getWeekday : function() {
        return new Date(this.year + '-' + this.month.number + '-' + this.index).getDay();
    },

    getDayName : function() {
        return ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][this.getWeekday()];
    }
};

// ====================================================================
var DayEvent = function(options) {

    Day.apply(this, [options]);

    this.event = optins.event;
    this.x = this.event.day * Timeline.pixelPerDay;
};
DayEvent.prototype = new Day();