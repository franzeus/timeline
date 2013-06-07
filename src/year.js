var Year = function(number, left) {
    this.number = number;
    this.months = [];
    this.left = left;

    this.node = this.buildNode();
    this.generateMonths();
};

Year.prototype.buildNode = function() {

    var yearNode = jQuery('<div class="year" data-number="' + this.number + '"><div class="currentYearLabel">' + this.number + '</div></div>');

    yearNode.css({
        width: Timeline.width
    });

    return yearNode;
};

Year.prototype.generateMonths = function() {

    for (var i = 0; i < 12; i++) {

        var days = Timeline.pixelPerDay * 31, // TODO: based on month and year
            month = new Month(i, i * days, this.number);

        this.months.push(month);

        this.node.append(month.$month);
    }
};

Year.prototype.addEvent = function(event) {

    this.traverseMonths(function(month) {

        if (month.number === event.month) {
            month.addEvent(event);
        }

    });
};

Year.prototype.traverseMonths = function(callback) {

    var i = 0,
        len = this.months.length,
        self = this;

    for (i = 0; i < len; i++) {
        callback.call(self, this.months[i]);
    }
};