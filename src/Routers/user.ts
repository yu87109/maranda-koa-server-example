import {MarandaMiddleware, Session, Op} from '../app';
import User from '../Models/User';

const index: MarandaMiddleware = {
    path: '/', 
    methods: ['GET'], 
    middleware: async (ctx) => {
        try {
            if (!ctx.SessKey) {throw `请登录...`}
            ctx.render("main.njk");    
        } catch (error) {
            ctx.render('login.njk',{info: error, dpt:{ AD: 'A',JS: 'B'}})
        }
    }
};
const login: MarandaMiddleware ={
    path: '/login', 
    methods: ['POST'], 
    middleware: async (ctx) => {
        let UserCode = <string>(ctx.request.body.UserCode),
            PassWord = <string>(ctx.request.body.PassWord),
            SessionExpiry = <number>(ctx.request.body.Expiry),
            Department = <string>(ctx.request.body.Department);
        try {
            let user = await User.findOne({where:{UserCode,PassWord:User.PWMD5(PassWord),Department},logging:false});
            if (!user) {throw `用户名不存在或密码错误，请重新输入！`}
            ctx.render("main.njk");
            await Session.Create(ctx, SessionExpiry, {UserCode:user.UserCode, UserName:user.UserName})
        } catch (error) {
            ctx.response.body = `
                <p style="color:red">登录失败，请重试，谢谢！</p>
                <p style="color:blue">${error}</p>
                <p><a href="/">点此返回</a></p>
            `;
        }
    }
};

const logout: MarandaMiddleware ={
    path: '/ajax/logout',
    methods: ['POST'],
    middleware: async (ctx) => {
        if(ctx.SessKey){ await Session.Destroy(ctx);}
        ctx.body = `<script>window.location.href="/"; </script>`
    }
};
export {index, login, logout}