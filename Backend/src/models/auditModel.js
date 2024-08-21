import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const auditSchema = new Schema({
    eventType: {
        type: String,
        required: true
    },
    documentId: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'documentCollection'
    },
    documentCollection: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    changes: {
        type: Map,
        of: Schema.Types.Mixed,
        required: false
    }
});

auditSchema.index({ timestamp: 1 });

const Audit = mongoose.model('Audit', auditSchema);

export default Audit;