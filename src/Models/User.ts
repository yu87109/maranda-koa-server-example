import {
    CustomModel, 
    ModelAttributes, 
    DataTypes, 
    sequelize
} from '../app';
import {createHash} from 'crypto';

const attrs: ModelAttributes = {
    UserCode: {
        type: DataTypes.STRING,
        unique: true
    },
    UserName: DataTypes.STRING,
    PassWord: DataTypes.STRING,
    Department: DataTypes.STRING(2)
}
class User extends CustomModel {
    UserCode!: string;
    UserName!: string;
    PassWord!: string;
    Department!: String;
}
User.init(CustomModel.CommAttrs(attrs), CustomModel.InitOPs(sequelize))
namespace User{
    export function PWMD5(password: string){
        return createHash('MD5').update(password + ':abc').digest('hex');
    }
}

export default User;