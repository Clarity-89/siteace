// helper function that returns all available websites
Template.website_list.helpers({
    websites: function () {
        return Websites.find({}, {sort: {upvotes: -1}});
    }

});

Template.website_item.helpers({
    commentsCount: function () {
        var site = Websites.findOne({_id: this._id}, {sort: {upvotes: -1}});
        if (site.comments) {
            return site.comments.length;
        } else {
            return 0;
        }
    }
});

Template.registerHelper('formatDate', function (date) {
    return moment(date).format('D MMM YYYY');
});

Template.comments.helpers({

    showAll: function () {
        var open = Session.get("Open").slice();
        var index = open.indexOf(this._id);

        return !(index === -1);
    }
});