// helper function that returns all available websites
Template.website_list.helpers({
    websites: function () {
        return Websites.find({}, {sort: {upvotes: -1}});
    }
});

Template.registerHelper('formatDate', function (date) {
    return moment(date).format('D MMM YYYY');
});

Template.comments.helpers({

    showAll: function () {
       return Session.get('showAll');
    }
});