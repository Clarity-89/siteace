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
    },

    addComment: function (comment) {
        console.log('received comment', comment);
        Websites.update({_id: comment.id}, {
            $addToSet: {
                comments: {
                    text: comment.text,
                    date: Date.now(),
                    user: comment.username
                }
            }
        });
    }
});