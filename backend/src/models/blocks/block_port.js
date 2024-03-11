export default (sequelize, DataTypes) => {
  const BlockPort = sequelize.define('block_port', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    idBlock: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('in', 'out'),
      allowNull: false,
    },
    idLine: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
  BlockPort.associate = (models) => {
    //
    BlockPort.belongsTo(models.Block, {
      as: 'block',
      foreignKey: 'idBlock',
    });
    BlockPort.belongsTo(models.BlockLine, {
      as: 'block_line',
      foreignKey: 'idLine',
    });
  };
  return BlockPort;
};
