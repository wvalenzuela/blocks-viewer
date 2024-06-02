export default (sequelize, DataTypes) => {
  const Port = sequelize.define('port', {
    name: DataTypes.STRING,
    color: DataTypes.STRING,
  });
  Port.associate = (models) => {
    //Port.belongsToMany(models.Block, { through: models.BlockPort });
    //Port.belongsToMany(models.Block, { through: models.BlockPort});
  };

  return Port;
};
