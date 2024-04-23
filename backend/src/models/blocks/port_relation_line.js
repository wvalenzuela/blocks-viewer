export default (sequelize, DataTypes) => {
    const PortRelationLine = sequelize.define('port_relation_line', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: DataTypes.STRING,
        idLine: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        idPortIn : {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        idPortOut : {
            type: DataTypes.BIGINT,
            allowNull: false,
        }
    });
    PortRelationLine.associate = (models) => {
        //N:M
        PortRelationLine.belongsTo(models.BlockLine, {
            as: 'block_line',
            foreignKey: 'idLine'
        })
        PortRelationLine.belongsTo(models.BlockPort, {
            as: 'port_in',
            foreignKey: 'idPortIn',
        })
        PortRelationLine.belongsTo(models.BlockPort, {
            as: 'port_out',
            foreignKey: 'idPortOut',
        })
    };
    return PortRelationLine;
};
