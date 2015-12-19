// helper function that returns all available websites
Template.website_list.helpers({
    websites: function () {
        return Websites.find({}, {sort: {upvotes: -1}});
    }
});

Template.home.helpers({
    topRated: function () {
        return Websites.find({}, {sort: {upvotes: -1}, limit: 6});
    }
});

Template.registerHelper('formatDate', function (date) {
    return moment(date).format('DD-MM-YYYY');
});