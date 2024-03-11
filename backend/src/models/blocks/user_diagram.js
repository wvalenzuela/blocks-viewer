export default (sequelize, DataTypes) => {
  const UserDiagramm = sequelize.define('user_diagramm', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    idUser: {
      type: DataTypes.BIGINT,
    },
  });
  UserDiagramm.associate = (models) => {
    //N:M
  };
  return UserDiagramm;
};
