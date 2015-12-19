Router.configure({
    layoutTemplate: 'ApplicationLayout'
});

Router.route('/', function () {
    this.render('navbar', {to: 'navbar'});
    this.render('Home');
    this.render('footer', {to: 'footer'});
});

Router.route('/sites', function () {
    this.render('navbar', {to: 'navbar'});
    this.render('sites');
    this.render('footer', {to: 'footer'});
});

Router.route('/sites/:_id', function () {
    this.render('navbar', {to: 'navbar'});
    this.render('site', {
        data: function () {
            return Websites.findOne({_id: this.params._id});
        }
    });
    this.render('footer', {to: 'footer'});
});