import { Router } from "express";
import Empresa from "../models/empresa.js";
import Media from "../models/media.js";
import Funcionario from "../models/funcionario.js";
import Avaliacao from "../models/avaliacao.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt"
import { enviar_menssagem } from "../funcoes.js";
import { calcular_media } from "../funcoes.js";

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'jpplayrucoy@gmail.com',
        pass: 'fwkg dkgg bigp ufqw',
    },
});

const input = Router();

input.get("/", (req, res) => {
    res.render("index");
})

input.get("/empresas", async (req, res) => {
    try {
        const empresas = await Empresa.find();

        for (const empresa of empresas) {
            const funcionarios = await Funcionario.find();

            let quantidade = 0;
            for (const funcionario of funcionarios) {
                if (funcionario.enviado) {
                    quantidade += 1;
                }
            }

            if (quantidade === funcionarios.length && funcionarios.length != 0) {
                await enviar_media(empresa._id);
                if (empresa.media == "Média de NaN pontos de qualidade") {

                    empresa.media = `Nenhuma média registrada...`;
                    await empresa.save();
                }
            } else {
                empresa.media = `Nenhuma média registrada...`;
                await empresa.save();
            }
        

            const media = await Media.findOne({ empresa: empresa._id }).sort({ data: -1 });

            if (media) {
                if (parseFloat(media.valor) < 3 && empresa.verificado == false && parseFloat(media.valor) != NaN) {
                    const mailOptions = {
                        from: 'jpplayrucoy@gmail.com',
                        to: 'joaopdiasventura@gmail.com',
                        subject: 'Empresa Com Média Baixa',
                        text: `Empresa: ${empresa.nome}, Média: ${parseFloat(media.valor)}, Telefone: ${empresa.telefone}, E-Mail: ${empresa.email}, Endereço: ${empresa.endereco}, ID: ${empresa._id}`,
                    };

                    await transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log('Erro ao enviar o e-mail: ' + error);
                        } else {
                            console.log('E-mail enviado com sucesso: ' + info.response);
                        }
                    });
                    empresa.verificado = true;
                    await empresa.save();
                }
            }
        }

        res.render("empresas", { empresas: empresas });
    } catch (error) {
        console.error(error);
    }
});


input.get("/info", (req, res) => {
    res.render("info");
})

input.get("/registrar/empresa", (req, res) => {
    res.render("addempresa");
})

input.get("/registrar/funcionario", (req, res) => {
    Empresa.find().then((empresas) => {
        res.render("addfuncionario", { empresas: empresas });
    })
})

input.get("/avaliar", (req, res) => {
    res.render("avaliar");
})

input.post("/registrar/empresa", async (req, res) => {
    try {
        let erros = [];

        if (req.body.cnpj.length < 14) {
            erros.push({ mensagem: "Cnpj Inválido" })
        }

        if (req.body.telefone.length < 11) {
            erros.push({ mensagem: "Telefone Inválido" })
        }

        if (erros.length > 0) {
            return res.render("addempresa", { erros: erros });
        }

        const empresaExistente = await Empresa.findOne({ cnpj: req.body.cnpj });

        if (empresaExistente) {
            erros.push({ mensagem: "Empresa já registrada no sistema" });
            res.render("addempresa", { erros: erros });
        } else {

            const novaEmpresa = new Empresa({
                nome: req.body.nome,
                cnpj: req.body.cnpj,
                email: req.body.email,
                endereco: req.body.endereco,
                telefone: req.body.telefone,
                servico: req.body.servico,
                chaveg: req.body.chaveg,
                chavef: req.body.chavef
            });

            bcrypt.genSalt(10, (erro, salt) => {
                if (erro) {
                    res.send(erro);
                    throw erro;
                }
                bcrypt.hash(novaEmpresa.chaveg, salt, async (erro, hash) => {
                    if (erro) {
                        res.send(erro);
                        throw erro;
                    }

                    novaEmpresa.chaveg = hash;

                    bcrypt.hash(novaEmpresa.chavef, salt, async (erro, hash) => {
                        if (erro) {
                            res.send(erro);
                            throw erro;
                        }

                        novaEmpresa.chavef = hash;
                        await novaEmpresa.save();
                        res.redirect("/empresas");
                    });
                });
            });
        }

    } catch (error) {
        console.error("Erro ao registrar empresa:", error);
        res.status(500).send("Erro interno do servidor");
    }
});

