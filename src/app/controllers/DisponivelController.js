import {
  startOfDay,
  endOfDay,
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Encomenda from '../models/Encomenda';
import Entregador from '../models/Entregador';

class DisponivelController {
  async index(req, res) {
    const { start_date } = req.query;

    if (!start_date) {
      return res.status(400).json({ error: 'data inválida' });
    }

    const searchDate = Number(start_date);

    const encomenda = await Encomenda.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const horarios = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ];

    const disponivel = horarios.map(time => {
      const [hour, minute] = time.split(':');
      const value = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        disponivel:
          isAfter(value, new Date()) &&
          !encomenda.find(e => format(e.start_date, 'HH:mm') === time),
      };
    });

    return res.json(disponivel);
  }
}

export default new DisponivelController();
