import mongoose from 'mongoose';
import Comment from '../models/commentModel.js';
import Client from '../models/clientModel.js';
import handleError from '../utils/helpers/handleError.js';
import { saveAuditEntry, generateChanges } from '../utils/helpers/handleAudit.js';
import { validateCommentData } from '../validators/commentValidate.js';

// Crear un nuevo Comentario
export const createComment = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const validationResult = validateCommentData(req.body);

        if (!validationResult.isValid) {
            return handleError(res, null, session, 400, validationResult.message);
        }

        const { message, client } = req.body;

        if (client && !await Client.exists({ _id: client })) {
            return handleError(res, null, session, 409, 'El cliente ingresado no existe');
        }

        const newComment = new Comment({ message, client });
        await newComment.save({ session });

        // await saveAuditEntry({
        //     eventType: 'CREATE',
        //     documentId: newComment._id,
        //     documentCollection: 'Comment',
        //     userId: req.currentUser,
        //     changes: generateChanges(null, newComment.toObject(), true)
        // });

        await session.commitTransaction();
        res.status(201).json({ data: newComment, message: "Comentario creado con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al crear el comentario");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};

// Obtener todos los Comentarios
export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate({
                path: 'client',
                select: 'user',
                populate: {
                    path: 'user',
                    select: 'name lastName'
                }
            })
            .exec();

        if (!comments.length) {
            return handleError(res, null, 404, 'No existen comentarios');
        }

        res.status(200).json({ data: comments, message: "Comentarios extraídos con éxito" });
    } catch (error) {
        handleError(res, error);
    }
};

// Actualizar el estado de un Comentario
export const updateCommentStatus = async (req, res) => {
    try {
        const validationResult = validateCommentData(req.body);

        if (!validationResult.isValid) {
            return handleError(res, null, session, 400, validationResult.message);
        }

        const { _id, isActive } = req.body;
        const comment = await Comment.findByIdAndUpdate(_id, { isActive }, { new: true }).exec();

        if (!comment) {
            return handleError(res, null, 404, 'El comentario no se encuentra registrado');
        }

        const successMessage = isActive ? "Comentario activado con éxito" : "Comentario desactivado con éxito";
        res.status(200).json({ message: successMessage, data: comment });
    } catch (error) {
        handleError(res, error);
    }
};

// Eliminar un Comentario
export const deleteComment = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { id } = req.params;
        const comment = await Comment.findById(id).exec();

        if (!comment) {
            return handleError(res, null, session, 404, "Comentario no encontrado");
        }

        await Comment.findByIdAndDelete(id, { session });

        // await saveAuditEntry({
        //     eventType: 'DELETE',
        //     documentId: id,
        //     documentCollection: 'Comment',
        //     userId: req.currentUser,
        //     changes: generateChanges(comment.toObject(), null)
        // });

        await session.commitTransaction();
        res.status(200).json({ message: "Comentario eliminado con éxito" });
    } catch (error) {
        if (session && session.inTransaction()) {
            try {
                await session.abortTransaction();
            } catch (abortError) {
                console.error('Error al abortar la transacción:', abortError);
            }
        }
        handleError(res, error, session, 500, "Error al eliminar el comentario");
    } finally {
        if (session) {
            session.endSession();
        }
    }
};
