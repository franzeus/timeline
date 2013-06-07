var Day = function(index, month, year) {

    this.index = index;
    this.left = index * Timeline.pixelPerDay;
    this.month = month;
    this.year = year;

    this.className = 'day';
};

Day.prototype = {

    buildNode : function() {

        var $newDay = jQuery('<li class="' + this.className + '"></li>');

        $newDay.css({
            'left': this.left
        });

        return $newDay;
    }
};

// ====================================================================

var DayEvent = function(event, index, month, year) {

    Day.apply(this, [index, month, year]);

    this.left = event.day * Timeline.pixelPerDay;
    this.event = event;

    this.className = 'dayEvent';
};
DayEvent.prototype = new Day();