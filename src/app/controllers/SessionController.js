import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import File from '../models/File';
import UserDevice from '../models/Userdevice';
// importa config de auth
import authConfig from '../../config/auth';
// ou email
const Sequelize = require('sequelize');

const { Op } = Sequelize;
class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, password, deviceId } = req.body;
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'password does not match' });
    }
    // cadastrar dispositivos

    const { id, name, avatar, provider, active } = user;
    const userD = await UserDevice.findOne({
      where: { iddevice: deviceId },
    });
    if (!userD) {
      // verifica se o id do dispositivo foi cadastrado com outra conta
      const deleted = await UserDevice.findAll({
        where: { iddevice: deviceId, [Op.not]: [{ userid: id }] },
      });

      if (deleted) {
        UserDevice.destroy({
          where: {
            iddevice: deviceId,
          },
        });
      }
      await UserDevice.create({
        userid: id,
        iddevice: deviceId,
      });
    }

    return res.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar,
        active,
        deviceId,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}
export default new SessionController();
