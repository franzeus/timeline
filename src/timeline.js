var Timeline = {

    years : [],
    currentYear : null,
    maxLeft : 0,

    init : function() {

        this.timeline = jQuery('#timeline');
        this.width = this.timeline.width();
        this.pixelPerDay = this.timeline.width() / 356;

        this.initYears();
        this.registerEvents();
    },

    registerEvents : function() {

        var self = this;

        this.timeline.draggable({
            axis: "x",
            drag: function(event, ui) {
                self.update.call(self, ui.position);
            }
        });
    },

    initYears : function() {
        var year = new Date().getFullYear();
            newYear = this.addYear(year, 0);

        this.timeline.append(newYear.node);
        this.setCurrentYear(newYear);
        newYear.afterBuild();
        this.nextMaxLeft = this.currentYear.node.width();
    },

    update : function(position) {

        // Append new year
        var currentLeft = position.left,
            currentIndex = this.currentYear.node.index(),
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
            var newYear = this.addYear(newYearNumber, this.timeline.width());

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
            var newYear = this.addYear(newYearNumber, 0);
            newYear.setNext(firstYear);
            firstYear.setPrev(newYear);
            this.timeline.prepend(newYear.node);
            this.afterAddingYear(newYear);
        }
    },

    afterAddingYear : function(year) {
        this.timeline.css({ width : this.width * this.years.length  });
        year.afterBuild();
    },


    setYearLabel : function(year) {
        jQuery('#currentYearLabel').text(year);
    },

    addYear : function(year, left) {
        console.log("adding", year);
        var newYear = new Year(year, left);
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

        var len = this.years.length,
            i = 0;

        for (i; i < len; i++) {
            if (this.years[i].number === searchedYear) {
                return i;
            }
        }

        return -1;
    }
};