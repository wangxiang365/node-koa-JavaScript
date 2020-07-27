const SequelizeAuto = require('sequelize-auto')
const auto = new SequelizeAuto(
	config.database.DATABASE, config.database.USERNAME, config.database.PASSWORD, {
		host: config.database.HOST,
		dialect: 'mysql',
		directory: '../models',    // prevents the program from writing to disk
		port: config.database.PORT,
		additional: {
			timestamps: false
		}
	}
)
// autoIncrement: true
var defautlt = async function() {
	auto.run(function(err) {
		if (err) throw err;
		console.log(auto.tables); // table list
		console.log(auto.foreignKeys); // foreign key list
	});
}()
