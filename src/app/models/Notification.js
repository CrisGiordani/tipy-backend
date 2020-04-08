import Sequelize, { Model } from "sequelize";

class Notification extends Model {
  static init(sequelize) {
    super.init(
      {
        id_user: Sequelize.BOOLEAN,
        message: Sequelize.STRING,
        read: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    return this;
  }
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "id_user",
      as: "user",
    });
  }
}

export default Notification;
