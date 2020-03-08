import Sequelize, { Model } from 'sequelize';

class Problem extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        tableName: 'delivery_problems',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Encomenda, {
      foreignKey: 'delivery_id',
      as: 'encomendaId',
    });
  }
}

export default Problem;
