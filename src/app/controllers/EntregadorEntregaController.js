import { format } from 'date-fns';
import Encomenda from '../models/Encomenda';

class EntregadorEntregaController {
  async update(req, res) {
    const { end_date } = req.body;

    if (!end_date) {
      return res.status(400).json({ error: 'data inválida' });
    }

    const encomenda = await Encomenda.findByPk(req.params.id);

    if (!encomenda) {
      return res.status(400).json({ error: 'Encomenda não encontrada' });
    }

    const { product } = await encomenda.update(req.body);

    const dateTime = Number(end_date);
    const resultDate = format(dateTime, "yyyy-MM-dd'T'HH:mm:ssxxx");

    return res.json({
      message: `Produto: ${product} entregue em: ${resultDate}`,
    });
  }
}

export default new EntregadorEntregaController();
