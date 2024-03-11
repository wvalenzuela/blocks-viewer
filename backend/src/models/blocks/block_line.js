export default (sequelize, DataTypes) => {
  const BlockLine = sequelize.define('block_line', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    idPortIn: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    idPortOut: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  });
  BlockLine.associate = (models) => {
    //
    BlockLine.belongsTo(models.BlockPort, {
      as: 'port_in',
      foreignKey: 'idPortIn',
    });
    BlockLine.belongsTo(models.BlockPort, {
      as: 'port_out',
      foreignKey: 'idPortOut',
    });
  };
  return BlockLine;
};
