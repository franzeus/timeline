var Timeline = {

    years : [],
    scale : 2,
    currentYear : null,
    maxLeft : 0,
    timeline : null,

    cameraX : 0,
    cameraY : 0,

    isMouseDown : false,
    mouseDownX : 0,
    scrollSpeed : 10,
    lockScrolling : false,

    init : function(options) {

        this.timeline = document.getElementById(options.canvasSelector);
        this.ctx = this.timeline.getContext('2d');

        this.width = this.timeline.width;
        this.height = this.timeline.height;

        this.yearWidth = this.width;
        this.pixelPerMonth = this.yearWidth / 12;
        this.pixelPerDay = this.yearWidth / 356;

        this.initYears();
        this.bindEvents();

        this.draw();
    },

    bindEvents : function() {

        var self = this;

        this.timeline.addEventListener('mousedown', function(e) {
            self.mousedownHandler.call(self, e);
        });

        this.timeline.addEventListener('mouseup', function(e) {
            self.mouseupHandler.call(self, e);
        });

        this.timeline.addEventListener('mousemove', function(e) {
            self.mousemoveHandler.call(self, e);
        });

        this.timeline.addEventListener('mouseout', function(e) {
            self.mouseupHandler.call(self, e);
        });

    },

    mousedownHandler : function(e) {
        this.isMouseDown = true;
        this.mouseDownX = e.clientX;
        this.lockScrolling = false;
    },

    mouseupHandler : function(e) {
        this.isMouseDown = false;
        this.lockScrolling = true;
    },

    mousemoveHandler : function(e) {

        if (this.isMouseDown && !this.lockScrolling) {

            var currentX = e.clientX,
                direction = 0;

            // To next year
            if (currentX < this.mouseDownX) {

                direction = -1;
                //this.cameraX -= this.scrollSpeed;
                this.currentYear.x -= this.scrollSpeed;

            // To last year
            } else {
                direction = 1;
                //this.cameraX += this.scrollSpeed;
                this.currentYear.x += this.scrollSpeed;
            }

            this.update(direction);

            this.lockScrolling = true;
        }

        var self = this;
        setTimeout(function() {
            self.lockScrolling = false;
        }, 100);

        e.stopPropagation();
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

        ctx.save();

        //ctx.translate(self.cameraX, self.cameraY);

        self.drawYears();

        ctx.fillStyle = '#FF000';
        ctx.fillRect(self.cameraX, 0, 1, self.height);

        ctx.restore();

        requestAnimationFrame(Timeline.draw);
    },

    drawYears : function() {

        var options = {
            width : this.width,
            height : this.height,
            scale : this.scale
        }

        this.traverseYears(function(key, year) {
            year.draw(this.ctx, options);
        });
    },

    update : function(direction) {

        console.log(this.cameraX, this.currentYear.x, direction);

        // Scrolling to prev year
        if (this.cameraX > this.currentYear.x && direction > 0) {
            
            console.log("Scrolling to prev year");
            //if (!this.currentYear.prev)


        // Scrolling to next year
        } else {

            console.log("Scrolling to next year");

        }




        return;
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
            index : this.years.length,
            number : year
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

    },

    findYearByNumber : function(searchedYear) {

        var yearObj = null,
            len = this.years.length,
            i = 0;

        for (i; i < len; i++) {
            if (this.years[i].number === searchedYear) {
                yearObj = this.years[i];
            }
        }

        return yearObj;
    },

    getPositionOfDate : function(day, month, year) {

        var day = day || 1;
        var month = month || 1;
        var year = year || this.currentYear.number;

        var yearObj = this.findYearByNumber(year);
        var monthObj = yearObj.months[month - 1];
        var dayObj = monthObj.days[day - 1];

        var x = dayObj.x;

        var direction = this.currentYear.number >= yearObj.number ? -1 : 1;

        return { x : x , direction: direction };
    },


    goToDate : function(day, month, year) {

        var position = this.getPositionOfDate(day, month, year);
        this.setCameraPosition(position.x * position.direction);
    },

    initAnimateToDate : function(day, month, year) {

        var position = this.getPositionOfDate(day, month, year);
        this.animateToDate(Math.round(position.x * position.direction), position.direction);

    },

    animateToDate : function(x, direction) {

        var cameraX = Math.round(this.cameraX),
            self = this;

        //console.log(cameraX, x);

        if (cameraX >= x) {

            setTimeout(function() {
                var newX = cameraX + 100 * direction * self.scale;

                self.setCameraPosition(newX);
                self.animateToDate(x, direction);

            }, 60);
        }

    },

    setCameraPosition : function(x, y) {

        var x = x || 0;
        var y = y || 0;

        this.cameraX = x;
        this.cameraY = y;

        return this;

    },
};
