export default (sequelize, DataTypes) => {
  const Block = sequelize.define('block', {
    name: DataTypes.STRING,
    color: DataTypes.STRING,

  });
  Block.associate = (models) => {
    //N:M 
    //Block.belongsToMany(models.Port, { through: models.BlockPort });
    //Block.belongsToMany(models.Diagram, { through: models.DiagramBlock });        

    //Block.belongsToMany(models.Port, { through: models.BlockPort} );

  };
  return Block;
};
