import Sequelize, { Model } from 'sequelize';

class Encomenda extends Model {
  static init(sequelize) {
    super.init(
      {
        product: Sequelize.STRING,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        tableName: 'encomendas',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'signature_id',
      as: 'signatureId',
    });
    this.belongsTo(models.Recipient, {
      foreignKey: 'recipient_id',
      as: 'recipientId',
    });
    this.belongsTo(models.Entregador, {
      foreignKey: 'deliveryman_id',
      as: 'entregadorId',
    });
  }
}

export default Encomenda;
