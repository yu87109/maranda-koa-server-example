import koa2Sataic from 'maranda-koa2-static'
import koaBody from 'koa-body'
import {NunjucksKoa} from 'maranda-koa2-nunjucks'
import {MarandaRouter, MarandaMiddleware as Middleware} from 'maranda-koa2-router';
import Session, {Sequelize, Model, ModelAttributes, DataTypes, ModelOptions, InitOptions, Op} from 'maranda-koa2-session-mysql'
import {join} from 'path'

//init koa app
const app = new NunjucksKoa<any, NunjucksKoa.Ctx & Session.Ctx>([join(__dirname, '../views')]);
//init database connect、comm data model and Session
const sequelize = new Sequelize('jgpj', 'root', 'maranda', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
})
Session.Init(sequelize);
class CustomModel extends Model {
    id!: number;
    CreateAt!: number;
    UpdateAt!: number;
    DeletedAt!: number;
    static CommAttrs (attrs: ModelAttributes) {
        const CommKey: ModelAttributes = {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            CreateAt: DataTypes.BIGINT({length: 11}),
            UpdateAt: DataTypes.BIGINT({length: 11}),
            DeletedAt: DataTypes.BIGINT({length: 11}),
        }
        return Object.assign({}, CommKey, attrs)
    } 
    static InitOPs(sequelize: Sequelize, ops?: ModelOptions): InitOptions{
        const CommOps: ModelOptions = {
            timestamps: false,
            underscored: true,
            paranoid: false,
        }
        return {sequelize, ...ops, ...CommOps}
    }
};
export {Session, sequelize, Model, CustomModel, ModelAttributes, DataTypes, Op};
//init router
export type MarandaMiddleware = Middleware<any, NunjucksKoa.Ctx & Session.Ctx>;
const Router = new MarandaRouter<any, NunjucksKoa.Ctx & Session.Ctx>({Path: join(__dirname, 'Routers')});


//1 static middleware
app.use(koa2Sataic([
    {start: '/assets/', rootDir: join(__dirname, '..', 'assets')},
]))
//2 session middleware
app.use(Session.Middware);
//3 post data parser middleware
app.use(koaBody({
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



