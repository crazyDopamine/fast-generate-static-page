/**
 * Created by dongwei on 16/9/18.
 */
var Sequelize = require('sequelize');
var modelConfig = require('../model/modelConfig');
var sequelize = new Sequelize('fgsp', 'newtank', 'newtank', {
  host: '120.55.76.1',
  dialect: 'mysql',
  pool: {
    min: 5,
    max: 20,
    idle: 30
  },
  syncOnAssociation: true,
  sync: {
    force: true
  }
});
var models = {};
for (var tableName in modelConfig) {
  models[tableName] = sequelize.define(modelConfig[tableName].tableName ? modelConfig[tableName].tableName : tableName, modelConfig[tableName].field, { timestamps: false, defaultScope: { where: { deleteFlag: false } } });
}

sequelize.sync({ force: true }).then(function () {
  models.user.create({ password: 'test', phone: '18321482348', name: 'test', password: '123456' });
  models.user.create({ password: 'test1', phone: '18321482349', name: 'test1', password: '123456' });
  models.user.create({ password: 'test2', phone: '18321482347', name: 'test2', password: '123456' });
});

module.exports = models;