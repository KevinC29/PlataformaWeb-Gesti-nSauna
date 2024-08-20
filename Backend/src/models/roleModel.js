import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);

export default Role;
