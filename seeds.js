var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Manali",
        image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "It is a very good Place"
    },
    {
        name: "Shimla",
        image: "https://images.pexels.com/photos/699558/pexels-photo-699558.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "ye shimla nhi hai"
    },
    {
        name: "Australia",
        image: "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "ye pta ni kon hai"
    }
]

function seedDB() {
    //Remove all Campgrounds
    Campground.remove({}, function (err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Campground removed");
            data.forEach(function (seed) {
                Campground.create(seed, function (err, campground) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("added a Campground");
                        Comment.create(
                        {
                            text: "This place is great ", 
                            author: "Homer"
                        }, function(err, comment){
                            if(err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                    };
                });
            });
        };
    });
}

module.exports = seedDB;
