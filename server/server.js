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

        if (comment.text) {
            Websites.update({_id: comment.id}, {
                $addToSet: {
                    comments: {
                        text: comment.text,
                        date: Date.now(),
                        user: comment.username
                    }
                },
                $set: {
                    last_comment: {
                        text: comment.text,
                        date: Date.now(),
                        user: comment.username
                    }
                }
            });
        } else {
            console.log('cant add empty comment', comment.text);
        }

    },
    deleteComment: function (comment) {
        Websites.update({_id: comment.id}, {
            $pull: {comments: {date: comment.date}}
        });
        var site = Websites.find({'_id': comment.id}).fetch();

        if (site[0].comments.length) {
            var last = site[0].comments[site[0].comments.length - 1];

            Websites.update({_id: comment.id}, {
                $set: {last_comment: {text: last.text, date: last.date, user: last.user}}
            });
        } else {
            Websites.update({_id: comment.id}, {
                $set: {last_comment: {text: '', date: '', user: ''}}
            });
        }
    }
});