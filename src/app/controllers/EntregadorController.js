import * as Yup from 'yup';
import Entregador from '../models/Entregador';
import File from '../models/File';

class EntregadorController {
  async index(req, res) {
    const entregadores = await Entregador.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path'],
        },
      ],
    });

    return res.json(entregadores);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      // avatar_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Algum campo inválido!' });
    }

    const entregadorExist = await Entregador.findOne({
      where: { email: req.body.email },
    });

    if (entregadorExist) {
      return res.status(400).json({ error: 'Entregador já existe!' });
    }

    const { id, name, email } = await Entregador.create(req.body);
    return res.json({
      id,
      name,
      email,
    });

    // return res.json(req.body);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Algum campo inválido!' });
    }

    const { email } = req.body;
    const entregador = await Entregador.findByPk(req.params.id);

    if (email && email !== entregador.email) {
      const entregadorExist = await Entregador.findOne({ where: { email } });

      if (entregadorExist) {
        return res.status(400).json({ error: 'E-mail já utilizado!' });
      }
    }

    const { id, name } = await entregador.update(req.body);

    return res.json({ id, name, email });
  }

  async delete(req, res) {
    const entregador = await Entregador.findByPk(req.params.id);

    if (!entregador) {
      return res.status(401).json({
        error: 'Entregador não encontrado.',
      });
    }

    await entregador.destroy();

    return res.json({ message: 'Entregador removido com sucesso.' });
  }
}

export default new EntregadorController();
