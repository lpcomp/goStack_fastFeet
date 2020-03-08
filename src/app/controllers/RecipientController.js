import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      rua: Yup.string().required(),
      numero: Yup.number().required(),
      complemento: Yup.string().required(),
      estado: Yup.string().required(),
      cidade: Yup.string().required(),
      cep: Yup.number().required(),
    });

    // console.log(req.userId);

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Algum campo inválido!' });
    }

    const recipientExist = await Recipient.findOne({
      where: { nome: req.body.nome },
    });

    if (recipientExist) {
      return res.status(400).json({ error: 'Destinatário já existe!' });
    }

    const recipient = await Recipient.create(req.body); // const { id, name, email, provider } = await User.create(req.body);

    return res.json({ recipient });
    /* return res.json({
      id,
      name,
      email,
      provider,
    }); */
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      nome: Yup.string(),
      rua: Yup.string(),
      numero: Yup.number(),
      complemento: Yup.string(),
      estado: Yup.string(),
      cidade: Yup.string(),
      cep: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Algum campo inválido!' });
    }

    const { id } = req.body;
    const recipient = await Recipient.findByPk(id);

    const response = await recipient.update(req.body);

    return res.json({ response });
  }
}

export default new RecipientController();
