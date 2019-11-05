import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  // recebe e bota tudo!
  async handle({ data }) {
    const { appointment } = data;
    // console.log('A FILA EXECUTOU');
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}`,
      subject: 'Agendamento Cancelado',
      // text: 'Voce tem um novo cancelamento',
      template: 'cancelation',
      // enviar todas as variaveis pro template do mail
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM,'ás' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}
export default new CancellationMail();
// import cancellation mail from

// cancelatiionmail.key
