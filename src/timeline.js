var Timeline = {

    timeline : null,

    currentMonth : null,
    months : [],

    isMouseDown : false,
    mouseDownX : 0,
    scrollSpeed : 10,
    lockScrolling : false,

    scale : 2,
    zoomFactor : 0.5,

    init : function(options) {

        this.timeline = document.getElementById(options.canvasSelector);
        this.ctx = this.timeline.getContext('2d');

        this.width = this.timeline.width;
        this.height = this.timeline.height;

        this.initMonths();
        this.bindEvents();

        this.draw();
    },

    reset : function() {
        this.months = [];
    },

    initMonths : function(startMonth, startYear) {

        this.reset();

        this.monthWidth = (this.width / this.scale);

        var now = new Date(),
            startMonth = startMonth || now.getMonth(),
            startYear = startYear || now.getFullYear(),
        
            initMonthsLen = Math.round(this.width / this.monthWidth) + 2,
            initMonthX = this.monthWidth * -1;

        for (var i = 0; i < initMonthsLen; i++) {
            
            var x = initMonthX + this.monthWidth * i;
            var year = startYear;
            var monthIndex = startMonth + i - 1;
            
            // Prev year
            if (i === 0 && startMonth === 0) {
                year = startYear - 1;
                monthIndex = 11;
            }

            // Next Year
            if (i > 1 && startMonth === 11) {
                year = startYear + 1;
                monthIndex = 0;
            }
            
            var month = this.getMonthObject(i, monthIndex, x, year);
            this.months.push(month);
        };

        this.setCurrentMonth(this.months[Math.max(this.months.length - 1, 1)]);
    },

    update : function() {

    },

    zoomIn : function() {
        this.scale += this.zoomFactor;
    },

    zoomOut : function() {
        this.scale -= this.zoomFactor;
    },

    setCurrentMonth : function(month) {
        this.currentMonth = month;
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
                x = 0,
                direction = 0;

            // To next year
            if (currentX < this.mouseDownX) {

                direction = -1;
                x -= this.scrollSpeed;

            // To last year
            } else {
                direction = 1;
                x += this.scrollSpeed;
            }

            this.update(x, direction);
            this.lockScrolling = true;
        }

        var self = this;
        setTimeout(function() {
            self.lockScrolling = false;
        }, 100);

        e.stopPropagation();
    },

    draw : function() {

        var ctx = Timeline.ctx,
            self = Timeline;

        ctx.clearRect(0, 0, self.width, self.height);

        ctx.save();

        self.drawMonths();

        self.drawMiddleLine();

        ctx.restore();

        requestAnimationFrame(Timeline.draw);
    },

    drawMiddleLine : function(ctx) {
        this.ctx.fillStyle = '#FF0088';
        this.ctx.fillRect(0, this.height / 2, this.width, 1 * this.scale);
    },

    drawMonths : function() {

        this.traverseMonths(function(i, month) {

            month.draw(this.ctx, this);

        });

    },

    update : function(x, direction) {

        for (var i = 0; i < this.months.length; i++) {

            var month = this.months[i];

            month.offsetX += x;

            var monthX = month.x + month.offsetX;

            if (monthX > ((this.width / 4) * -1) && monthX < this.width / 4 && this.currentMonth !== month) {
                this.setCurrentMonth(month);
            }

        };

        // Prepend a month before the currentMonth if that is the first one
        if (this.months.indexOf(this.currentMonth) === 0) {

            var month = this.getPrevMonthObject();

            this.months.pop();
            this.months.unshift(month);

        // Append a month after the currentMonth if that is the last one
        } else if (this.months.indexOf(this.currentMonth) === this.months.length - 1) {

            var month = this.getNextMonthObject();

            this.months.shift();
            this.months.push(month);
        }

    },

    getNextMonthObject : function() {

        var lastIndex = this.months.length - 1,
            monthIndex = this.currentMonth.monthIndex === 11 ? 0 : this.currentMonth.monthIndex + 1,
            x = this.currentMonth.x + this.currentMonth.offsetX + this.currentMonth.baseWidth,
            year = this.currentMonth.monthIndex === 11 ? this.currentMonth.year + 1 : this.currentMonth.year;

        return this.getMonthObject(lastIndex, monthIndex, x, year);

    },

    getPrevMonthObject : function() {

        var firstIndex = 0,
            monthIndex = this.currentMonth.monthIndex === 0 ? 0 : this.currentMonth.monthIndex - 1,
            x = this.currentMonth.x + this.currentMonth.offsetX - this.currentMonth.baseWidth,
            year = this.currentMonth.monthIndex === 0 ? this.currentMonth.year - 1 : this.currentMonth.year;

        return this.getMonthObject(firstIndex, monthIndex, x, year);

    },

    getMonthObject : function(index, monthIndex, x, year) {

        var baseWidth = (this.width / this.scale);

        var month = new Month({
            index : index,
            monthIndex : monthIndex,
            x : x,
            baseWidth : baseWidth,
            year : year,
            timeline : this
        });

        return month;
    },


    getNumberOfDays : function(month, year) {

        var totalFeb = 28;

        // Feb feels special
        if (month === 1) {
            if ( (year % 100 !== 0) && (year % 4 ===0) || (year % 400 === 0)) {
                totalFeb = 29;
            }
        }

        var dayMap = [31, totalFeb, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        return dayMap[month];
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

    traverseMonths : function(callback) {

        var len = this.months.length,
            i = 0;

        for (i; i < len; i++) {
            callback.call(this, i, this.months[i]);
        }

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

    }    
};