input.post("/registrar/funcionario", (req, res) => {
    let erros = [];

        if (req.body.cpf.length < 11) {
            erros.push({ mensagem: "Cnpj Inválido" })
        }

        if (req.body.telefone.length < 11) {
            erros.push({ mensagem: "Telefone Inválido" })
        }

        if (erros.length > 0) {
            return res.render("addfuncionario", { erros: erros });
        }

    Empresa.findOne({ _id: req.body.empresa }).then((empresa) => {
        bcrypt.compare(req.body.chavef, empresa.chavef, (erro, batem) => {
            if (erro) {
                return res.send("deu um erro");
            }

            if (batem) {
                Funcionario.findOne({ cpf: req.body.cpf }).then(async (funcionario) => {
                    if (funcionario) {
                        Empresa.find().then((empresas) => {
                            erros.push({ mensagem: "Funcionário cadastrado no sistema" });
                            res.render("addfuncionario", { empresas: empresas, erros: erros })
                        })
                    }
                    else {
                        const novoFuncionario = new Funcionario({
                            nome: req.body.nome,
                            cpf: req.body.cpf,
                            telefone: req.body.telefone,
                            sexo: req.body.sexo,
                            empresa: req.body.empresa,
                            salario: req.body.salario,
                            cargo: req.body.cargo
                        });

                        await novoFuncionario.save();

                        const mailOptions = {
                            from: 'jpplayrucoy@gmail.com',
                            to: empresa.email,
                            subject: 'Funcionário Cadastrado',
                            text: `Funcionário: ${req.body.nome}, Cargo: ${req.body.cargo}, Salário: ${req.body.salario}, Contato: ${req.body.telefone}`,
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log('Erro ao enviar o e-mail: ' + error);
                            } else {
                                console.log('E-mail enviado com sucesso: ' + info.response);
                            }
                        });
                        res.redirect("/empresas");
                    }
                })

            } else {

                Empresa.find().then((empresas) => {
                    erros.push({ mensagem: "Chave de funcionario incorreta" });
                    res.render("addfuncionario", { empresas: empresas, erros: erros })
                })
            }
        });
    })
});

input.post("/avaliar", (req, res) => {
    let erros = [];
    Funcionario.findOne({ cpf: req.body.cpf }).then(async (funcionario) => {
        if (funcionario) {
            if (!funcionario.enviado) {

                const pergunta1 = parseFloat(req.body.pergunta1);
                const pergunta2 = parseFloat(req.body.pergunta2);
                const pergunta3 = parseFloat(req.body.pergunta3);
                const pergunta4 = parseFloat(req.body.pergunta4);
                const pergunta5 = parseFloat(req.body.pergunta5);
                const pergunta6 = parseFloat(req.body.pergunta6);
                const pergunta7 = parseFloat(req.body.pergunta7);
                const pergunta8 = parseFloat(req.body.pergunta8);


                const totalPontuacao = pergunta1 + pergunta2 + pergunta3 + pergunta4 + pergunta5 + pergunta6 + pergunta7 + pergunta8;

                const media = totalPontuacao / 8;

                const novaAvalicao = new Avaliacao({
                    empresa: funcionario.empresa,
                    pergunta1: req.body.pergunta1,
                    pergunta2: req.body.pergunta2,
                    pergunta3: req.body.pergunta3,
                    pergunta4: req.body.pergunta4,
                    pergunta5: req.body.pergunta5,
                    pergunta6: req.body.pergunta6,
                    pergunta7: req.body.pergunta7,
                    pergunta8: req.body.pergunta8,
                    pontuacao: media
                })

                await novaAvalicao.save();
                funcionario.enviado = true;
                await funcionario.save();
                res.redirect("/empresas");
            } else {
                erros.push({ mensagem: "Resposta já registrada" });
                res.render("avaliar", { erros: erros })
            }
        }
        else {
            erros.push({ mensagem: "Funcionário não encontrado" });
            res.render("avaliar", { erros: erros })
        }
    })
});

async function enviar_media(_id) {
    Avaliacao.find({ empresa: _id }).then(async (avaliacao) => {

        let media = calcular_media(avaliacao)

        const novaMedia = new Media({
            valor: media,
            empresa: _id
        });

        await novaMedia.save()
            .then(async () => {
                Empresa.findOne({ _id: novaMedia.empresa }).then((empresa) => {
                    if (empresa) {
                        empresa.media = `Média de ${novaMedia.valor} pontos de qualidade`;
                        return empresa.save();
                    }
                })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send("Internal Server Error");
                    });
            });
    });
}

let gerente = false;

input.get("/funcionarios/:_id", (req, res) => {
    Funcionario.find({ empresa: req.params._id }).then((funcionarios) => {
        res.render("funcionarios", { funcionarios: funcionarios, gerente: gerente })
    })
    gerente = false
});

input.post("/funcionarios/:_id", (req, res) => {
    let erros = [];
    Empresa.findOne({ _id: req.params._id }).then((empresa) => {
        bcrypt.compare(req.body.chaveg, empresa.chaveg, (erro, batem) => {
            if (erro) {
                return done(erro);
            }

            if (batem) {
                gerente = true;
                Funcionario.find({ empresa: req.params._id }).then((funcionarios) => {
                    res.render("funcionarios", { funcionarios: funcionarios, gerente: gerente })
                })
            } else {
                erros.push({ menssagem: "Chave de gerente incorreta" })
                Funcionario.find({ empresa: req.params._id }).then((funcionarios) => {
                    res.render("funcionarios", { funcionarios: funcionarios, gerente: gerente, erros: erros })
                })
            }
        });
    })
});

export default input;