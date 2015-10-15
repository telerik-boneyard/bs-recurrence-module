if (typeof window === 'undefined') {
    var should = require('should');
    var moment = require('moment');
    var recurrence = require('../dist/recurrence.js');
}

var getNow = function getNow() {
    return moment({
        year: 2015,
        month: 8,
        day: 23,
        hour: 10,
        minute: 30
    });
};

var getDate = function getDate(year, month, day, hour, minute) {
    var d = moment({
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute
    });

    return d.toDate();
};

var returnDate = function returnDate(date) {
    return function () {
        return date;
    }
};

// Now is Sep 23 2015, 10:30 AM UTC
recurrence._now = getNow;

var compareFirst = function (rec, fromDate, fromTime, expected) {
    var actual = moment(recurrence.next(rec, fromDate, fromTime, true)).startOf('minute').toDate();
    actual.should.deepEqual(expected);
};

var compareNext = function (rec, fromDate, fromTime, expected) {
    var actual = moment(recurrence.next(rec, fromDate, fromTime, false)).startOf('minute').toDate();
    actual.should.deepEqual(expected);
};

var getStartTime = function (hours, minutes) {
    return hours * 60 + minutes;
};

suite('recurrence - happy path', function () {
    // runs before every test and clears the get_now
    setup(function () {
        recurrence._now = getNow;
    });

    suite('Once - must schedule for 10:45', function() {
        var rec = {
            Type: 0 // Once
        };

        var startDate = getNow().startOf('day').toDate();
        var startTime = getStartTime(10, 45);

        var d1 = getDate(2015, 8, 23, 10, 45);
        test('First occurrence should be at Sep 23 2015, 10:45 AM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });
    });

    suite('Once - must schedule for 10:30', function() {
        var rec = {
            Type: 0 // Once
        };

        var startDate = getNow().startOf('day').toDate();
        var startTime = getStartTime(10, 30);

        var d1 = getDate(2015, 8, 23, 10, 30);
        test('First occurrence at Current time - should raise an error.', function () {
            try {
                compareFirst(rec, startDate, startTime, d1);
            } catch(e) {
                e.message.should.equal('Cannot schedule a once execution in the past.');
            }
        });
    });

    suite('Once - must schedule for 10:30, now is 10:30:16', function() {
        var rec = {
            Type: 0 // Once
        };

        var startDate = getNow().startOf('day').toDate();
        var startTime = getStartTime(10, 30);

        // now is 10:30:16
        var nowDate = moment({
            year: 2015,
            month: 8,
            day: 23,
            hour: 10,
            minute: 30,
            second: 16
        }).startOf('minute').toDate();

        var d1 = getDate(2015, 8, 23, 10, 30);

        test('First occurrence at Current time - should raise an error.', function () {
            recurrence._now = returnDate(nowDate);
            try {
                compareFirst(rec, startDate, startTime, d1);
            } catch(e) {
                e.message.should.equal('Cannot schedule a once execution in the past.');
            }
        });
    });

    suite('Every 3 hours starts at 18:25', function () {
        var rec = {
            Type: 2, // Hours
            Interval: 3
        };
        var startDate = getNow().startOf('day').toDate();
        var startTime = getStartTime(18, 25);

        var d1 = getDate(2015, 8, 23, 18, 25);
        test('First occurrence should be at Sep 23 2015, 18:25 PM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });


        var d2 = getDate(2015, 8, 23, 21, 25);
        test('Next occurrence should be at occurrence should be at Sep 23 2015, 21:25 PM', function () {
            recurrence._now = returnDate(d1);
            compareNext(rec, d1, startTime, d2);
        });

        var d3 = getDate(2015, 8, 24, 0, 25);
        test('Next occurrence should be at occurrence should be at Sep 24 2015, 00:25 AM', function () {
            recurrence._now = returnDate(d2);
            compareNext(rec, d2, startTime, d3);
        });

        var d4 = getDate(2015, 8, 24, 3, 25);
        test('Next occurrence should be at occurrence should be at Sep 24 2015, 03:25 AM', function () {
            recurrence._now = returnDate(d3);
            compareNext(rec, d3, startTime, d4);
        });
    });

    suite('Every 45 minutes starts at 10:41', function () {
        var rec = {
            Type: 1, // minutes
            Interval: 45
        };
        var startDate = getNow().startOf('minutes').toDate();
        var startTime = getStartTime(10, 41);

        var d1 = getDate(2015, 8, 23, 10, 41);
        test('First occurrence should be at Sep 23 2015, 10:41 PM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });


        var d2 = getDate(2015, 8, 23, 11, 26);
        test('Next occurrence should be at occurrence should be at Sep 23 2015, 11:26 PM', function () {
            recurrence._now = returnDate(d1);
            compareNext(rec, d1, startTime, d2);
        });

        var d3 = getDate(2015, 8, 23, 12, 11);
        test('Next occurrence should be at occurrence should be at Sep 23 2015, 12:11 PM', function () {
            recurrence._now = returnDate(d2);
            compareNext(rec, d2, startTime, d3);
        });
    });

    suite('Every 40 days starts at 15:00', function () {
        var rec = {
            Type: 3, //days
            Interval: 40
        };

        var startDate = getNow().startOf('minutes').toDate();
        var startTime = getStartTime(15, 0);

        var d1 = getDate(2015, 8, 23, 15, 0);
        test('First occurrence should be at Sep 23 2015, 15:00 PM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });

        var d2 = getDate(2015, 10, 2, 15, 0);
        test('Next occurrence should be at occurrence should be at Nov 02 2015, 15:00 PM', function () {
            recurrence._now = returnDate(d1);
            compareNext(rec, d1, startTime, d2);
        });

        var d3 = getDate(2015, 11, 12, 15, 0);
        test('Next occurrence should be at occurrence should be at Dec 12 2015, 15:00 PM', function () {
            recurrence._now = returnDate(d2);
            compareNext(rec, d2, startTime, d3);
        });

        var d4 = getDate(2016, 0, 21, 15, 0);
        test('Next occurrence should be at occurrence should be at Jan 21 2016, 15:00 PM', function () {
            recurrence._now = returnDate(d3);
            compareNext(rec, d3, startTime, d4);
        });
    });

    suite('Every 7 months starts at the 7th', function () {
        var rec = {
            Type: 5, // months
            Interval: 7,
            Day: 7
        };
        var startDate = getNow().startOf('minutes').toDate();
        var startTime = getStartTime(15, 3);

        var d1 = getDate(2015, 9, 7, 15, 3);
        test('First occurrence should be at Oct 7 2015, 15:03 PM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });

        var d2 = getDate(2016, 4, 7, 15, 3);
        test('Next occurrence should be at occurrence should be at May 7 2016, 15:03 PM', function () {
            recurrence._now = returnDate(d1);
            compareNext(rec, d1, startTime, d2);
        });

        var d3 = getDate(2016, 11, 7, 15, 3);
        test('Next occurrence should be at occurrence should be at Dec 7 2016, 15:03 PM', function () {
            recurrence._now = returnDate(d2);
            compareNext(rec, d2, startTime, d3);
        });

        var d4 = getDate(2017, 6, 7, 15, 3);
        test('Next occurrence should be at occurrence should be at Jul 7 2017, 15:03 PM', function () {
            recurrence._now = returnDate(d3);
            compareNext(rec, d3, startTime, d4);
        });
    });

    suite('Every 6 weeks starts at the Wednesday', function () {
        var rec = {
            Type: 4, // weeks
            Interval: 6,
            Day: 3
        };
        var startDate = getNow().startOf('minutes').toDate();
        var startTime = getStartTime(15, 3);

        var d1 = getDate(2015, 8, 23, 15, 3);
        test('First occurrence should be at Sep 23 2015, 15:03 PM (Today)', function () {
            compareFirst(rec, startDate, startTime, d1);
        });

        test('First occurrence should be at Sep 23 2015, 15:03 PM (Tomorrow)', function () {
            // now it's Sep 22 2015, 10:00 PM
            recurrence._now = returnDate(moment(getDate(2015, 8, 22, 10, 0)));

            compareFirst(rec, startDate, startTime, d1);
        });

        var d11 = getDate(2015, 8, 30, 15, 3);
        test('First occurrence should be at Sep 30 2015, 15:03 PM (Next week)', function () {
            var retDate = moment(getNow()).add({hours: 7});
            recurrence._now = returnDate(retDate);

            compareFirst(rec, startDate, startTime, d11);
        });

        var d2 = getDate(2015, 10, 4, 15, 3);
        test('Next occurrence should be at occurrence should be at Nov 04 2015, 15:03 PM', function () {
            recurrence._now = returnDate(d1);
            compareNext(rec, d1, startTime, d2);
        });

        var d3 = getDate(2015, 11, 16, 15, 3);
        test('Next occurrence should be at occurrence should be at Dec 16 2015, 15:03 PM', function () {
            recurrence._now = returnDate(d2);
            compareNext(rec, d2, startTime, d3);
        });
    });

    /* THIS TEST IS INVALID NOW.
    suite('Once with passed date and time - must execute immediately', function () {
        var rec = {
            Type: 0 // once
        };

        var startDate = getNow();
        var startTime = getStartTime(0, 0);

        var d1 = getDate(2015, 8, 23, 0, 0);
        test('First occurrence should be at Sep 23 2015, 00:00 PM (Today)', function () {
            compareFirst(rec, startDate, startTime, d1);
        });

        // TODO: test('Once: now is before the execution start time.')
    });
    */

    suite('Every 1 month, starting at the 31-st', function () {
        var rec = {
            Type: 5, // months
            Interval: 1, // single month
            Day: 31
        };

        // Today is 10.07.2015 year, at 15:30 PM
        var today = getDate(2015, 9, 7, 15, 30);
        recurrence._now = returnDate(today);

        var startDate = moment(today).startOf('minutes').toDate();
        var startTime = getStartTime(12, 0);

        var d1 = getDate(2015, 9, 31, 12, 0);
        test('First occurrence should be at Oct 31 2015, 08:00 PM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });

        var d2 = getDate(2015, 10, 30, 12, 0);
        test('Next occurrence should be at occurrence should be at Dec 31 2015, 12:00 PM', function () {
            recurrence._now = returnDate(d1);
            compareNext(rec, d1, startTime, d2);
        });

        var d3 = getDate(2015, 11, 31, 12, 0);
        test('Next occurrence should be at occurrence should be at Nov 31 2015, 12:00 PM', function () {
            recurrence._now = returnDate(d2);
            compareNext(rec, d2, startTime, d3);
        });

        var d4 = getDate(2016, 0, 31, 12, 0);
        test('Next occurrence should be at occurrence should be at Jan 31 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d3);
            compareNext(rec, d3, startTime, d4);
        });

        var d5 = getDate(2016, 1, 29, 12, 0);
        test('Next occurrence should be at occurrence should be at Feb 29 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d4);
            compareNext(rec, d4, startTime, d5);
        });

        var d6 = getDate(2016, 2, 31, 12, 0);
        test('Next occurrence should be at occurrence should be at Mar 31 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d5);
            compareNext(rec, d5, startTime, d6);
        });

        var d7 = getDate(2016, 3, 30, 12, 0);
        test('Next occurrence should be at occurrence should be at Apr 30 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d6);
            compareNext(rec, d6, startTime, d7);
        });

        var d8 = getDate(2016, 4, 31, 12, 0);
        test('Next occurrence should be at occurrence should be at May 30 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d7);
            compareNext(rec, d7, startTime, d8);
        });
    });

    suite('Every 1 month, starting at the 29-th', function () {
        var rec = {
            Type: 5, // months
            Interval: 1, // single month
            Day: 29
        };

        // Today is 10.07.2015 year, at 15:30 PM
        var today = getDate(2015, 9, 7, 15, 30);
        recurrence._now = returnDate(today);

        var startDate = moment(today).startOf('minutes').toDate();
        var startTime = getStartTime(12, 0);

        var d1 = getDate(2015, 9, 29, 12, 0);
        test('First occurrence should be at Oct 29 2015, 08:00 PM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });

        var d2 = getDate(2015, 10, 29, 12, 0);
        test('Next occurrence should be at occurrence should be at Nov 29 2015, 12:00 PM', function () {
            recurrence._now = returnDate(d1);
            compareNext(rec, d1, startTime, d2);
        });

        var d3 = getDate(2015, 11, 29, 12, 0);
        test('Next occurrence should be at occurrence should be at Dec 29 2015, 12:00 PM', function () {
            recurrence._now = returnDate(d2);
            compareNext(rec, d2, startTime, d3);
        });

        var d4 = getDate(2016, 0, 29, 12, 0);
        test('Next occurrence should be at occurrence should be at Jan 29 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d3);
            compareNext(rec, d3, startTime, d4);
        });

        var d5 = getDate(2016, 1, 29, 12, 0);
        test('Next occurrence should be at occurrence should be at Feb 29 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d4);
            compareNext(rec, d4, startTime, d5);
        });

        var d6 = getDate(2016, 2, 29, 12, 0);
        test('Next occurrence should be at occurrence should be at Mar 29 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d5);
            compareNext(rec, d5, startTime, d6);
        });

        var d7 = getDate(2016, 3, 29, 12, 0);
        test('Next occurrence should be at occurrence should be at Apr 29 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d6);
            compareNext(rec, d6, startTime, d7);
        });

        var d8 = getDate(2016, 4, 29, 12, 0);
        test('Next occurrence should be at occurrence should be at May 29 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d7);
            compareNext(rec, d7, startTime, d8);
        });
    });

    suite('Every 1 month, starting at the 30-th', function () {
        var rec = {
            Type: 5, // months
            Interval: 1, // single month
            Day: 30
        };

        // Today is 10.07.2015 year, at 15:30 PM
        var today = getDate(2015, 9, 7, 15, 30);
        recurrence._now = returnDate(today);

        var startDate = moment(today).startOf('minutes').toDate();
        var startTime = getStartTime(12, 0);

        var d1 = getDate(2015, 9, 30, 12, 0);
        test('First occurrence should be at Oct 30 2015, 08:00 PM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });

        var d2 = getDate(2015, 10, 30, 12, 0);
        test('Next occurrence should be at occurrence should be at Nov 30 2015, 12:00 PM', function () {
            recurrence._now = returnDate(d1);
            compareNext(rec, d1, startTime, d2);
        });

        var d3 = getDate(2015, 11, 30, 12, 0);
        test('Next occurrence should be at occurrence should be at Dec 30 2015, 12:00 PM', function () {
            recurrence._now = returnDate(d2);
            compareNext(rec, d2, startTime, d3);
        });

        var d4 = getDate(2016, 0, 30, 12, 0);
        test('Next occurrence should be at occurrence should be at Jan 30 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d3);
            compareNext(rec, d3, startTime, d4);
        });

        var d5 = getDate(2016, 1, 29, 12, 0);
        test('Next occurrence should be at occurrence should be at Feb 29 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d4);
            compareNext(rec, d4, startTime, d5);
        });

        var d6 = getDate(2016, 2, 30, 12, 0);
        test('Next occurrence should be at occurrence should be at Mar 30 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d5);
            compareNext(rec, d5, startTime, d6);
        });

        var d7 = getDate(2016, 3, 30, 12, 0);
        test('Next occurrence should be at occurrence should be at Apr 30 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d6);
            compareNext(rec, d6, startTime, d7);
        });

        var d8 = getDate(2016, 4, 30, 12, 0);
        test('Next occurrence should be at occurrence should be at May 30 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d7);
            compareNext(rec, d7, startTime, d8);
        });
    });

    suite('Every 1 month, starting at the 28-th', function () {
        var rec = {
            Type: 5, // months
            Interval: 1, // single month
            Day: 28
        };

        // Today is 10.07.2015 year, at 15:30 PM
        var today = getDate(2015, 9, 7, 15, 30);
        recurrence._now = returnDate(today);

        var startDate = moment(today).startOf('minutes').toDate();
        var startTime = getStartTime(12, 0);

        var d1 = getDate(2015, 9, 28, 12, 0);
        test('First occurrence should be at Oct 28 2015, 08:00 PM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });

        var d2 = getDate(2015, 10, 28, 12, 0);
        test('Next occurrence should be at occurrence should be at Nov 28 2015, 12:00 PM', function () {
            recurrence._now = returnDate(d1);
            compareNext(rec, d1, startTime, d2);
        });

        var d3 = getDate(2015, 11, 28, 12, 0);
        test('Next occurrence should be at occurrence should be at Dec 28 2015, 12:00 PM', function () {
            recurrence._now = returnDate(d2);
            compareNext(rec, d2, startTime, d3);
        });

        var d4 = getDate(2016, 0, 28, 12, 0);
        test('Next occurrence should be at occurrence should be at Jan 28 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d3);
            compareNext(rec, d3, startTime, d4);
        });

        var d5 = getDate(2016, 1, 28, 12, 0);
        test('Next occurrence should be at occurrence should be at Feb 28 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d4);
            compareNext(rec, d4, startTime, d5);
        });

        var d6 = getDate(2016, 2, 28, 12, 0);
        test('Next occurrence should be at occurrence should be at Mar 28 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d5);
            compareNext(rec, d5, startTime, d6);
        });

        var d7 = getDate(2016, 3, 28, 12, 0);
        test('Next occurrence should be at occurrence should be at Apr 28 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d6);
            compareNext(rec, d6, startTime, d7);
        });

        var d8 = getDate(2016, 4, 28, 12, 0);
        test('Next occurrence should be at occurrence should be at May 28 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d7);
            compareNext(rec, d7, startTime, d8);
        });
    });

    suite('Every 1 month, starting at the 1-st', function () {
        var rec = {
            Type: 5, // months
            Interval: 1, // single month
            Day: 1
        };

        // Today is 10.07.2015 year, at 15:30 PM
        var today = getDate(2015, 9, 1, 15, 30);
        recurrence._now = returnDate(today);

        var startDate = moment(today).startOf('minutes').toDate();
        var startTime = getStartTime(12, 0);

        var d1 = getDate(2015, 9, 1, 12, 0);
        test('First occurrence should be at Oct 1 2015, 08:00 PM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });

        var d2 = getDate(2015, 10, 1, 12, 0);
        test('Next occurrence should be at occurrence should be at Nov 1 2015, 12:00 PM', function () {
            recurrence._now = returnDate(d1);
            compareNext(rec, d1, startTime, d2);
        });

        var d3 = getDate(2015, 11, 1, 12, 0);
        test('Next occurrence should be at occurrence should be at Dec 1 2015, 12:00 PM', function () {
            recurrence._now = returnDate(d2);
            compareNext(rec, d2, startTime, d3);
        });

        var d4 = getDate(2016, 0, 1, 12, 0);
        test('Next occurrence should be at occurrence should be at Jan 1 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d3);
            compareNext(rec, d3, startTime, d4);
        });

        var d5 = getDate(2016, 1, 1, 12, 0);
        test('Next occurrence should be at occurrence should be at Feb 1 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d4);
            compareNext(rec, d4, startTime, d5);
        });

        var d6 = getDate(2016, 2, 1, 12, 0);
        test('Next occurrence should be at occurrence should be at Mar 1 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d5);
            compareNext(rec, d5, startTime, d6);
        });

        var d7 = getDate(2016, 3, 1, 12, 0);
        test('Next occurrence should be at occurrence should be at Apr 1 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d6);
            compareNext(rec, d6, startTime, d7);
        });

        var d8 = getDate(2016, 4, 1, 12, 0);
        test('Next occurrence should be at occurrence should be at May 1 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d7);
            compareNext(rec, d7, startTime, d8);
        });
    });

    suite('Every 2-nd month, starting at the 31-st', function () {
        var rec = {
            Type: 5, // months
            Interval: 2, // every 2 months
            Day: 31
        };

        // Today is 12.07.2015 year, at 15:30 PM
        var today = getDate(2015, 11, 7, 15, 30);
        recurrence._now = returnDate(today);

        var startDate = moment(today).startOf('minutes').toDate();
        var startTime = getStartTime(12, 0);

        var d1 = getDate(2015, 11, 31, 12, 0);
        test('First occurrence should be at Dec 31 2015, 08:00 PM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });

        var d2 = getDate(2016, 1, 29, 12, 0);
        test('Next occurrence should be at occurrence should be at Feb 29 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d1);
            compareNext(rec, d1, startTime, d2);
        });

        var d3 = getDate(2016, 3, 30, 12, 0);
        test('Next occurrence should be at occurrence should be at Apr 30 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d2);
            compareNext(rec, d2, startTime, d3);
        });

        var d4 = getDate(2016, 5, 30, 12, 0);
        test('Next occurrence should be at occurrence should be at Jun 30 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d3);
            compareNext(rec, d3, startTime, d4);
        });

        var d5 = getDate(2016, 7, 31, 12, 0);
        test('Next occurrence should be at occurrence should be at Aug 31 2016, 12:00 PM', function () {
            recurrence._now = returnDate(d4);
            compareNext(rec, d4, startTime, d5);
        });
    });

    suite('Every 3 minutes, first occurrence, start time in the past', function() {
        var rec = {
            Type: 1, // Minutes
            Interval: 3
        };

        var startDate = getNow().startOf('day').toDate();
        var startTime = getStartTime(10, 28);

        var d1 = getDate(2015, 8, 23, 10, 31);
        test('First occurrence should be at Sep 23 2015, 10:31 AM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });
    });

    suite('Every 3 minutes, first occurrence, start time in now', function() {
        var rec = {
            Type: 1, // Minutes
            Interval: 3
        };

        var startDate = getNow().startOf('day').toDate();
        var startTime = getStartTime(10, 30);

        var d1 = getDate(2015, 8, 23, 10, 33);
        test('First occurrence should be at Sep 23 2015, 10:33 AM', function () {
            compareFirst(rec, startDate, startTime, d1);
        });
    });

    suite('Improvements', function () {
        var rec = {
            Type: recurrence.Constants.Type.Once,
            Day: 1
        };

        test('Once, Date.Now + 2 mins, First Occurrence check', function () {
            var startDate = getNow();
            var startTime = getStartTime(startDate.hour(), startDate.minutes() + 2);

            var date = getNow().add({minutes: 2}).toDate();
            compareFirst(rec, startDate, startTime, date);
        });

        test('Before 3 hours, On every hour, Must schedule for 11:00', function () {
            var rec = {
                Type: recurrence.Constants.Type.Hours, // every one hour
                Interval: 1
            };

            var before3Hours = getNow().add({hours: -3, minutes: 30});
            var startTime = getStartTime(7, 0);
            var d1 = getDate(2015, 8, 23, 11, 0);

            compareNext(rec, before3Hours, startTime, d1);
        });
    });
});

