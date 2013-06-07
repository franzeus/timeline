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

                var currentLeft = ui.position.left;

                // Append new year

                var currentIndex = self.currentYear.node.index();
                var yearWidth = self.width;
                var currentMaxLeft = yearWidth * Math.max(1, currentIndex);

                // Append new year when current year is dragged to left
                if (currentMaxLeft + (currentLeft * -1) > self.maxLeft) {
                    self.maxLeft = self.width * Math.max(2, self.years.length);
                    self.appendYear.call(self);
                }

                self.update.call(self, currentLeft, currentMaxLeft);
            }
        });
    },

    initYears : function() {
        var year = new Date().getFullYear();
            newYear = this.addYear(year, 0);

        this.timeline.append(newYear.node);
        this.currentYear = newYear;
        newYear.afterBuild();
        this.maxLeft = this.currentYear.node.width();
    },

    update : function(currentLeft, currentMaxLeft) {

        if (currentMaxLeft + (currentLeft * -1) > this.maxLeft - this.width / 2) {

            var index = Math.max(2, this.years.length) + 1;
            this.maxLeft = this.width * index;
            console.log(currentLeft);
            this.currentYear.update(0);
            console.log("update currentYear", this.currentYear.next);
            this.currentYear = this.currentYear.next;
        }

        this.currentYear.update(currentLeft);
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
        }
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