import { Sequelize, DataTypes } from 'sequelize';
import blockModel from './blocks/block';
import blockPortModel from './blocks/block_port';
import blockLineModel from './blocks/block_line';
import blockDiagrammModel from './blocks/block_diagramm';
import userDiagrammModel from './blocks/user_diagram';
import userModel from './user/user';
import diagrammRelationBlock from "./blocks/diagramm_relation_block";
import diagrammRelationLine from "./blocks/diagramm_relation_line";
import portRelationLine from "./blocks/port_relation_line";

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
  BlockPort: blockPortModel(sequelize, DataTypes),
  BlockLine: blockLineModel(sequelize, DataTypes),
  BlockDiagramm: blockDiagrammModel(sequelize, DataTypes),
  UserDiagramm: userDiagrammModel(sequelize, DataTypes),
  DiagrammRelationBlock: diagrammRelationBlock(sequelize, DataTypes),
  DiagrammRelationLine: diagrammRelationLine(sequelize, DataTypes),
  PortRelationLine: portRelationLine(sequelize, DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
