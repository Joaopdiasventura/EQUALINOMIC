import mongoose, { Schema } from "mongoose";

const empresaSchema = new mongoose.Schema({

  nome: {
    type: String,
    required: true
  },
  cnpj: {
    type: Number,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  telefone: {
    type: Number,
    required: true
  },
  endereco: {
    type: String,
    required: true
  },
  servico: {
    type: String,
    required: true
  },
  chaveg: {
    type: String,
    required: true
  },
  chavef: {
    type: String,
    required: true
  },
  media:{
    type: String,
    default: "Nenhuma média registrada ainda..."
  },
  verificado:{
    type: Boolean,
    default: false
  },
  Date: {
    type: Date,
    default: Date.now
  }
});

const Empresa = mongoose.model('Empresa', empresaSchema);

export default  Empresa;