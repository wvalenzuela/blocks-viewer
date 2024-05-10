export default (sequelize, DataTypes) => {
    const DiagramBlock = sequelize.define('diagram_block', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
        xPos: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        yPos: {
            type: DataTypes.FLOAT,
            allowNull: false,
        }
    });
    DiagramBlock.associate = (models) => {
        //N:M
        /*
        DiagramBlock.belongsTo(models.Diagram, {
            as: "diagram",
            foreignKey: 'idDiagram',
        })
        DiagramBlock.belongsTo(models.Block, {
            as: "block",
            foreignKey: 'idBlock',
        })*/
        //DiagramBlock.belongsToMany(models.Diagram, { through: models.DiagramLine, as: 'block', foreignKey: 'idBlockOut' });
        //DiagramBlock.belongsToMany(models.Diagram, { through: models.DiagramLine, as: 'block', foreignKey: 'idBlockIn' });
       // DiagramBlock.belongsTo(models.Block, { as: 'block', foreignKey: 'idBlock'})
        //DiagramBlock.belongsToMany(models.DiagramLine), { as: 'diagramlines', foreignKey: 'idBlockOut'}
        DiagramBlock.belongsTo(models.Diagram);
        DiagramBlock.belongsTo(models.Block);
    };
    return DiagramBlock;
};
