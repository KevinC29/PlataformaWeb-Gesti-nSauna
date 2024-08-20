import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    account: {
        type: Number,
        required: true,
        default: 0.00,
    },
    accountState: {
        type: String,
        required: true,
        enum: ['paid', 'pending'],
        default: 'paid',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);

export default Client;
