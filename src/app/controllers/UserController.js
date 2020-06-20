import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import YupPT from '../validators/locale/pt';

const { Op } = require('sequelize');

class UserController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const users = await User.findAll({
      where: {
        id: {
          [Op.not]: req.userId,
        },
      },
      attributes: [
        'id',
        'name',
        'email',
        'street',
        'phonenumber',
        'streetnumber',
      ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(users);
  }

  async store(req, res) {
    Yup.setLocale(YupPT);
    const schema = Yup.object().shape({
      name: Yup.string().required('Campo nome e obrigatorio'),
      street: Yup.string().required('Obrigatorio selecionar seu endereco'),
      streetnumber: Yup.number().required(
        'Obrigatorio preencher o numero de sua residencia'
      ),
      phonenumber: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
        .max(23),
    });

    // eslint-disable-next-line func-names
    schema.validate(req.body).catch(function(err) {
      return res.status(400).json({ error: err.errors });
    });
    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validation fails' });
    // }
    const userExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Usuario ja existente' });
    }
    // mesmo face de middleware
    // const user = await User.create(req.body); // todos os dados
    // retornar para o front end
    const {
      id,
      name,
      email,
      provider,
      street,
      streetnumber,
      phonenumber,
    } = await User.create(req.body);
    // cadastro
    return res.json({
      id,
      name,
      email,
      provider,
      street,
      streetnumber,
      phonenumber,
    });
  }

  async update(req, res) {
    // console.log(req.userId);
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      street: Yup.string().min(10),
      streetnumber: Yup.number().max(10),
      phonenumber: Yup.string().min(5),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    schema.validate(req.body).catch(function(err) {
      return res.status(400).json({ error: err.errors });
    });
    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validation fails' });
    // }
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);
    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res.status(400).json({ error: 'Email ja em uso' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res
        .status(401)
        .json({ error: 'A confirmacao da senha nao combina' });
    }
    // const { id, name, provider } =
    await user.update(req.body);
    const {
      id,
      name,
      avatar,
      streetnumber,
      phonenumber,
      street,
    } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    return res.json({
      id,
      name,
      email,
      avatar,
      street,
      phonenumber,
      streetnumber,
    });
  }

  async editUser(req, res) {
    // console.log(req.userId);
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      password: Yup.string().min(6),
      street: Yup.string(),
      streetnumber: Yup.number(),
      phonenumber: Yup.string(),
    });
    schema.validate(req.body).catch(function(err) {
      return res.status(400).json({ error: err.errors });
    });
    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validation fails' });
    // }
    const { email } = req.body;
    const provider = await User.findByPk(req.userId);
    // Bloco, checa se é admin
    if (!provider.provider) {
      return res
        .status(400)
        .json({ error: 'Somente administrador pode modificar usuários' });
    }
    const user = await User.findByPk(req.params.id);
    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) {
        return res.status(400).json({ error: 'Email ja em uso' });
      }
    }

    // const { id, name, provider } =
    await user.update(req.body);
    const {
      id,
      name,
      avatar,
      street,
      streetnumber,
      phonenumber,
    } = await User.findByPk(req.params.id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });
    return res.json({
      id,
      name,
      email,
      avatar,
      street,
      streetnumber,
      phonenumber,
    });
  }

  async getUser(req, res) {
    const users = await User.findOne({
      where: { id: req.params.id },
      attributes: [
        'id',
        'name',
        'email',
        'street',
        'active',
        'streetnumber',
        'phonenumber',
      ],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(users);
  }

  async getmyself(req, res) {
    const users = await User.findOne({
      where: { id: req.userId },
      attributes: [
        'id',
        'name',
        'email',
        'street',
        'active',
        'streetnumber',
        'phonenumber',
      ],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(users);
  }
}

export default new UserController();
