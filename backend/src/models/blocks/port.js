export default (sequelize, DataTypes) => {
  const Port = sequelize.define('port', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });
  Port.associate = (models) => {
    //
  };
  return Port;
};
