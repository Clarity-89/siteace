
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