var Year = function(options) {

    this.number = options.number;
    this.months = [];
    this.id = this.number;

    this.next = null;
    this.prev = null;

    this.height = 1;
    this.width = Timeline.yearWidth;
    this.x = options.x;
    this.y = options.y - (this.height / 2);
    this.color = '#FF0088';

    this.generateMonths();
};

Year.prototype.draw = function(ctx) {
    this.drawYear(ctx);
    this.drawLabel(ctx);
    this.drawMonths(ctx);
};

Year.prototype.drawYear = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
};

Year.prototype.drawLabel = function(ctx) {
   ctx.font = "10pt Arial";
   ctx.fillText(this.number, this.x, this.y - 15);
};

Year.prototype.drawMonths = function(ctx) {
    this.traverseMonths(function(month) {
        month.draw(ctx);
    });
};

Year.prototype.update = function(currentLeft) {
    var newLeft = 0;

    if (currentLeft < this.getPosition().left) {
        newLeft = Math.abs(currentLeft);
    }
};

Year.prototype.generateMonths = function() {

    var widthOfOneMonth = Timeline.yearWidth / 12;

    for (var i = 0; i < 12; i++) {

            month = new Month({
                index : i,
                year : this.number,
                x : this.x + i * widthOfOneMonth,
                y : this.y
            });

        this.months.push(month);
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

Year.prototype.setNext = function(next) {
    this.next = next;
}

Year.prototype.setPrev = function(prev) {
    this.prev = prev;
}