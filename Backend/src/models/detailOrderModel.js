import mongoose from 'mongoose';

const detailOrderSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    cantidad: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
    }
}, { timestamps: true });

const DetailOrder = mongoose.model('DetailOrder', detailOrderSchema);

module.exports = DetailOrder;
