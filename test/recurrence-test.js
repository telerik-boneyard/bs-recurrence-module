if (typeof window === 'undefined') {
    var should = require('should');
    var moment = require('moment');
    var recurrence = require('../dist/recurrence.js');
}

var getNow = function getNow() {
    return moment({
        year: 2015,
        month: 9,
        day: 23,
        hour: 10,
        minute: 30
    });
};

// Now is Sep 23 2015, 10:30 AM UTC
recurrence._now = function() {
    return getNow();
};

var getNextOccurrence = function (start, interval, type) {
    var units = {
        1: 'm',
        2: 'h',
        3: 'd',
        4: 'w',
        5: 'M'
    };
    var unit = units[type];
    var nextExecutionTime = moment(start).add(interval, unit).toDate();
    return nextExecutionTime;
};

var compareFirstOccurrence = function (rec, exp) {
    var res = moment(recurrence.next(rec, exp, true)).startOf('minute').toDate();
    res.should.deepEqual(exp);
};

var compareNextOccurrence = function (rec, exp, start) {
    var res = moment(recurrence.next(rec, start)).startOf('minute').toDate();
    res.should.deepEqual(exp);
};

suite('recurrence', function () {
    suite('Every 3 hours starts at 18:25', function () {
        var rec = {};
        rec.Type = 2;
        rec.Interval = 3;
        rec.Day = 1;
        var startDate = getNow().startOf('minutes').toDate();

        test('First occurrence should be at ' + startDate, function () {
            compareFirstOccurrence(rec, startDate, startDate);
        });

        var occurrence2 = getNextOccurrence(startDate, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence2, function () {
            compareNextOccurrence(rec, occurrence2, startDate);
        });

        var occurrence3 = getNextOccurrence(occurrence2, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence3, function () {
            compareNextOccurrence(rec, occurrence3, occurrence2);
        });

        var occurrence4 = getNextOccurrence(occurrence3, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence4, function () {
            compareNextOccurrence(rec, occurrence4, occurrence3);
        });

        var occurrence5 = getNextOccurrence(occurrence4, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence5, function () {
            compareNextOccurrence(rec, occurrence5, occurrence4);
        });
    });

    suite('Every 45 minutes starts at 10:41', function () {
        var rec = {};
        rec.Type = 1;
        rec.Interval = 45;
        rec.Day = 1;
        var startDate = getNow().startOf('minutes').toDate();

        test('First occurrence should be at ' + startDate, function () {
            compareFirstOccurrence(rec, startDate);
        });

        var occurrence2 = getNextOccurrence(startDate, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence2, function () {
            compareNextOccurrence(rec, occurrence2, startDate);
        });

        var occurrence3 = getNextOccurrence(occurrence2, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence3, function () {
            compareNextOccurrence(rec, occurrence3, occurrence2);
        });

        var occurrence4 = getNextOccurrence(occurrence3, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence4, function () {
            compareNextOccurrence(rec, occurrence4, occurrence3);
        });

        var occurrence5 = getNextOccurrence(occurrence4, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence5, function () {
            compareNextOccurrence(rec, occurrence5, occurrence4);
        });
    });

    suite('Every 40 days starts at 00:00', function () {
        var rec = {};
        rec.Type = 3;
        rec.Interval = 40;
        rec.Day = 1;
        var startDate = getNow().startOf('minutes').toDate();

        test('First occurrence should be at ' + startDate, function () {
            compareFirstOccurrence(rec, startDate);
        });

        var occurrence2 = getNextOccurrence(startDate, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence2, function () {
            compareNextOccurrence(rec, occurrence2, startDate);
        });

        var occurrence3 = getNextOccurrence(occurrence2, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence3, function () {
            compareNextOccurrence(rec, occurrence3, occurrence2);
        });

        var occurrence4 = getNextOccurrence(occurrence3, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence4, function () {
            compareNextOccurrence(rec, occurrence4, occurrence3);
        });

        var occurrence5 = getNextOccurrence(occurrence4, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence5, function () {
            compareNextOccurrence(rec, occurrence5, occurrence4);
        });
    });

    suite('Every 7 months starts at the 7th', function () {
        var rec = {};
        rec.Type = 5;
        rec.Interval = 7;
        rec.Day = 7;

        var firstExpectedExecution = moment([2015, 11, 07, 00, 00]).toDate();
        test('First occurrence should be at ' + firstExpectedExecution, function () {
            compareFirstOccurrence(rec, firstExpectedExecution);
        });

        var occurrence2 = getNextOccurrence(firstExpectedExecution, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence2, function () {
            compareNextOccurrence(rec, occurrence2, firstExpectedExecution);
        });

        var occurrence3 = getNextOccurrence(occurrence2, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence3, function () {
            compareNextOccurrence(rec, occurrence3, occurrence2);
        });

        var occurrence4 = getNextOccurrence(occurrence3, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence4, function () {
            compareNextOccurrence(rec, occurrence4, occurrence3);
        });

        var occurrence5 = getNextOccurrence(occurrence4, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence5, function () {
            compareNextOccurrence(rec, occurrence5, occurrence4);
        });
    });

    suite('Every 6 weeks starts at the Wednesday', function () {
        var rec = {};
        rec.Type = 4;
        rec.Interval = 6;
        rec.Day = 3;

        var firstExpectedExecution = moment([2015, 10, 18, 00, 00]).toDate();
        test('First occurrence should be at ' + firstExpectedExecution, function () {
            compareFirstOccurrence(rec, firstExpectedExecution);
        });

        var occurrence2 = getNextOccurrence(firstExpectedExecution, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence2, function () {
            compareNextOccurrence(rec, occurrence2, firstExpectedExecution);
        });

        var occurrence3 = getNextOccurrence(occurrence2, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence3, function () {
            compareNextOccurrence(rec, occurrence3, occurrence2);
        });

        var occurrence4 = getNextOccurrence(occurrence3, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence4, function () {
            compareNextOccurrence(rec, occurrence4, occurrence3);
        });

        var occurrence5 = getNextOccurrence(occurrence4, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence5, function () {
            compareNextOccurrence(rec, occurrence5, occurrence4);
        });
    });

    suite('Once - on New Year\'s Eve', function () {
        var rec = {};
        rec.Type = 0;

        var startDate = getNow().startOf('minutes').toDate();

        var firstExpectedExecution = startDate;
        test('First occurrence should be at ' + firstExpectedExecution, function () {
            compareFirstOccurrence(rec, firstExpectedExecution);
        });

        var occurrence2 = getNextOccurrence(firstExpectedExecution, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence2, function () {
            compareNextOccurrence(rec, occurrence2, firstExpectedExecution);
        });

        var occurrence3 = getNextOccurrence(occurrence2, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence3, function () {
            compareNextOccurrence(rec, occurrence3, occurrence2);
        });

        var occurrence4 = getNextOccurrence(occurrence3, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence4, function () {
            compareNextOccurrence(rec, occurrence4, occurrence3);
        });

        var occurrence5 = getNextOccurrence(occurrence4, rec.Interval, rec.Type);
        test('Next occurrence should be at ' + occurrence5, function () {
            compareNextOccurrence(rec, occurrence5, occurrence4);
        });
    });

    suite('Improvements', function() {
        var rec = {
            Type: recurrence.Constants.Type.Once,
            Day: 1
        };
        var startDate = moment().startOf('minutes');

        test('Once, Date.Now + 2 mins, First Occurrence check', function() {
            var date = startDate.add({minutes: 2 }).toDate();
            compareFirstOccurrence(rec, date, date);
        });

        /* NOT DONE YET
        test('Before 3 hours, On every hour, Should schedule for nearest next hour', function() {
            var rec = {
                Type: recurrence.Constants.Type.Hours,
                Interval: 1
            };

            var before3Hours = getNow().add({hours: -3 });

            compareNextOccurrence(rec, 'expected', before3Hours.add({ minutes: 15 }).toDate());
        });*/
    });
});

