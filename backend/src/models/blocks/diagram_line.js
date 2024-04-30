export default (sequelize, DataTypes) => {
  const DiagramLine = sequelize.define('diagram_line', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    idDiagram: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    idBlockOut: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    idPortOut: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    idBlockIn: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    idPortIn: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

  });
  DiagramLine.associate = (models) => {
    //
    /*
    DiagramLine.belongsTo(models.Diagram, {
      as: 'diagram',
      foreignKey: 'idDiagram',
    })
    DiagramLine.belongsTo(models.Block, {
      as: 'blockOut',
      foreignKey: 'idBlockOut',
    })
    DiagramLine.belongsTo(models.Port, {
      as: 'portOut',
      foreignKey: 'idPortOut',
    })
    DiagramLine.belongsTo(models.Block, {
      as: 'blockIn',
      foreignKey: 'idBlockIn',
    })
    DiagramLine.belongsTo(models.Port, {
      as: 'portIn',
      foreignKey: 'idPortIn',
    })*/
    DiagramLine.belongsTo(models.DiagramBlock, { as: 'outputblock', foreignKey: 'idBlockOut'})
    DiagramLine.belongsTo(models.DiagramBlock, { as: 'inputblock', foreignKey: 'idBlockIn'})
  };
  return DiagramLine;
};
