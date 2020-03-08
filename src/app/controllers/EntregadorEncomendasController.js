import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Encomenda from '../models/Encomenda';
import Entregador from '../models/Entregador';

class EntregadorEncomendasController {
  async index(req, res) {
    const entregador = await Entregador.findByPk(req.params.id);

    if (!entregador) {
      return res.status(400).json({ error: 'Entregador não encontrado' });
    }

    const searchDate = new Date();
    const { tipo } = req.query; // atual para todas as encomendas atuais e anteriores para encomendas anteriores

    const encomendas = await Encomenda.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date:
          tipo === 'atual'
            ? null
            : { [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)] },
      },
    });

    return res.json(encomendas);
  }
}

export default new EntregadorEncomendasController();
