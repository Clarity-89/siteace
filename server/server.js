Meteor.publish("websites", function () {
    return Websites.find();
});

Meteor.methods({
    addSite: function (site) {
       Websites.insert(site);
    }
});