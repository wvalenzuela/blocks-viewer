export default (sequelize, DataTypes) => {
  const Block = sequelize.define('block', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    blockName: DataTypes.STRING,
    /**idDiagramm: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },*/
  });
  Block.associate = (models) => {
    //N:M
    /**Block.belongsTo(models.BlockDiagramm, {
      as: 'block_diagramm',
      foreignKey: 'idDiagramm',
    });*/
  };
  return Block;
};
