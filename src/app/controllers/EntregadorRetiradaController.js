import { format, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Encomenda from '../models/Encomenda';

class EntregadorRetiradaController {
  async update(req, res) {
    const { start_date } = req.body;

    if (!start_date) {
      return res.status(400).json({ error: 'data inválida' });
    }

    const encomenda = await Encomenda.findByPk(req.params.id);

    if (!encomenda) {
      return res.status(400).json({ error: 'Encomenda não encontrada' });
    }

    if (encomenda.canceled_at !== undefined && encomenda.canceled_at !== null) {
      return res.status(400).json({ error: 'Encomenda cancelada' });
    }

    if (encomenda.end_date !== null && encomenda.end_date !== undefined) {
      return res.status(400).json({ error: 'Encomenda já entregue' });
    }

    const searchDate = new Date();

    const qtdRetirada = await Encomenda.findAll({
      where: {
        deliveryman_id: encomenda.deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    if (qtdRetirada >= 5) {
      return res
        .status(400)
        .json({ error: 'Número diário de retiradas alcançado (max. 5)' });
    }

    const { product } = await encomenda.update(req.body);

    const dateTime = Number(start_date);
    const resultDate = format(dateTime, "yyyy-MM-dd'T'HH:mm:ssxxx");

    return res.json({
      message: `Produto: ${product} retirado para entrega em: ${resultDate}`,
    });
  }
}

export default new EntregadorRetiradaController();
