(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var Timeline = {

    years : [],
    currentYear : null,
    maxLeft : 0,
    timeline : null,

    init : function(options) {

        this.timeline = document.getElementById(options.canvasSelector);
        this.ctx = this.timeline.getContext('2d');

        this.width = this.timeline.width;
        this.height = this.timeline.height;

        this.yearWidth = 2000;
        this.pixelPerMonth = this.yearWidth / 12;
        this.pixelPerDay = this.yearWidth / 356;

        this.initYears();
        this.registerEvents();

        this.draw();
    },

    registerEvents : function() {

        var self = this;

    },

    initYears : function() {
        var year = new Date().getFullYear();
            newYear = this.addYear(year, 0);

        this.setCurrentYear(newYear);
        this.nextMaxLeft = this.yearWidth;
    },

    draw : function() {

        var ctx = Timeline.ctx,
            self = Timeline;

        ctx.clearRect(0, 0, self.width, self.height);

        self.drawYears();

        requestAnimationFrame(Timeline.draw);
    },

    drawYears : function() {
        this.traverseYears(function(key, year) {
            year.draw(this.ctx);
        });
    },

    update : function(position) {

        // Append new year
        var currentLeft = position.left,
            currentIndex = this.currentYear.index,
            yearWidth = this.width,
            currentMaxLeft = yearWidth * Math.max(1, currentIndex);

        // Append new year when current year is dragged to left
        if (currentMaxLeft + (currentLeft * -1) > this.nextMaxLeft) {
            this.nextMaxLeft = this.width * Math.max(2, this.years.length);
            var newYear = this.appendYear.call(this);
        }

        if (currentMaxLeft + (currentLeft * -1) > this.nextMaxLeft - this.width / 2) {
            /*
            this.currentYear.update(0);
            console.log("update currentYear", this.currentYear.next);
            this.setCurrentYear(this.currentYear.next);
            */
        }

        this.currentYear.update(currentLeft);
    },

    setCurrentYear : function(year) {
        console.log('Set currentYear', year.number);
        this.currentYear = year;
    },

    appendYear : function() {

        var lastYear = this.years[this.years.length - 1],
            lastYearNumber = lastYear.number,
            newYearNumber = lastYearNumber + 1;

        if (this.yearExists(newYearNumber) < 0) {
            var newYear = this.addYear(newYearNumber);

            newYear.setPrev(lastYear);
            lastYear.setNext(newYear);
            this.timeline.append(newYear.node);
            this.afterAddingYear(newYear);

            console.log("appended");
            return newYear;
        }

        return this.currentYear;
    },

    prependYear : function() {

        var firstYear = this.timeline.find('.year').first(),
            firstYearNumber = parseInt(firstYear.data('number'), 10),
            newYearNumber = firstYearNumber - 1;

        if (this.yearExists(newYearNumber) < 0) {
            var newYear = this.addYear(newYearNumber);
            newYear.setNext(firstYear);
            firstYear.setPrev(newYear);
            this.timeline.prepend(newYear.node);
            this.afterAddingYear(newYear);
        }
    },

    afterAddingYear : function(year) {
    },


    setYearLabel : function(year) {
        jQuery('#currentYearLabel').text(year);
    },

    addYear : function(year) {

        var newYear = new Year({
            number : year,
            x : this.yearWidth * this.years.length,
            y : this.height / 2
        });

        this.years.push(newYear);

        return newYear;
    },

    addEvent : function(event) {

        var year = event.year,
            yearIndex = this.yearExists(year);

        if (yearIndex > -1) {
            this.years[yearIndex].addEvent(event);
        } else {
            var newYear = this.addYear(year);
            newYear.addEvent(event);
        }
    },

    yearExists : function(searchedYear) {

        this.traverseYears(function(key, year) {
            if (this.years.number === searchedYear) {
                return key;
            }
        });

        return -1;
    },

    traverseYears : function(callback) {

        var len = this.years.length,
            i = 0;

        for (i; i < len; i++) {
            callback.call(this, i, this.years[i]);
        }

    }
};