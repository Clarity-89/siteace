Websites = new Mongo.Collection("websites");

if (Meteor.isClient) {
    // Add username field to sign up form
    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_EMAIL'
    });
    /////
    // template helpers
    /////

    // helper function that returns all available websites
    Template.website_list.helpers({
        websites: function () {
            return Websites.find({});
        }
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
                Websites.update({_id: website_id}, {$push: {upvotedBy: user}, $pull:{downvotedBy:user},$inc: {upvotes: 1}});
            } else {
                console.log('You can upvote each site only once!');
            }
            return false; // prevent the button from reloading the page
        },
        "click .js-downvote": function (event) {
            var user = Meteor.userId();
            var website_id = this._id;
            var hasDownvoted = Websites.find({_id: website_id, downvotedBy: user}).count();

            // make sure a user hasn't voted before
            if (!hasDownvoted) {
                Websites.update({_id: website_id}, {$push: {downvotedBy: user}, $pull: {upvotedBy: user}, $inc: {upvotes: -1}});
            } else {
                console.log('You can downvote each site only once!');
            }

            return false; // prevent the button from reloading the page
        }
    });

    Template.website_form.events({
        "click .js-toggle-website-form": function (event) {
            $("#website_form").toggle('slow');
        },
        "submit .js-save-website-form": function (event) {

            // here is an example of how to get the url out of the form:
            var url = event.target.url.value,
                title = event.target.title.value,
                description = event.target.description.value,
                alertForm = document.getElementsByClassName('alert')[0];
            // Make all field mandatory
            if (!url) {
                alertForm.innerHTML = "You didn't enter the url!";
                alertForm.style.display = 'block';
                return false;
            } else if (!title) {
                alertForm.innerHTML = "You didnt enter the title!";
                alertForm.style.display = 'block';
            } else if (!description) {
                alertForm.innerHTML = "You didn't enter the description!";
                alertForm.style.display = 'block';
            } else {
                alertForm.style.display = 'none';
                Websites.insert({
                    title: title,
                    url: url,
                    description: description,
                    createdOn: new Date()
                });
            }
            console.log("The url they entered is: " + url);
            return false; // stop the form submit from reloading the page

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
                title: "Goldsmiths Computing Department",
                url: "http://www.gold.ac.uk/computing/",
                description: "This is where this course was developed.",
                createdOn: new Date()
            });
            Websites.insert({
                title: "University of London",
                url: "http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
                description: "University of London International Programme.",
                createdOn: new Date()
            });
            Websites.insert({
                title: "Coursera",
                url: "http://www.coursera.org",
                description: "Universal access to the world’s best education.",
                createdOn: new Date()
            });
            Websites.insert({
                title: "Google",
                url: "http://www.google.com",
                description: "Popular search engine.",
                createdOn: new Date()
            });
        }
    });
}
