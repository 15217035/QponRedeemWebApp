/**
 * CouponController
 *
 * @description :: Server-side logic for managing Coupons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  create: function (req, res) {
    if (req.method == "POST") {
      req.body.Coupon.coin = parseInt(req.body.Coupon.coin);
      Coupon.create(req.body.Coupon).exec(function (err, model) {
        return res.send("Successfully Created!");
      });
    } else {
      return res.view("Qpon/create");
    }
  },

  home: function (req, res) {
    var today = new Date();

    Coupon.find()
      .where({ dist: "nt", dealDate: { ">=": today } })
      .sort("createdAt DESC")
      .limit(2)
      .exec(function (err, modelNT) {
        Coupon.find()
          .where({ dist: "kln", dealDate: { ">=": today } })
          .sort("createdAt DESC")
          .limit(2)
          .exec(function (err, modelKLN) {
            Coupon.find()
              .where({ dist: "hki", dealDate: { ">=": today } })
              .sort("createdAt DESC")
              .limit(2)
              .exec(function (err, modelHKI) {
                return res.view("Qpon/home", {
                  couponNT: modelNT,
                  couponKLN: modelKLN,
                  couponHKI: modelHKI,
                });
              });
          });
      });
  },

  detail: function (req, res) {
    // const cid = parseInt(req.params.id);
    const uid = req.session.uid || 0;
    Coupon.findOne(req.params.id)
      .populateAll({ id: uid })
      .exec(function (err, model) {
        var isRedeem = false;
        if (model != null) {
          if (model.redeemBy.length > 0) isRedeem = true;
          else isRedeem = false;
          return res.view("Qpon/detail", { coupon: model, isRedeem: isRedeem });
        } else return res.send("No such coupon");
      });

    // Coupon.findOne(req.params.id).exec(function (err, model) {
    //     const cid = parseInt(req.params.id);
    //     var isRedeem = false;
    //     if (req.session.uid != undefined) {
    //         User.findOne(req.session.uid).populateAll({ id: cid }).exec(function (err, modelAsso) {
    //             if (modelAsso.owns.length > 0)
    //                  var isRedeem = true;
    //                  else
    //                  var isRedeem =false;
    //             console.log(isRedeem);

    //             if (model != null)
    //                 return res.view('Qpon/detail', { 'coupon': model, 'isRedeem': isRedeem });
    //             else
    //                 return res.send("No such coupon");
    //         });
    //     } else {
    //         if (model != null)
    //             return res.view('Qpon/detail', { 'coupon': model, 'isRedeem': isRedeem });
    //         else
    //             return res.send("No such coupon");
    //     }

    // });
  },

  detail2: function (req, res) {
    // const cid = parseInt(req.params.id);
    const uid = req.session.uid || 0;
    Coupon.findOne(req.params.id)
      .populateAll({ id: uid })
      .exec(function (err, model) {
        var isRedeem = false;
        if (model != null) {
          if (model.redeemBy.length > 0) isRedeem = true;
          else isRedeem = false;
          // return res.view('Qpon/detail', { 'coupon': model, 'isRedeem': isRedeem });
          return res.json({ model, isRedeem });
        } else return res.send("No such coupon");
      });
  },

  json: function (req, res) {
    Coupon.find().exec(function (err, model) {
      return res.json(model);
    });
  },

  admin: function (req, res) {
    Coupon.find().exec(function (err, model) {
      return res.view("Qpon/admin", { coupon: model });
    });
  },

  delete: function (req, res) {
    if (req.method == "GET") {
      res.redirect("/");
    } else {
      Coupon.findOne(req.params.id).exec(function (err, model) {
        var obj = {};

        if (model != null) {
          model.destroy();
          obj.message = "Coupon Deleted";
        } else {
          obj.message = "Coupon not found";
        }

        return res.json(obj);
      });
    }
  },

  update: function (req, res) {
    if (req.method == "GET") {
      Coupon.findOne(req.params.id).exec(function (err, model) {
        if (model == null) return res.send("No such coupon!");
        else return res.view("Qpon/update", { coupon: model });
      });
    } else {
      Coupon.findOne(req.params.id).exec(function (err, model) {
        model.title = req.body.Coupon.title;
        model.rest = req.body.Coupon.rest;
        model.dist = req.body.Coupon.dist;
        model.mall = req.body.Coupon.mall;
        model.image = req.body.Coupon.image;
        model.coin = parseInt(req.body.Coupon.coin);
        model.dealDate = req.body.Coupon.dealDate;
        model.quota = req.body.Coupon.quota;
        model.detail = req.body.Coupon.detail;
        model.save();
        return res.send("Record updated");
      });
    }
  },

  search: function (req, res) {
    const qPage = req.query.page || 1;
    const qDist = req.query.dist || "all";
    const qCoin = req.query.coin || "";
    const qCoin2 = qCoin.split(";");
    const qCoinLower = parseInt(qCoin2[0]);
    const qCoinUpper = parseInt(qCoin2[1]);
    const qDealDate =
      req.query.dealDate || new Date("2100-03-01T16:00:00.000Z");

    var today = new Date();

    if (qDist != "all") {
      Coupon.find()
        .where({ dist: qDist })
        .where({ coin: { ">=": qCoinLower, "<=": qCoinUpper } })
        .where({ dealDate: { "<=": qDealDate, ">=": today } })
        .paginate({ page: qPage, limit: 2 })
        .exec(function (err, model) {
          Coupon.count()
            .where({ dist: qDist })
            .where({ coin: { ">=": qCoinLower, "<=": qCoinUpper } })
            .where({ dealDate: { "<=": qDealDate, ">=": today } })
            .exec(function (err, value) {
              var pages = Math.ceil(value / 2);
              return res.view("Qpon/search", { coupons: model, count: pages });
            });
        });
    } else {
      Coupon.find()
        .where({ coin: { ">=": qCoinLower, "<=": qCoinUpper } })
        .where({ dealDate: { "<=": qDealDate, ">=": today } })
        .paginate({ page: qPage, limit: 2 })
        .exec(function (err, model) {
          Coupon.count()
            .where({ coin: { ">=": qCoinLower, "<=": qCoinUpper } })
            .where({ dealDate: { "<=": qDealDate, ">=": today } })
            .exec(function (err, value) {
              var pages = Math.ceil(value / 2);
              return res.view("Qpon/search", { coupons: model, count: pages });
            });
        });
    }
  },
};