suite('describe', function () {
    var testDescribe = function (job, exp) {
        var res = recurrence.describe(job);
        res.should.be.exactly(exp);
    };

    test('Every 5 minutes from Today 8:20 AM, until Sep 08, 2015', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Minutes,
                Interval: 5
            },
            EndType: recurrence.Constants.EndType.EndDate,
            EndValue: moment('8/9/2015', 'D/M/YYYY').toDate(),
            StartDate: moment().hours(8).minutes(20).toDate()
        }, this.test.title);
    });

    test('Every 5 minutes from Today 5:40 PM, until Sep 08, 2015', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Minutes,
                Interval: 5
            },
            EndType: recurrence.Constants.EndType.EndDate,
            EndValue: moment('8/9/2015', 'D/M/YYYY').toDate(),
            StartDate: moment().hours(17).minutes(40).toDate()
        }, this.test.title);
    });

    test('Single execution scheduled for Today 9:29 AM', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Once
            },
            StartDate: moment().hours(9).minutes(29).toDate()
        }, this.test.title);
    });

    test('Every 16 weeks from Dec 10, 2016 5:00 AM on Wed, until Dec 15, 2017', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Weeks,
                Interval: 16,
                Day: 3
            },
            EndType: recurrence.Constants.EndType.EndDate,
            EndValue: moment('15/12/2017', 'D/M/YYYY').toDate(),
            StartDate: moment('10/12/2016', 'D/M/YYYY').hours(5).toDate()
        }, this.test.title);
    });

    test('Every 6 months from Nov 05, 2015 6:00 PM on 1st, until Nov 06, 2015', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Months,
                Interval: 6,
                Day: 1
            },
            EndType: recurrence.Constants.EndType.EndDate,
            EndValue: moment('6/11/2015', 'D/M/YYYY').toDate(),
            StartDate: moment('5/11/2015', 'D/M/YYYY').hours(18).toDate()
        }, this.test.title);
    });

    test('Every 6 months from Nov 05, 2015 2:00 PM on 2nd, until Not set', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Months,
                Interval: 6,
                Day: 2
            },
            StartDate: moment('5/11/2015', 'D/M/YYYY').hours(14).toDate()
        }, this.test.title);
    });

    test('Every 6 months from Not set until Nov 06, 2015', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Months,
                Interval: 6
            },
            EndType: recurrence.Constants.EndType.EndDate,
            EndValue: moment('6/11/2015', 'D/M/YYYY').toDate()
        }, this.test.title)
    });

    test('Every 6 months from Nov 05, 2015 1:00 AM on Not set, until Not set', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Months,
                Interval: 6
            },
            StartDate: moment('5/11/2015', 'D/M/YYYY').hours(1).toDate()
        }, this.test.title);
    });

    test('Every 6 months from Nov 05, 2015 12:00 AM on Not set, until after 5 occurrences', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Months,
                Interval: 6
            },
            StartDate: moment('5/11/2015', 'D/M/YYYY').toDate(),
            EndType: recurrence.Constants.EndType.NumberOfOccurences,
            EndValue: 5
        }, this.test.title);
    });

    test('Every 6 months from Nov 05, 2015 12:00 AM on Not set, until after 5 occurrences', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Months,
                Interval: 6
            },
            StartDate: moment('5/11/2015', 'D/M/YYYY').toDate(),
            EndType: recurrence.Constants.EndType.NumberOfOccurences,
            EndValue: 5
        }, this.test.title);
    });

    test('Every 6 months from Nov 05, 2015 12:00 AM on 28th', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Months,
                Interval: 6,
                Day: 28
            },
            StartDate: moment('5/11/2015', 'D/M/YYYY').toDate(),
            EndType: recurrence.Constants.EndType.Unlimited
        }, this.test.title);
    });

    test('Every 3 months from Today 9:29 AM on 3rd, until after 1 occurrences', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Months,
                Interval: 3,
                Day: 3
            },
            EndType: recurrence.Constants.EndType.NumberOfOccurences,
            EndValue: 1,
            StartDate: moment().hours(9).minutes(29).toDate()
        }, this.test.title);
    });

    test('Every day from Today, 9:29 AM', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Days,
                Interval: 1
            },
            EndType: recurrence.Constants.EndType.Unlimited,
            StartDate: moment().hours(9).minutes(29).toDate()
        }, this.test.title);
    });

    test('Single execution scheduled for Nov 05, 2015 8:20 AM', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Once,
                Interval: null
            },
            StartDate: moment('5/11/2015', 'D/M/YYYY').hours(8).minutes(20).toDate()
        }, this.test.title);
    });

    test('Every 6 days from Oct 12, 2015 4:00 PM', function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Days,
                Interval: 6
            },
            EndType: recurrence.Constants.EndType.Unlimited,
            StartDate: moment('12/10/2015', 'D/M/YYYY').hours(16).minutes(0).toDate()
        }, this.test.title);
    });
});