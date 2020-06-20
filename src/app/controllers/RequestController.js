/* eslint-disable no-shadow */
import * as Yup from 'yup';
// import { Op } from 'sequelize';

import Request from '../models/Request';
import User from '../models/User';
import File from '../models/File';
import Userdevice from '../models/Userdevice';
// import Notification from '../schemas/Notification';
// import CancellationMail from '../jobs/CancellationMail';
const https = require('https');
// listagem pro usuario
class RequestController {
  async index(req, res) {
    const checkisProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkisProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load requests' });
    }
    const { page = 1 } = req.query;
    const requests = await Request.findAll({
      // where: { [Op.not]: [{ user_id: req.userId }] },
      order: [['created_at', 'DESC']],

      attributes: ['id', 'lat', 'lon', 'type', 'read', 'created_at'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'street', 'streetnumber', 'phonenumber'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });
    return res.json(requests);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      lat: Yup.number(),
      lon: Yup.number(),
      type: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const { type, lat, lon } = req.body;
    const requests = await Request.create({
      user_id: req.userId,
      type,
      lat,
      lon,
      read: false,
    });

    // const ids = await User.findAll({
    //   where: { provider: true },
    //   raw: true,
    //   include: [{ model: Userdevice, as: 'userdevice' }],
    // }).then(userDevices => userDevices.map(userDevice => userDevice.iddevice));
    const user = await User.findOne({
      where: { id: req.userId },
    });
    const ids = await Userdevice.findAll({
      attributes: ['iddevice'],
      raw: true,
      include: [
        {
          model: User,
          as: 'user',
          where: {
            provider: true,
          },
        },
      ],
    }).then(userDevices => userDevices.map(userDevice => userDevice.iddevice));
    console.log(ids);
    const sendNotification = function(data) {
      const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Basic YTYxMThmOWEtZDU2ZS00ZDk3LTliMDAtOGYyNTlkMzAyMjBh',
      };

      const options = {
        host: 'onesignal.com',
        port: 443,
        path: '/api/v1/notifications',
        method: 'POST',
        headers,
      };

      const req = https.request(options, function(res) {
        res.on('data', function(data) {
          console.log('Response:');
          console.log(JSON.parse(data));
        });
      });

      req.on('error', function(e) {
        console.log('ERROR:');
        console.log(e);
      });

      req.write(JSON.stringify(data));
      req.end();
    };
    let pedido = '';

    // console.log(req.body);
    if (req.body.type === 1) {
      pedido = `MORADOR ${user.name.toUpperCase()} NECESSITA DE ESCOLTA`;
    }

    if (req.body.type === 2) {
      pedido = `MORADOR ${user.name.toUpperCase()} INFORMA ATIVIDADE SUSPEITA NO BAIRRO!`;
    }

    if (req.body.type === 3) {
      pedido = `MORADOR ${user.name.toUpperCase()} SOLICITOU EMERGÊNCIA`;
    }
    if (req.body.type === 3) {
      pedido = `MORADOR ${user.name.toUpperCase()} PEDIU PARA RECEBER EM CASA`;
    }
    const message = {
      app_id: 'aa85b23a-9aa1-4e66-8674-0c9b48cecbc7',
      contents: { en: `${pedido}` },
      headings: { en: `SOLICITAÇÃO` },
      include_player_ids: ids,
    };

    sendNotification(message);

    return res.json(requests);
  }

  async update(req, res) {
    const checkisProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checkisProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load requests' });
    }

    const schema = Yup.object().shape({
      read: Yup.boolean(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const requests = await Request.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id'],
        },
      ],
    });
    if (requests.read) {
      return res.status(400).json({ error: 'Already in Read State' });
    }
    await requests.update(req.body);

    const ids = await Userdevice.findAll({
      where: { userid: requests.user.id },
      attributes: ['iddevice'],
      raw: true,
    }).then(userDevices => userDevices.map(userDevice => userDevice.iddevice));
    // console.log(ids);
    const sendNotification = function(data) {
      const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Basic YTYxMThmOWEtZDU2ZS00ZDk3LTliMDAtOGYyNTlkMzAyMjBh',
      };

      const options = {
        host: 'onesignal.com',
        port: 443,
        path: '/api/v1/notifications',
        method: 'POST',
        headers,
      };

      const req = https.request(options, function(res) {
        res.on('data', function(data) {
          console.log('Response:');
          console.log(JSON.parse(data));
        });
      });

      req.on('error', function(e) {
        console.log('ERROR:');
        console.log(e);
      });

      req.write(JSON.stringify(data));
      req.end();
    };
    let pedido = '';
    // console.log(req.body);
    if (req.body.type === 1) {
      pedido = 'Seu pedido de escolta foi lido pelo vigilante';
    }

    if (req.body.type === 2) {
      pedido =
        'Seu pedido de Atividade Suspeita está sendo averiguado em sua localidade';
    }

    if (req.body.type === 3) {
      pedido = 'O Vigilante está indo até a sua localidade';
    }
    const message = {
      app_id: 'aa85b23a-9aa1-4e66-8674-0c9b48cecbc7',
      contents: { en: `${pedido}` },
      headings: { en: `Sucesso` },
      include_player_ids: ids,
    };

    sendNotification(message);

    return res.json(requests);
  }

  async delete(req, res) {
    const checkisProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    if (!checkisProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load requests' });
    }
    const request = await Request.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: [
            'name',
            'email',
            'street',
            'streetnumber',
            'phonenumber',
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    await request.delete();

    return res.json(request);
  }

  async notification(req, res) {
    const sendNotification = function(data) {
      const headers = {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: 'Basic YTYxMThmOWEtZDU2ZS00ZDk3LTliMDAtOGYyNTlkMzAyMjBh',
      };

      const options = {
        host: 'onesignal.com',
        port: 443,
        path: '/api/v1/notifications',
        method: 'POST',
        headers,
      };

      const req = https.request(options, function(res) {
        res.on('data', function(data) {
          console.log('Response:');
          console.log(JSON.parse(data));
        });
      });

      req.on('error', function(e) {
        return res.status(400).json({ error: `Validation Fails ${e}` });

        // console.log('ERROR:');
        // console.log(e);
      });

      req.write(JSON.stringify(data));
      req.end();
    };

    const checkisProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkisProvider) {
      return res
        .status(401)
        .json({ error: 'Only providers can load requests' });
    }
    const { notification, notificationTitle } = req.body;
    const message = {
      app_id: 'aa85b23a-9aa1-4e66-8674-0c9b48cecbc7',
      contents: { en: `${notification}` },
      headings: { en: `${notificationTitle}` },
      filters: [
        { field: 'tag', key: 'provider', relation: '=', value: 'true' },
      ],
    };

    sendNotification(message);
    return res.json(notification);
  }
}

export default new RequestController();
