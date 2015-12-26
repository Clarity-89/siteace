// template events

Template.website_item.events({
    "click .js-upvote": function (event) {
        if (Meteor.user()) {
            var website_id = this._id;
            var user = Meteor.userId();
            var hasUpvoted = Websites.find({_id: website_id, upvotedBy: user}).count();

            // make sure a user hasn't voted before
            if (!hasUpvoted) {
                var sites = {_id: website_id, upvotedBy: user}
                Meteor.call('upvote', sites);
            }
            return false; // prevent the button from reloading the page
        } else {
            console.log('login to be able to upvote');
        }
    },

    "click .js-show-comments": function () {
        if (Session.get('showAll')) {
            Session.set('showAll', false);
        } else {
            Session.set('showAll', true);
        }
    },

    "click a": function (event) {
        event.stopPropagation();
    },

    "click .comment-placeholder": function (event) {
        // Change comment text area to be editable
        var el = event.target;
        var sibling = el.nextElementSibling;
        el.style.height = "4em";
        el.setAttribute("contentEditable", 'true');
        el.setAttribute("placeholder", '');
        el.style.color = '#212121';
        el.style.overflow = 'auto';
        sibling.style.display = 'block';
    },

    "submit .js-add-comment": function (event) {
        event.preventDefault();
        var textarea = event.target.childNodes[1]; // The second child node is textarea
        var comment = {
            id: this._id,
            text: textarea.value,
            username: Meteor.user() ? Meteor.user().username : 'Anonymous'
        };

        Meteor.call('addComment', comment);
        textarea.value = '';
    }
});

Template.website_form.events({
    "click .js-toggle-website-form": function (event) {
        $("#website_form").toggle('slow');
    },
    "submit .js-form": function (event) {
        event.preventDefault();
        var $url = $('#url'), $title = $('#title');
        if (!event.target.url.value) {
            console.log('url');
            $url.addClass('error');
            return false;
        } else {
            var url = 'http://' + event.target.url.value.replace(/^https?:\/\//, '');
            extractMeta(url, function (err, res) {
                var title = event.target.title.value,
                    description = event.target.description.value || res.description || res.title;

                // Make title field mandatory
                if (!title) {
                    $url.removeClass('error');
                    $title.addClass('error');
                    return false;
                } else {
                    $title.removeClass('error');
                    var site = {
                        title: title,
                        url: url,
                        description: description,
                        createdOn: new Date()
                    };
                    Meteor.call('addSite', site);
                    $("#website_form").toggle('slow');
                    // Clear the form
                    event.target.url.value = '';
                    event.target.title.value = '';
                    event.target.description.value = '';
                }
            });
        }
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
