var Year = function(number, left) {

    this.number = number;
    this.months = [];
    this.left = left;
    this.id = this.number;

    this.next = null;
    this.prev = null;

    this.node = this.buildNode();

    this.generateMonths();
    this.startPosition = this.getPosition();
};

Year.prototype.buildNode = function() {

    var yearNode = jQuery('<div class="year" id="' + this.id + '" data-number="' + this.number + '"><div class="currentYearLabel">' + this.number + '</div></div>');

    yearNode.css({
        width: Timeline.width
    });

    return yearNode;
};

Year.prototype.afterBuild = function() {
    this.setNode(this.getNode());
    this.labelNode = this.node.find('.currentYearLabel');
};

Year.prototype.update = function(currentLeft) {
    var newLeft = 0;

    if (currentLeft < this.getPosition().left) {
        newLeft = Math.abs(currentLeft);
    }

    this.labelNode.css({
        left : newLeft
    });
};

Year.prototype.setNode = function(node) {
    this.node = node;
};

Year.prototype.getNode = function() {
    return Timeline.timeline.find('#' + this.id);
};

Year.prototype.getPosition = function() {
    return this.node.position();
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

Year.prototype.setNext = function(next) {
    this.next = next;
}

Year.prototype.setPrev = function(prev) {
    this.prev = prev;
}