Websites = new Mongo.Collection("websites");

// Set permissions for modifying the collection
Websites.allow({
    insert: function () {
        return true;
    },

    update: function () {
        return true;
    }
});

if (Meteor.isClient) {

    //routes
    Router.route('/', function () {
        this.render('Home');
    });

    Router.route('/sites', function () {
        this.render('sites');
    });

    Router.route('/sites/:_id', function () {

        this.render('site', {
            data: function () {
                return Websites.findOne({_id: this.params._id});
            }
        });

    });

    // Add username field to sign up form
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_EMAIL'
    });


    /* template helpers*/


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

    // Initialize materialize plugins
    Template.home.onRendered(function () {
        $('.scrollspy').scrollSpy({offset: 64});
    });

    /////
    // template events
    /////

    Template.website_item.events({
        "click .js-upvote": function (event) {

            var website_id = this._id;
            var user = Meteor.userId();
            var hasUpvoted = Websites.find({_id: website_id, upvotedBy: user}).count();

            // make sure a user hasn't voted before
            if (!hasUpvoted) {
                Websites.update({_id: website_id}, {
                    $push: {upvotedBy: user},
                    $pull: {downvotedBy: user},
                    $inc: {upvotes: 1}
                });
            }
            return false; // prevent the button from reloading the page
        },

        "click .js-downvote": function (event) {
            var user = Meteor.userId();
            var website_id = this._id;
            var hasDownvoted = Websites.find({_id: website_id, downvotedBy: user}).count();

            // make sure a user hasn't voted before and upvotes value is more than zero
            if (!hasDownvoted && this.upvotes) {
                Websites.update({_id: website_id}, {
                    $push: {downvotedBy: user},
                    $pull: {upvotedBy: user},
                    $inc: {upvotes: -1}
                });
            }

            return false; // prevent the button from reloading the page
        },
        "click a": function (event) {
            event.stopPropagation();
        }
    });

    Template.website_form.events({
        "click .js-toggle-website-form": function (event) {
            $("#website_form").toggle('slow');
        },
        "submit .js-save-website-form": function (event) {

            // here is an example of how to get the url out of the form:
            var url = 'http://' + event.target.url.value.replace(/^https?:\/\//, '');

            extractMeta(url, function (err, res) {
                var title = event.target.title.value,
                    description = event.target.description.value || res.description || res.title;

                var alertForm = document.getElementsByClassName('alert')[0];

                // Make url and title fields mandatory
                if (!url) {
                    alertForm.innerHTML = "You didn't enter the url!";
                    alertForm.style.display = 'block';
                    return false;
                } else if (!title) {
                    alertForm.innerHTML = "You didn't enter the title!";
                    alertForm.style.display = 'block';
                } else {
                    alertForm.style.display = 'none';
                    console.log(url);
                    Websites.insert({
                        title: title,
                        url: url,
                        description: description,
                        createdOn: new Date()
                    });
                }
                $("#website_form").toggle('slow');

            });
            return false; // stop the form submit from reloading the page
        },

        // Fill title and description fields on focus
        "focus #title": function () {
            var url = document.getElementById('url').value.replace('http://', '');
            extractMeta('http://' + url, function (err, res) {

                // Create a backup title extracted from the url
                url = 'www.' + url.replace('www.', '');
                var match = url.match(/\.([^.]+?)\./)[1],
                    backupTitle = match[0].toUpperCase() + match.slice(1, match.length);

                document.getElementById('title').value = res.title || backupTitle;
                document.getElementById('description').value = res.description || '';
            });
        }
    });

    Template.site.events({
        "click .js-add-comment": function (event) {

            var website_id = this._id;
            var comment = $('#comment').val();
            var username = Meteor.user() ? Meteor.user().username : 'Anonymous';
            console.log(username);
            Websites.update({_id: website_id}, {
                $push: {
                    comments: {
                        text: comment,
                        date: moment().format('MMM DD YYYY, h:mm:ss a'),
                        user: username
                    }
                }
            });
        }
    });

}

if (Meteor.isServer) {
    // start up function that creates entries in the Websites databases.
    Meteor.startup(function () {
        // code to run on server at startup
        if (!Websites.findOne()) {

            console.log("No websites yet. Creating starter data.");
            Websites.insert({
                title: "Free Code Camp",
                url: "http://freecodecamp.com/",
                description: extractMeta('http://freecodecamp.com/').description || extractMeta('http://freecodecamp.com/').title,
                createdOn: new Date(),
                upvotes: 5
            });
            Websites.insert({
                title: "Codewars",
                url: "http://www.codewars.com",
                description: extractMeta('http://www.codewars.com').description || extractMeta('http://www.codewars.com').title,
                createdOn: new Date(),
                upvotes: 8
            });
            Websites.insert({
                title: "Coursera",
                url: "http://www.coursera.org",
                description: "Universal access to the world’s best education.",
                createdOn: new Date(),
                upvotes: 10
            });
            Websites.insert({
                title: "Codecademy",
                url: "https://www.codecademy.com/",
                description: extractMeta('https://www.codecademy.com/').description || extractMeta('https://www.codecademy.com/').title,
                createdOn: new Date(),
                upvotes: 3
            });
            Websites.insert({
                title: 'Mozilla Developer Network',
                url: 'https://developer.mozilla.org/',
                description: extractMeta('https://developer.mozilla.org/').description || extractMeta('https://developer.mozilla.org/').title,
                createdOn: new Date(),
                upvotes: 9
            });
            Websites.insert({
                title: 'edX',
                url: 'https://www.edx.org/',
                description: extractMeta('https://www.edx.org/').description || extractMeta('https://www.edx.org/').title,
                createdOn: new Date(),
                upvotes: 5
            });
        }
    });
}
