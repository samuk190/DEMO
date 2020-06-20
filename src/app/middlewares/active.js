import User from '../models/User';
import File from '../models/File';

export default async (req, res, next) => {
  // console.log(decoded);
  const users = await User.findOne({
    where: { id: req.userId },
    attributes: [
      'id',
      'name',
      'email',
      'street',
      'streetnumber',
      'phonenumber',
      'active',
    ],
    include: [
      {
        model: File,
        as: 'avatar',
        attributes: ['id', 'path', 'url'],
      },
    ],
  });

  if (!users.active) {
    // Verificação usuario
    return res.status(400).json({ error: 'Usuario nao ativo' });
  }
  return next();
};
