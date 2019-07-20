 var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

//setup maps node geocoder with opencage
var NodeGeocoder = require('node-geocoder');
var options = {
    provider: 'opencage',
    httpAdapter: 'https',
    apiKey: process.env.OCD_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);

// var geocoder = require('mapbox-geocoding');
// // var options = {
// //     provider: 'mapbox',
// //     hhtpAdapter: 'https',
// //     apiKey: process.env.OCD_API_KEY,
// //     formatter: null
// // };

// // var geocoder = geo(options);


router.get("/campgrounds", function (req, res) {
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
        }
    })

});

router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});

router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {

    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log(err);
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampground = { name: name, image: image, description: desc, author: author, price: price, location: location, lat: lat, lng: lng };
        Campground.create(newCampground, function (err, newlyCreated) {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
        })
    })

});


router.get("/campgrounds/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

// edit Campground

router.get("/campgrounds/:id/edit", middleware.authorization, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    })
});

router.put("/campgrounds/:id", middleware.authorization, function (req, res) {
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            console.log(err);
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
            if (err) {
                res.redirect("/campgrounds");
            } else {
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    }) 
});

router.delete("/campgrounds/:id", middleware.authorization, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;