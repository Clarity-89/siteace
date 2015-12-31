Meteor.subscribe("websites");

// Add username field to sign up form
/*Accounts.ui.config({
 passwordSignupFields: 'USERNAME_AND_EMAIL'
 });*/


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

    // Make the home page always start at the top
    window.scrollTo(0, 0);
});

Template.website_form.onRendered(function () {
    // Initialize tooltip
    $('.tooltipped').tooltip({delay: 50});
});

