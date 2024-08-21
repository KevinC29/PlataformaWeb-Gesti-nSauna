import mongoose from 'mongoose';
import Audit from '../../models/auditModel.js';

export const saveAuditEntry = async ({ eventType, documentId, documentCollection, userId, changes }) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const auditEntry = new Audit({
            eventType,
            documentId,
            documentCollection,
            userId,
            changes,
            timestamp: new Date()
        });

        await auditEntry.save({ session });

        await session.commitTransaction();
        session.endSession();

        return auditEntry;
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al crear el registro de auditoría");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

export const generateChanges = (oldValues, newValues, isCreate = false, isDelete = false) => {
    const changes = {};
  
    if (isCreate) {
      // Solo hay valores nuevos, no hay valores antiguos
      Object.keys(newValues).forEach(key => {
        changes[key] = {
          oldValue: null,
          newValue: newValues[key]
        };
      });
    } else if (isDelete) {
      // Solo hay valores antiguos, no hay valores nuevos
      Object.keys(oldValues).forEach(key => {
        changes[key] = {
          oldValue: oldValues[key],
          newValue: null
        };
      });
    } else {
      // Valores tanto antiguos como nuevos
      const allKeys = new Set([...Object.keys(oldValues), ...Object.keys(newValues)]);
  
      allKeys.forEach(key => {
        if (oldValues[key] !== newValues[key]) {
          changes[key] = {
            oldValue: oldValues[key],
            newValue: newValues[key]
          };
        }
      });
    }
  
    return changes;
  };