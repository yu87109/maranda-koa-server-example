"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const User_1 = __importDefault(require("../Models/User"));
const index = {
    path: '/',
    methods: ['GET'],
    middleware: (ctx) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!ctx.SessKey) {
                throw `请登录...`;
            }
            ctx.render("main.njk");
        }
        catch (error) {
            ctx.render('login.njk', { info: error, dpt: { AD: 'A', JS: 'B' } });
        }
    })
};
exports.index = index;
const login = {
    path: '/login',
    methods: ['POST'],
    middleware: (ctx) => __awaiter(this, void 0, void 0, function* () {
        let UserCode = (ctx.request.body.UserCode), PassWord = (ctx.request.body.PassWord), SessionExpiry = (ctx.request.body.Expiry), Department = (ctx.request.body.Department);
        try {
            let user = yield User_1.default.findOne({ where: { UserCode, PassWord: User_1.default.PWMD5(PassWord), Department }, logging: false });
            if (!user) {
                throw `用户名不存在或密码错误，请重新输入！`;
            }
            ctx.render("main.njk");
            yield app_1.Session.Create(ctx, SessionExpiry, { UserCode: user.UserCode, UserName: user.UserName });
        }
        catch (error) {
            ctx.response.body = `
                <p style="color:red">登录失败，请重试，谢谢！</p>
                <p style="color:blue">${error}</p>
                <p><a href="/">点此返回</a></p>
            `;
        }
    })
};
exports.login = login;
const logout = {
    path: '/ajax/logout',
    methods: ['POST'],
    middleware: (ctx) => __awaiter(this, void 0, void 0, function* () {
        if (ctx.SessKey) {
            yield app_1.Session.Destroy(ctx);
        }
        ctx.body = `<script>window.location.href="/"; </script>`;
    })
};
exports.logout = logout;
//# sourceMappingURL=user.js.map