var Year = function(options) {

    this.index = options.index; // begins with 1
    this.number = options.number;
    this.months = [];
    this.id = this.number;

    this.next = null;
    this.prev = null;

    this.scale = options.scale;
    this.height = 1;
    /*
    this.width = options.width;
    this.x = options.x;
    this.y = options.y - (this.height / 2);
    */
    this.color = '#FF0088';

    this.labelY = this.y;

    this.generateMonths();
};

Year.prototype.draw = function(ctx, timeline) {
    this.drawYear(ctx, timeline);
    this.drawLabel(ctx, timeline);
    this.drawMonths(ctx, timeline);
};

Year.prototype.drawYear = function(ctx, timeline) {

    this.width = timeline.width * timeline.scale;
    this.scaledHeight = this.height - timeline.scale;
    this.x = this.width * this.index;
    this.y = (timeline.height / 2) - (this.height / 2);

    ctx.fillStyle = this.color;
    ctx.fillRect(0, this.y, this.width, this.height);
};

Year.prototype.drawLabel = function(ctx, timeline) {
   ctx.font = "10pt Arial";
   ctx.fillText(this.number, this.x, this.y - (timeline.scale * 20));
};

Year.prototype.drawMonths = function(ctx, timeline) {

    var options = {
        timeline : timeline,
        year : this
    };

    this.traverseMonths(function(month) {
        month.draw(ctx, options);
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

            var x = this.x + i * widthOfOneMonth * this.scale;

            if (i > 0) {
                var lastMonth = this.months[i - 1];
                x = lastMonth.x + lastMonth.getComputedWidth();
            }

            month = new Month({
                index : i,
                year : this.number,
                x : x,
                y : this.y,
                scale : this.scale
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