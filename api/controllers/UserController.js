/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    login: function (req, res) {

        if (req.method == "GET")
            return res.view('Qpon/login');
        else {
            User.findOne({ username: req.body.username }).exec(function (err, user) {

                if (user == null)
                    return res.send("No such user");

                if (user.password != req.body.password)
                    return res.send("Wrong Password");

                console.log("The session id " + req.session.id + " is going to be destroyed.");

                req.session.regenerate(function (err) {

                    console.log("The new session id is " + req.session.id + ".");

                    req.session.username = req.body.username;
                    req.session.uid = user.id;
                    req.session.role = user.role;

                    //return res.json(req.session);
                    return res.send("login successfully.");

                });
            });
        }
    },

    logout: function (req, res) {

        console.log("The current session id " + req.session.id + " is going to be destroyed.");

        req.session.destroy(function (err) {
            return res.send("Log out successfully.");
        });
    },

    myCoupon: function (req, res) {
        var today = new Date();

        User.findOne(req.session.uid).populateAll({"dealDate": { '>=': today}, sort:"dealDate"}).exec(function (err, model) {
            return res.view('Qpon/myQpon', { 'coupons': model.owns, 'userCoinOwned': model.coinOwned });
            // if (model.owns.length > 0)
            // return res.send("done");
            // else
            // return res.json(model.owns);
        });
    },

    myCoupon2: function (req, res) {
        var today = new Date();

        User.findOne(req.session.uid).populateAll({"dealDate": { '>=': today}, sort:"dealDate"}).exec(function (err, model) {
            return res.json(model.owns);
        });
    },

    redeemCoupon: function (req, res) {
        if (req.method == "GET") {
            res.redirect('/');
        }
        else {
            const cid = parseInt( req.params.id);
            User.findOne(req.session.uid).populateAll({ id: cid }).exec(function (err, modelAsso) {
                var obj = {};
                if (modelAsso.owns.length > 0) {
                    obj.message = "You have already redeemed it!";
                    //obj.message = modelAsso.owns.id;
                    //return res.json(modelAsso);
                    return res.json(obj);
                } else {
                    User.findOne(req.session.uid).exec(function (err, model) {
                        Coupon.findOne(req.params.id).exec(function (err, modelCoupon) {

                            // var obj = {};

                            if (model !== null && modelCoupon !== null) {

                                if (model.coinOwned < modelCoupon.coin) {
                                    obj.message = "You do not have enough coins!";
                                } else if (modelCoupon.quota <= 0) {
                                    obj.message = "All redeemed!";
                                } else {
                                    console.log(modelCoupon.coin);
                                    model.coinOwned = model.coinOwned - modelCoupon.coin;
                                    modelCoupon.quota = modelCoupon.quota - 1;
                                    model.owns.add(req.params.id);
                                    model.save();
                                    modelCoupon.save();

                                    // return res.send("Coupon is added to your acc.");
                                    obj.message = "Coupon is added to your acc.";
                                }
                            }
                            else {
                                // return res.send("User/Coupon not found!");
                                obj.message = "User or coupon not found!";
                            }

                            return res.json(obj);
                        });
                    });
                }
            });
        }
    },

    showMember: function (req, res) {
        Coupon.findOne(req.params.id).populateAll().exec(function (err, model) {
            return res.view('Qpon/showMember', { 'users': model.redeemBy });
        });
    },

    json: function (req, res) {
        User.find().exec(function (err, model) {
            return res.json(model);
        });
    }
};

