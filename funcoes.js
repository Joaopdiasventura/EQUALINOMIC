import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'jpplayrucoy@gmail.com',
    pass: 'fwkg dkgg bigp ufqw',
  },
});

function enviar_menssagem(empresas) {

  for (let i = 0; i < empresas.length; i++) {
    if (empresas[i].valor < 3) {
      const mailOptions = {
        from: 'jpplayrucoy@gmail.com',
        to: 'joaopdiasventura@gmail.com',
        subject: 'Empresa Com Média Baixa',
        text: `Empresa: ${empresas[i].nome}, Média: ${empresas[i].valor}, Telefone: ${empresas[i].telefone}, E-Mail: ${empresas[i].email}, Endereço: ${empresas[i].endereco}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Erro ao enviar o e-mail: ' + error);
        } else {
          console.log('E-mail enviado com sucesso: ' + info.response);
        }
      });
    }
  }
}

function calcular_media(avaliacoes) {
  let soma = 0;

  for (let i = 0; i < avaliacoes.length; i++) {
    soma += avaliacoes[i].pontuacao;
  }

  return `${(soma / avaliacoes.length).toFixed(2)}`;
}

export { enviar_menssagem, calcular_media };
