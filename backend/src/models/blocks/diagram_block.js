export default (sequelize, DataTypes) => {
    const DiagramBlock = sequelize.define('diagram_block', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        idDiagram: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        idBlock: {
            type: DataTypes.BIGINT,
            allowNull: false,
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
        DiagramBlock.belongsTo(models.Block, { as: 'block', foreignKey: 'idBlock'})
        
    };
    return DiagramBlock;
};
