const User = require('./user.js');

const UserManager = function() {
  this.users={};
}
UserManager.prototype.getUser = function (userName) {
  return this.users[userName];
};
UserManager.prototype.getAllUser = function () {
  return Object.keys(this.users);
};
UserManager.prototype.addUser = function (name) {
  let user = new User(name);
  this.users[name] = user;
};
UserManager.prototype.deleteUser = function (name) {
  delete this.users[name];
};
module.exports=UserManager;
