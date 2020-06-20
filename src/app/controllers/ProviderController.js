import User from '../models/User';
import File from '../models/File';
// esse provider é o prestador de serviços da RA VIGILANCIA
class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      // onde
      where: { provider: true },
      // atributos que quero exibir
      attributes: ['id', 'name', 'email', 'avatar_id'],
      // retornar todos os dados do avatar id
      include: [
        { model: File, as: 'avatar', attributes: ['name', 'path', 'url'] },
      ],
    });
    return res.json(providers);
  }
}

export default new ProviderController();
