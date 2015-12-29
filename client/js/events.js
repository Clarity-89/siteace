// template events

Template.home.events({
    "click #join": function () {
        if (Meteor.user()) {
            Router.go('/sites');
        } else {
            Router.go('/sign-up');
        }
    }
});

Template.website_item.events({
    "click .js-upvote": function (event) {
        if (Meteor.user()) {
            var website_id = this._id;
            var user = Meteor.userId();
            var hasUpvoted = Websites.find({_id: website_id, upvotedBy: user}).count();

            // make sure a user hasn't voted before
            if (!hasUpvoted) {
                var sites = {_id: website_id, upvotedBy: user};
                Meteor.call('upvote', sites);
            }
            return false; // prevent the button from reloading the page
        } else {
            console.log('login to be able to upvote');
        }
    },

    "click .js-show-comments": function (event) {
        var open = Session.get("Open") ? Session.get("Open").slice() : [];
        var index = open.indexOf(this._id);

        if (index === -1) {
            open.push(this._id);
        } else {
            open.splice(index, 1);
        }
        Session.set('Open', open);
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
        console.log(Meteor.user());
        var textarea = event.target.childNodes[1]; // The second child node in textarea
        var comment = {
            id: this._id,
            userId: Meteor.userId(),
            text: textarea.value,
            username: Meteor.user() ? Meteor.user().username : 'Anonymous'
        };

        Meteor.call('addComment', comment);
        textarea.value = '';
    }
});

Template.website_form.events({
    "click .js-toggle-website-form": function (event) {
        if (Meteor.user()) {
            $("#website_form").toggle('slow');
        } else {
            Materialize.toast('You need to be logged in to add a site', 4000);
        }
    },
    "submit .js-form": function (event) {
        event.preventDefault();
        var $url = $('#url'), $title = $('#title');
        if (!event.target.url.value) {
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

Template.comments.events({
    "mouseover .comment": function (event) {
        // Show delete button
        var id = Meteor.userId();
        if (Meteor.user() && ((this.userId && id === this.userId) || (this.last_comment && id === this.last_comment.userId))) {
            toggleClass(event.currentTarget, 'show');
        }
    },

    "mouseout .comment": function (event) {
        // Hide delete button
        toggleClass(event.currentTarget, 'hide');
    },

    "click .fa.fa-times": function (event, template) {
        var comment = {
            id: template.data._id,
            date: this.date || this.last_comment.date,
            user: this.user || this.last_comment.user
        };

        Meteor.call('deleteComment', comment);
    }
});

function toggleClass(target, action) {
    var siblings = target.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        if (siblings[i].tagName === 'I') {
            if (action === 'hide') {
                siblings[i].classList.add('hide');
            } else {
                siblings[i].classList.remove('hide');
            }
        }
    }
}