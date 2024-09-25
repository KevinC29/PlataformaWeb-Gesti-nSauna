import {
    createComment,
    getComments,
    updateCommentStatus,
    deleteComment,
} from '@/api/services/commentService';
import { getClientByAuthenticatedUser } from '@/api/services/clientService';
import { handleError } from '@/middleware/errorHandler';
import { handleSuccess } from '@/middleware/successHandler';

export default {
    namespaced: true,
    state: {
        comments: [],
        comment: null,
        error: '',
        success: '',
        client: null,
    },
    mutations: {
        SET_COMMENTS(state, comments) {
            state.comments = comments;
        },
        SET_COMMENT(state, comment) {
            state.comment = comment;
        },
        ADD_COMMENT(state, comment) {
            state.comments.push(comment);
        },
        UPDATE_COMMENT(state, updatedComment) {
            const index = state.comments.findIndex(comment => comment._id === updatedComment._id);
            if (index !== -1) {
                state.comments.splice(index, 1, updatedComment);
            }
        },
        DELETE_COMMENT(state, commentId) {
            state.comments = state.comments.filter(comment => comment._id !== commentId);
        },
        SET_CLIENT(state, client) {
            state.client = client;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_SUCCESS(state, success) {
            state.success = success;
        }
    },
    actions: {
        async fetchComments({ commit }) {
            try {
                const response = await getComments();
                commit('SET_COMMENTS', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async createComment({ commit }, commentData) {
            try {
                const response = await createComment(commentData);
                commit('ADD_COMMENT', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async updateCommentStatus({ commit }, statusData) {
            try {
                const response = await updateCommentStatus(statusData);
                commit('UPDATE_COMMENT', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async deleteComment({ commit }, id) {
            try {
                const response = await deleteComment(id);
                commit('DELETE_COMMENT', id);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async fetchAndSetClient({ commit }) {
            try { 
                const response = await getClientByAuthenticatedUser();
                commit('SET_CLIENT', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
    },
    getters: {
        comments: state => state.comments,
        comment: state => state.comment,
        error: state => state.error,
        success: state => state.success,
        client: state => state.client,
    }
};
