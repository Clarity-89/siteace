Meteor.publish("websites", function () {
    return Websites.find();
});

Meteor.methods({
    addSite: function (site) {
        Websites.insert(site);
    },
    upvote: function (sites) {

        Websites.update({_id: sites._id}, {
            $push: {upvotedBy: sites.upvotedBy},
            $inc: {upvotes: 1}
        });
    }
});