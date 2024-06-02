export default (sequelize, DataTypes) => {
    const BlockPort = sequelize.define('block_port', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
        type: {
            type: DataTypes.ENUM('in', 'out'),
        },
        position: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        multi: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    });

    BlockPort.associate = (models) => {
        //
        /*
        BlockPort.belongsTo(models.Block, {
            as: "block",
            foreignKey: "idBlock",
        })
        BlockPort.belongsTo(models.Port, {
            as: "port",
            foreignKey: "idPort",
        })  */
        BlockPort.belongsTo(models.Block);
        BlockPort.belongsTo(models.Port);


    };


    return BlockPort;
};
