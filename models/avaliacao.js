import mongoose, { Schema } from "mongoose";

const avaliacaoSchema = new mongoose.Schema({
    empresa:{
        type: Schema.ObjectId,
        required: true
    },
    pergunta1:{
        type: Number,
        required: true
    },
    pergunta2:{
        type: Number,
        required: true
    },
    pergunta3:{
        type: Number,
        required: true
    },
    pergunta4:{
        type: Number,
        required: true
    },
    pergunta5:{
        type: Number,
        required: true
    },
    pergunta6:{
        type: Number,
        required: true
    },
    pergunta7:{
        type: Number,
        required: true
    },
    pergunta8:{
        type: Number,
        required: true
    },
    pontuacao:{
        type: Number,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const Avaliacao = mongoose.model('Avaliacao', avaliacaoSchema);

export default  Avaliacao;