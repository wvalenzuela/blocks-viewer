export default (sequelize, DataTypes) => {
  const Diagram = sequelize.define('diagram', {
    /**idUser: {
      type: DataTypes.BIGINT,
    },*/
    name: DataTypes.STRING,
  });
  Diagram.associate = (models) => {
    //N:M
    //Diagram.hasMany(models.DiagramBlock, {as: "diagramblocks", foreignKey: "diagramId"})
    //Diagram.hasMany(models.DiagramLine);
    //Diagram.belongsToMany(models.Block, { through: models.DiagramBlock });        

  };
  return Diagram;
};
