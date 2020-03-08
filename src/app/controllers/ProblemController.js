import * as Yup from 'yup';
import Encomenda from '../models/Encomenda';
import Entregador from '../models/Entregador';
import Problem from '../models/Problem';
import Mail from '../../lib/Mail';

class ProblemController {
  async index(req, res) {
    let problems = '';

    const { recipentId } = req.body;

    if (recipentId !== 'all') {
      const encomendasDistribuidora = await Encomenda.findAll({
        where: { recipient_id: recipentId },
      });

      problems = encomendasDistribuidora.filter(
        ele => Number(ele.id) === Number(req.params.id)
      );
    } else {
      problems = await Problem.findAll({
        where: { delivery_id: req.params.id },
        attributes: ['delivery_id', 'description'],
      });
    }

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Algum campo inválido!' });
    }

    const entregadorExist = await Entregador.findByPk(req.params.id);

    if (!entregadorExist) {
      return res.status(400).json({ error: 'Entregador não existe!' });
    }

    const encomendaExist = await Encomenda.findByPk(req.body.delivery_id);

    if (!encomendaExist) {
      return res.status(400).json({ error: 'Encomenda não existe!' });
    }

    const { delivery_id, description } = await Problem.create(req.body);

    return res.json({ delivery_id, description });
  }

  async delete(req, res) {
    const problema = await Problem.findByPk(req.params.id);

    const encomenda = await Encomenda.findByPk(problema.delivery_id);

    const entregador = await Entregador.findByPk(encomenda.deliveryman_id);

    encomenda.canceled_at = new Date();

    await encomenda.save();

    await Mail.sendMail({
      to: `${entregador.name} <${entregador.email}>`,
      subject: 'Cancelamento da entrega',
      text: `A entrega do produto: ${encomenda.product}, foi cancelado pelo seguinte motivo: ${problema.description}`,
    });

    return res.json(encomenda);
  }
}

export default new ProblemController();
