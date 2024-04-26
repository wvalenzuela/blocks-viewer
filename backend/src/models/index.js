import { Sequelize, DataTypes } from 'sequelize';
import blockModel from './blocks/block';
import portModel from './blocks/port';
import diagramLineModel from './blocks/diagram_line';
import userDiagrammModel from './blocks/user_diagram';
import userModel from './user/user';
import diagramModel from './blocks/diagram';
import blockPortModel from './blocks/block_port';

import { db } from 'config';
var MySql = require('sync-mysql');
const InitDatabase = () => {
  // create db if it doesn't already exist
  console.log({ db });
  const { HOST } = db;
  console.log({ HOST });
  try {
    const connection = new MySql({
      host: db.HOST,
      user: db.USERNAME,
      port: db.PORT,
      password: db.PASSWORD,
    });
    const reply = connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${db.DATABASE}\`;`
    );
    console.log({ reply });
  } catch (error) {
    console.log('catch - Error - createConnection: ', { error });
  }
  let sequelize = null;
  try {
    sequelize = new Sequelize(db.DATABASE, db.USERNAME, db.PASSWORD, {
      host: db.HOST,
      port: db.PORT,
      dialect: 'mysql',
      operatorsAliases: Sequelize.Op,
      logging: null, //console.log,
    });
  } catch (error) {
    console.log('catch - Sequelize: ', { error });
  }
  return sequelize;
};
const sequelize = InitDatabase();

const models = {
  User: userModel(sequelize, DataTypes),
  Block: blockModel(sequelize, DataTypes),
  Port: portModel(sequelize, DataTypes),
  DiagramLine: diagramLineModel(sequelize, DataTypes),
  UserDiagramm: userDiagrammModel(sequelize, DataTypes),
  Diagram: diagramModel(sequelize, DataTypes),
  BlockPort: blockPortModel(sequelize, DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
