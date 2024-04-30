export default (sequelize, DataTypes) => {
  const Block = sequelize.define('block', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    color: {
      type: DataTypes.STRING,
    }


  });
  Block.associate = (models) => {
    //N:M 
    //Block.belongsToMany(models.Port, { through: models.BlockPort });
    Block.belongsToMany(models.Port, { through: models.BlockPort, as: 'port', foreignKey: 'idBlock' });    

  };
  return Block;
};
