"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const crypto_1 = require("crypto");
const attrs = {
    UserCode: {
        type: app_1.DataTypes.STRING,
        unique: true
    },
    UserName: app_1.DataTypes.STRING,
    PassWord: app_1.DataTypes.STRING,
    Department: app_1.DataTypes.STRING(2)
};
class User extends app_1.CustomModel {
}
User.init(app_1.CustomModel.CommAttrs(attrs), app_1.CustomModel.InitOPs(app_1.sequelize));
(function (User) {
    function PWMD5(password) {
        return crypto_1.createHash('MD5').update(password + ':abc').digest('hex');
    }
    User.PWMD5 = PWMD5;
})(User || (User = {}));
exports.default = User;
//# sourceMappingURL=User.js.map