import mongoose, { Schema } from "mongoose";

const funcionarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cpf: {
        type: Number,
        required: true
    },
    telefone: {
        type: Number,
        required: true
    },
    sexo: {
        type: String,
        required: true
    },
    empresa: {
        type: Schema.ObjectId,
        required: true
    },
    salario: {
        type: Number,
        required: true
    },
    enviado: {
        type: Boolean,
        default: false
    },
    cargo:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Funcionario = mongoose.model('Funcionario', funcionarioSchema);

export default  Funcionario;