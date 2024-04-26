export default (sequelize, DataTypes) => {
    const BlockPort = sequelize.define('block_port', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        idBlock: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        idPort: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('in', 'out'),
        },
        position: {
            type: DataTypes.BIGINT,
            allowNull: false,
        }
    });
    BlockPort.associate = (models) => {
        //
        BlockPort.belongsTo(models.Block, {
            as: "block",
            foreignKey: "id",
        })
        BlockPort.belongsTo(models.Port, {
            as: "port",
            foreignKey: "idPort",
        })
    };
    return BlockPort;
};
