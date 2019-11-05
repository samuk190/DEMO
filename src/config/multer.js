import multer from 'multer';
import crypto from 'crypto';

import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        // transforma conteudo de 16bytes em uma string aleatoria hex
        // 4142141241fasf.png
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
