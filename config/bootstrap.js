/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {
  var users = [
    { username: "admin", password: "admin", role: "admin", id: 101 },
    {
      username: "kim",
      password: "12345",
      role: "member",
      id: 102,
      coinOwned: 1000,
    },
    {
      username: "lamma",
      password: "12345",
      role: "member",
      id: 103,
      coinOwned: 1000,
    },
  ];

  var coupons = [
    {
      title: "5% Discount",
      rest: "Pepper Lunch",
      dist: "hki",
      mall: "杏花新城商場",
      image:
        "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Pepper_Lunch_logo.png/330px-Pepper_Lunch_logo.png",
      coin: 700,
      dealDate: "2022-05-29T16:00:00.000Z",
      quota: 10,
      detail: "Detail of the new discount.",
      createdAt: "2021-02-24T16:47:56.361Z",
      updatedAt: "2021-03-14T17:13:20.617Z",
      id: 8,
    },
    {
      title: "10% off",
      rest: "School Food",
      dist: "kln",
      mall: "IFC",
      image:
        "http://4.bp.blogspot.com/-Ydb-nU7zWMk/UpGcOzOja3I/AAAAAAAAF-8/tL5LHEA7gzw/s1600/IMG_0986A.jpg",
      coin: 100,
      dealDate: "2022-05-29T16:00:00.000Z",
      quota: 5,
      detail: "Detail of the new discount.",
      createdAt: "2021-02-19T13:54:59.501Z",
      updatedAt: "2021-02-24T17:24:20.506Z",
      id: 2,
    },
    {
      title: "50HKD deducted",
      rest: "Five Guys",
      dist: "hki",
      mall: "金鐘太古廣場",
      image: "https://media.timeout.com/images/105322654/1372/772/image.jpg",
      coin: 200,
      dealDate: "2022-05-29T16:00:00.000Z",
      quota: 10,
      detail: "Detail of the coupon.",
      createdAt: "2021-02-19T14:20:20.892Z",
      updatedAt: "2021-03-14T16:52:58.677Z",
      id: 3,
    },
    {
      title: "Buy one get one free",
      rest: "翠華",
      dist: "kln",
      mall: "圓方",
      image:
        "https://static7.orstatic.com/userphoto/photo/3/2J2/00HZIY57FCFC8B5D72DF68px.jpg",
      coin: 200,
      dealDate: "2022-05-29T16:00:00.000Z",
      quota: 300,
      detail: "detail of the new discount.",
      createdAt: "2021-02-19T14:21:39.838Z",
      updatedAt: "2021-02-24T17:21:40.860Z",
      id: 4,
    },
    {
      title: "100HKD deducted",
      rest: "McDonald's",
      dist: "nt",
      mall: "新都會廣場",
      image:
        "https://securecdn.pymnts.com/wp-content/uploads/2019/07/mcdonalds-digital-doordash-dynamicyield-1000x600.jpg",
      coin: 20,
      dealDate: "2022-05-29T16:00:00.000Z",
      quota: 10,
      detail: "Only use when spending over 1000HKD.",
      createdAt: "2021-02-20T02:45:25.823Z",
      updatedAt: "2021-02-24T19:08:15.214Z",
      id: 5,
    },
    {
      title: "Buy one get one free",
      rest: "許留山",
      dist: "nt",
      mall: "數碼港商場",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/HK_HuiLauShan_YuenLongOldShop.JPG/375px-HK_HuiLauShan_YuenLongOldShop.JPG",
      coin: 50,
      dealDate: "2022-05-29T16:00:00.000Z",
      quota: 10,
      detail: "Detail of desert.",
      createdAt: "2021-02-20T11:35:20.606Z",
      updatedAt: "2021-02-24T17:22:06.827Z",
      id: 6,
    },
    {
      title: "Buy two get one free",
      rest: "Twelve cupcakes",
      dist: "hki",
      mall: "IFC",
      image:
        "https://media-cdn.tripadvisor.com/media/photo-s/16/9d/28/12/photo0jpg.jpg",
      coin: 800,
      dealDate: "2022-05-29T16:00:00.000Z",
      quota: 100,
      detail: "Detail",
      createdAt: "2021-02-20T12:08:55.707Z",
      updatedAt: "2021-02-24T17:22:19.076Z",
      id: 7,
    },
  ];

  users.forEach(function (user) {
    User.create(user).exec(function (err, model) {});
  });

  coupons.forEach(function (coupon) {
    coupon.dealDate =
      new Date().getFullYear().toString() + "-12-31T00:00:00.000Z";
    Coupon.create(coupon).exec(function (err, model) {});
  });

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
