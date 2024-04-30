export default (sequelize, DataTypes) => {
  const Diagram = sequelize.define('diagram', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    /**idUser: {
      type: DataTypes.BIGINT,
    },*/
    name: DataTypes.STRING,
  });
  Diagram.associate = (models) => {
    //N:M
    Diagram.hasMany(models.DiagramBlock, {as: "diagramblocks", foreignKey: "diagramId"})
    Diagram.hasMany(models.DiagramLine, {as: "diagramline", foreignKey: "diagramId"})
  };
  return Diagram;
};
