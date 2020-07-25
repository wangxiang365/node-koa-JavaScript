module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		id: {
      type: DataTypes.BIGINT,
      comment: '自增ID',
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		user_name: {
      type: DataTypes.STRING(20),
      comment: '用户名',
			allowNull: true
    },
    nick_name: {
      type: DataTypes.STRING(20),
      comment: '昵称',
			allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      comment: '密码',
			allowNull: false
    },
    phone: {
      type: DataTypes.INTEGER(11),
      comment: '手机',
			allowNull: true
    },
    address: {
      type: DataTypes.STRING,
      comment: '地址',
			allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      comment: '创建时间',
			allowNull: true
    },
    update_time: {
      type: DataTypes.DATE,
      comment: '更新时间',
			allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      comment: '邮箱',
			allowNull: true
    },
		sex: {
			type: DataTypes.INTEGER(4),
			allowNull: false,
			defaultValue: '0'
    },
    birthday: {
      type: DataTypes.STRING,
      comment: '生日',
			allowNull: true
		}
	}, {
		tableName: 'user',
		timestamps: false
	});
};
