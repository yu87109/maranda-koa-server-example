"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const maranda_koa2_static_1 = __importDefault(require("maranda-koa2-static"));
const koa_body_1 = __importDefault(require("koa-body"));
const maranda_koa2_nunjucks_1 = require("maranda-koa2-nunjucks");
const maranda_koa2_router_1 = require("maranda-koa2-router");
const maranda_koa2_session_mysql_1 = __importStar(require("maranda-koa2-session-mysql"));
exports.Session = maranda_koa2_session_mysql_1.default;
exports.Model = maranda_koa2_session_mysql_1.Model;
exports.DataTypes = maranda_koa2_session_mysql_1.DataTypes;
exports.Op = maranda_koa2_session_mysql_1.Op;
const path_1 = require("path");
//init koa app
const app = new maranda_koa2_nunjucks_1.NunjucksKoa([path_1.join(__dirname, '../views')]);
//init database connect、comm data model and Session
const sequelize = new maranda_koa2_session_mysql_1.Sequelize('jgpj', 'root', 'maranda', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
});
exports.sequelize = sequelize;
maranda_koa2_session_mysql_1.default.Init(sequelize);
class CustomModel extends maranda_koa2_session_mysql_1.Model {
    static CommAttrs(attrs) {
        const CommKey = {
            id: {
                type: maranda_koa2_session_mysql_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            CreateAt: maranda_koa2_session_mysql_1.DataTypes.BIGINT({ length: 11 }),
            UpdateAt: maranda_koa2_session_mysql_1.DataTypes.BIGINT({ length: 11 }),
            DeletedAt: maranda_koa2_session_mysql_1.DataTypes.BIGINT({ length: 11 }),
        };
        return Object.assign({}, CommKey, attrs);
    }
    static InitOPs(sequelize, ops) {
        const CommOps = {
            timestamps: false,
            underscored: true,
            paranoid: false,
        };
        return Object.assign({ sequelize }, ops, CommOps);
    }
}
exports.CustomModel = CustomModel;
;
const Router = new maranda_koa2_router_1.MarandaRouter({ Path: path_1.join(__dirname, 'Routers') });
//1 static middleware
app.use(maranda_koa2_static_1.default([
    { start: '/assets/', rootDir: path_1.join(__dirname, '..', 'assets') },
]));
//2 session middleware
app.use(maranda_koa2_session_mysql_1.default.Middware);
//3 post data parser middleware
app.use(koa_body_1.default({
    multipart: true,
    formidable: {
        keepExtensions: true,
        maxFieldsSize: 10 * 1024 * 1024
    }
}));
//4 router middleware
app.use(Router.routes()).use(Router.allowedMethods());
//start server
app.listen(8080);
console.log('app started at port 8080...');
//# sourceMappingURL=app.js.map