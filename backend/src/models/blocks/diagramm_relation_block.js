export default (sequelize, DataTypes) => {
    const DiagrammRelationBlock = sequelize.define('diagramm_relation_block', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: DataTypes.STRING,
        xBlock: DataTypes.FLOAT,
        yBlock: DataTypes.FLOAT,
        idDiagramm: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        idBlock: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    });
    DiagrammRelationBlock.associate = (models) => {
        //N:M
        DiagrammRelationBlock.belongsTo(models.BlockDiagramm, {
            as: 'block_diagramm',
            foreignKey: 'idDiagramm',
        })
        DiagrammRelationBlock.belongsTo(models.Block, {
            as: 'block',
            foreignKey: 'idBlock',
        })
    };
    return DiagrammRelationBlock;
};
