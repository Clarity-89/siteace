Meteor.startup(function () {
    // Include materialize.css file before Meteor's combined css to allow it being overridden
    $('head').prepend('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.4/css/materialize.min.css">');
});

Meteor.subscribe("websites");

// Add username field to sign up form
Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});


// Initialize materialize plugins
Template.home.onRendered(function () {
    // Scroll to the el in href
    $('.scrollspy').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

Template.website_form.onRendered(function () {
    // Initialize tooltip
    $('.tooltipped').tooltip({delay: 50});
});


Template.comments.onRendered(function () {
    // Initialize tooltip
    $('.tooltipped').tooltip({delay: 50});
});
