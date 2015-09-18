if (typeof window === 'undefined') {
    var should = require('should');
    var moment = require('moment');
    var recurrence = require('../dist/recurrence.js');
}

var today = new Date();
suite('describe', function () {
    var testDescribe = function (job, exp) {
        var res = recurrence.describe(job);
        res.should.be.exactly(exp);
    };

    var exp1 = 'Every 5 minutes from Today, 8:20, until 8/9/2015';
    test(exp1, function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Minutes,
                Interval: 5
            },
            StartDate: moment().hours(8).minutes(20).toDate(),
            EndDate: moment('8/9/2015', 'D/M/YYYY').toDate()
        }, exp1);
    });

    var exp2 = 'Single execution scheduled for Today 9:29';
    test(exp2, function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Once
            },
            StartDate: moment().hours(9).minutes(29).toDate()
        }, exp2);
    });

    var exp3 = 'Every 16 weeks from 10/12/2016 until 15/12/2017';
    test(exp3, function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Weeks,
                Interval: 16,
                Day: 16
            },
            StartDate: moment('10/12/2016', 'D/M/YYYY').toDate(),
            EndDate: moment('15/12/2017', 'D/M/YYYY').toDate()
        }, exp3);
    });

    var exp4 = 'Every 6 months from 5/11/2015 until 6/11/2015';
    test(exp4, function () {
        testDescribe({
            Recurrence: {
                Type: recurrence.Constants.Type.Months,
                Interval: 6
            },
            StartDate: moment('5/11/2015', 'D/M/YYYY').toDate(),
            EndDate: moment('6/11/2015', 'D/M/YYYY').toDate()
        }, exp4)
    });
});