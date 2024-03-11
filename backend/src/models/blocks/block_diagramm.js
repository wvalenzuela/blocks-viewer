export default (sequelize, DataTypes) => {
  const BlockDiagramm = sequelize.define('block_diagramm', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    idUser: {
      type: DataTypes.BIGINT,
    },
    name: {
      type: DataTypes.BIGINT,
    },
  });
  BlockDiagramm.associate = (models) => {
    //N:M
  };
  return BlockDiagramm;
};