suite('describe', function () {
    var testDescribe = function (job, exp) {
        var res = recurrence.describe(job);
        res.should.be.exactly(exp);
    };

    test('Every 5 minutes from Today 8:20, until 8/9/2015', function () {
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

test('Single execution scheduled for Today 9:29', function () {
    testDescribe({
        Recurrence: {
            Type: recurrence.Constants.Type.Once
        },
        StartDate: moment().hours(9).minutes(29).toDate()
    }, this.test.title);
});

test('Every 16 weeks from 10/12/2016 on Wed, until 15/12/2017', function () {
    testDescribe({
        Recurrence: {
            Type: recurrence.Constants.Type.Weeks,
            Interval: 16,
            Day: 3
        },
        EndType: recurrence.Constants.EndType.EndDate,
        EndValue: moment('15/12/2017', 'D/M/YYYY').toDate(),
        StartDate: moment('10/12/2016', 'D/M/YYYY').toDate()
    }, this.test.title);
});

test('Every 6 months from 5/11/2015 on 1st, until 6/11/2015', function () {
    testDescribe({
        Recurrence: {
            Type: recurrence.Constants.Type.Months,
            Interval: 6,
            Day: 1
        },
        EndType: recurrence.Constants.EndType.EndDate,
        EndValue: moment('6/11/2015', 'D/M/YYYY').toDate(),
        StartDate: moment('5/11/2015', 'D/M/YYYY').toDate()
    }, this.test.title);
});

test('Every 6 months from 5/11/2015 on 2nd, until Not set', function () {
    testDescribe({
        Recurrence: {
            Type: recurrence.Constants.Type.Months,
            Interval: 6,
            Day: 2
        },
        StartDate: moment('5/11/2015', 'D/M/YYYY').toDate()
    }, this.test.title);
});

test('Every 6 months from Not set until 6/11/2015', function () {
    testDescribe({
        Recurrence: {
            Type: recurrence.Constants.Type.Months,
            Interval: 6
        },
        EndType: recurrence.Constants.EndType.EndDate,
        EndValue: moment('6/11/2015', 'D/M/YYYY').toDate()
    }, this.test.title)
});

test('Every 6 months from 5/11/2015 on Not set, until Not set', function () {
    testDescribe({
        Recurrence: {
            Type: recurrence.Constants.Type.Months,
            Interval: 6
        },
        StartDate: moment('5/11/2015', 'D/M/YYYY').toDate()
    }, this.test.title);
});

test('Every 6 months from 5/11/2015 on Not set, until after 5 occurrences', function () {
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

test('Every 6 months from 5/11/2015 on Not set, until after 5 occurrences', function () {
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

test('Every 6 months from 5/11/2015 on 28th', function () {
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

test('Every 3 months from Today 9:29 on 3rd, until after 1 occurrences', function () {
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

test('Every day from Today, 9:29', function () {
    testDescribe({
        Recurrence: {
            Type: recurrence.Constants.Type.Days,
            Interval: 1
        },
        EndType: recurrence.Constants.EndType.Unlimited,
        StartDate: moment().hours(9).minutes(29).toDate()
    }, this.test.title);
});
});