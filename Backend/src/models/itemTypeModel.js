import mongoose from 'mongoose';

const itemTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true,
    }
}, { timestamps: true });

const ItemType = mongoose.model('ItemType', itemTypeSchema);

export default ItemType;
