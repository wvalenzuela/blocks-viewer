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
      type: DataTypes.STRING,
    },
  });
  BlockDiagramm.associate = (models) => {
    //N:M
  };
  return BlockDiagramm;
};
