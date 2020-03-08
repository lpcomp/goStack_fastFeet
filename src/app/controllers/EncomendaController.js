import * as Yup from 'yup';
import Encomenda from '../models/Encomenda';
import Recipient from '../models/Recipient';
import Entregador from '../models/Entregador';
import File from '../models/File';
import Mail from '../../lib/Mail';

class EncomendaController {
  async index(req, res) {
    const encomendas = await Encomenda.findAll({
      attributes: ['id', 'product'],
      include: [
        {
          model: File,
          as: 'signatureId',
          attributes: ['name', 'path'],
        },
        {
          model: Recipient,
          as: 'recipientId',
          attributes: [
            'nome',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
          ],
        },
        {
          model: Entregador,
          as: 'entregadorId',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(encomendas);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Algum campo inválido!' });
    }

    const recipientExist = await Recipient.findByPk(req.body.recipient_id);

    if (!recipientExist) {
      return res.status(400).json({ error: 'Destinatário não existe!' });
    }

    const entregadorExist = await Entregador.findByPk(req.body.deliveryman_id);

    if (!entregadorExist) {
      return res.status(400).json({ error: 'Entregador não existe!' });
    }

    const {
      id,
      recipient_id,
      deliveryman_id,
      product,
    } = await Encomenda.create(req.body);

    await Mail.sendMail({
      to: `${entregadorExist.name} <${entregadorExist.email}>`,
      subject: 'Nova encomenda para entrega',
      text: `O novo produto: ${product}, está disponível para entrega no endereço: ${recipientExist.rua}, número ${recipientExist.numero}`,
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Algum campo inválido!' });
    }

    const recipientExist = await Recipient.findByPk(req.body.recipient_id);

    if (!recipientExist) {
      return res.status(400).json({ error: 'Destinatário não existe!' });
    }

    const entregadorExist = await Entregador.findByPk(req.body.deliveryman_id);

    if (!entregadorExist) {
      return res.status(400).json({ error: 'Entregador não existe!' });
    }

    const encomenda = await Encomenda.findByPk(req.params.id);

    const { id } = await encomenda.update(req.body);

    const dadosEncomenda = await Encomenda.findByPk(id, {
      attributes: ['id', 'product'],
      include: [
        {
          model: File,
          as: 'signatureId',
          attributes: ['name', 'path'],
        },
        {
          model: Recipient,
          as: 'recipientId',
          attributes: [
            'nome',
            'rua',
            'numero',
            'complemento',
            'estado',
            'cidade',
            'cep',
          ],
        },
        {
          model: Entregador,
          as: 'entregadorId',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(dadosEncomenda);
  }

  async delete(req, res) {
    const encomenda = await Encomenda.findByPk(req.params.id);

    if (!encomenda) {
      return res.status(401).json({
        error: 'Encomenda não encontrada.',
      });
    }

    await encomenda.destroy();

    return res.json({ message: 'Encomenda removida com sucesso.' });
  }
}

export default new EncomendaController();
