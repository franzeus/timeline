var Timeline = {

    years : [],
    currentYear : null,

    init : function() {

        this.timeline = jQuery('#timeline');
        this.width = this.timeline.width();
        this.pixelPerDay = Math.floor(this.timeline.width() / 356);

        this.initYears();
        this.registerEvents();
    },

    registerEvents : function() {

        var self = this;

        this.timeline.draggable({
            axis: "x",
            drag: function(event, ui) {
                //console.log(Math.abs(ui.position.left), self.timeline.width());

                var currentLeft = ui.position.left;

                // Append new year
                if (Math.abs(currentLeft) > self.timeline.width() / 2) {
                    self.appendYear.call(self);
                }

                //self.prependYear.call(self);
            }
        });
    },

    initYears : function() {
        var year = new Date().getFullYear();
            newYear = this.addYear(year, 0);

        this.timeline.append(newYear.node);
    },

    appendYear : function() {

        var lastYearNumber = this.years[this.years.length - 1].number,
            newYearNumber = lastYearNumber + 1;

        if (!this.yearExists()) {
            var newYear = this.addYear(newYearNumber, this.timeline.width());
            this.timeline.css({ width : this.timeline.width() + jQuery('#timelineWrapper').width() });
            this.timeline.append(newYear.node);
        }
    },

    prependYear : function() {

        var firstYear = this.timeline.find('.year').first(),
            firstYearNumber = parseInt(firstYear.data('number'), 10),
            newYearNumber = firstYearNumber - 1;

        if (!this.yearExists(newYearNumber)) {
            var newYear = this.addYear(newYearNumber, 0);
            this.timeline.css({ width : this.timeline.width() + jQuery('#timelineWrapper').width() });
            this.timeline.prepend(newYear.node);
        }
    },


    setYearLabel : function(year) {
        jQuery('#currentYearLabel').text(year);
    },

    addYear : function(year, left) {

        //console.trace(year, left);

        var newYear = new Year(year, left);
        this.years.push(newYear);

        return newYear;
    },

    addEvent : function(event) {

        var year = event.year;

        if (this.yearExists(year)) {
            var indexOfYear = this.years.indexOf(year);
            this.years[indexOfYear].addEvent(event);
        } else {
            var newYear = this.addYear(year);
            newYear.addEvent(event);
        }
    },

    yearExists : function(year) {
        return this.years.indexOf(year) > -1;
    }
};