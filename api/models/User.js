/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    owns: {
      collection: 'Coupon',
      via: 'redeemBy'
    },
    username: {
      type: 'string',
      unique: true
    },
    role: {
      type: 'string',
      enum: ['admin', 'member', 'visitor'],
      defaultsTo: 'visitor'
    }

  }
};

