export default (sequelize, DataTypes) => {
  const Port = sequelize.define('port', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  Port.associate = (models) => {
    //Port.belongsToMany(models.Block, { through: models.BlockPort });
    Port.belongsToMany(models.Block, { through: models.BlockPort, as: 'block', foreignKey: 'idPort' });
  };

  return Port;
};
