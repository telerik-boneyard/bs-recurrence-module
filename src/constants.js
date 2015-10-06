var type = {
    Once: 0,
    Minutes: 1,
    Hours: 2,
    Days: 3,
    Weeks: 4,
    Months: 5
};

exports = module.exports = {
    Type: type,
    EndType: {
        Unlimited: 1,
        NumberOfOccurences: 2,
        EndDate: 3
    },

    TypeString: {
        0: 'Once',
        1: 'Minutes',
        2: 'Hours',
        3: 'Days',
        4: 'Weeks',
        5: 'Months'
    }
};