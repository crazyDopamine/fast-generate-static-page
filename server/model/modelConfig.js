var Sequelize = require('sequelize');

var user = {
    field:{
        // userName:{
        //     type:Sequelize.STRING,
        //     defaultValue:'',
        //     field:'user_name',
        //     unique:true
        // },
        phone:{
            type:Sequelize.STRING,
            defaultValue:'',
            unique:true
        },
        name:{
            type:Sequelize.STRING,
            defaultValue:''
        },
        password:{
            type:Sequelize.STRING,
            defaultValue:'',
            allowNull:false
        },
        deleteFlag:{
            type:Sequelize.BOOLEAN,
            defaultValue:false
        },
        wechat:{
            type:Sequelize.STRING,
            defaultValue:''
        },
        sessionTime:{
            type:Sequelize.DATE,
            defaultValue:0
        },
        sessionId:{
            type:Sequelize.STRING,
            defaultValue:''
        }
    }
};

module.exports={
    user:user
}