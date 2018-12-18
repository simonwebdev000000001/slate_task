import * as mongoose from 'mongoose';

export const Orderschema = new mongoose.Schema({
    name: String,
    state: {
        type:String,
        default:'created'
    },
});