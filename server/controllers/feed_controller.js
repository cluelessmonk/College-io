const College = require('../models/college');
const Feed = require('../models/feed');
const User = require('../models/user');

module.exports.create = async (req, res) => {
    const newFeed = new Feed({
        creator: req.user.id,
        college: req.user.college_id,
        tag: req.body.tag,
        heading: req.body.heading,
        description: req.body.description,
        comments: []
    });

    // Saving feed in 'feeds' database
    newFeed.save()
        .then((newFeed) => {
            console.log('Feed saved in feeds database');
            User.findById(req.user.id)
                .then((user) => {
                    if (user) {
                        user.feeds.push(newFeed);
                        // Saving feed in users databse
                        user.save()
                            .then((user) => {
                                console.log('Feed saved in users database');
                                // Saving feed in colleges database
                                College.findById(user.college_id)
                                    .then((college) => {
                                        college.feeds.push(newFeed.id);
                                        college.save()
                                            .then(college => {
                                                console.log('Feed saved in colleges database');
                                                // Sending feed info to the client
                                                res.status(200).json({ 'feed_id': newFeed.id });
                                            })
                                            .catch(err => {
                                                console.log('Error while saving feed in colleges database\n', err);
                                            });
                                    })
                                    .catch(err => {
                                        console.log('Error while finding the college\n', err);
                                    });
                            })
                            .catch((err) => {
                                console.log('Error while saving feed in user\n', err);
                                res.status(500).json({});
                            });
                    } else {
                        console.log('Error while finding the user\n', err);
                        res.status(500).json({});
                    }
                })
                .catch((err) => {
                    console.log('Error while finding the user\n', err);
                    res.status(500).json({});
                });
        })
        .catch((err) => {
            console.log('Error while saving feed\n', err);
            res.status(500).json({});
        });
}