export default (sequelize, DataTypes) => {
    const DiagrammRelationLine = sequelize.define('diagramm_relation_line', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: DataTypes.STRING,
        idDiagramm: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        idLine: {
            type: DataTypes.BIGINT,
            allowNull: false,
        }
    });
    DiagrammRelationLine.associate = (models) => {
        //N:M
        DiagrammRelationLine.belongsTo(models.BlockDiagramm, {
            as: 'block_diagramm',
            foreignKey: 'idLine',
        })
        DiagrammRelationLine.belongsTo(models.BlockLine, {
            as: 'block_line',
            foreignKey: 'idLine',
        })
    };
    return DiagrammRelationLine;
};
