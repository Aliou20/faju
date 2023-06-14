import { createSlice } from "@reduxjs/toolkit";
import { addRendezvous, getRendezvous, updateRendezvous, deleteRendezvous} from "../services/rendezvousService";

const initialState = {
    data : [],
    loading : true,
    isSuccess : false,
    message : "",
    getRendezvousStatus : "",
    addRendezvousStatus : "",
    updateRendezvousStatus : "",
    deleteRendezvousStatus : ""
}

const rendezvousSlice = createSlice({
    name : "rendezvous",
    initialState,
    extraReducers : {
        [getRendezvous.pending] : (state) => {
            return {
                ...state,
                loading : true,
                getRendezvousStatus : "pending",
                addRendezvousStatus : "",
                updateRendezvousStatus : "",
                deleteRendezvousStatus : ""
            }
        },

        [getRendezvous.fulfilled] : (state , {payload}) => {
            return {
                ...state,
                loading : false,
                isSuccess : true,
                data : payload.data,
                getRendezvousStatus : "success",
                addRendezvousStatus : "",
                updateRendezvousStatus : "",
                deleteRendezvousStatus : ""
            }
        },

        [getRendezvous.rejected] : (state , {payload}) => {
            return {
                ...state,
                loading : false,
                isSuccess : false,
                message : payload,
                getRendezvousStatus : "rejected",
                addRendezvousStatus : "",
                updateRendezvousStatus : "",
                deleteRendezvousStatus : ""
            }
        },
        [addRendezvous.pending] : (state) => {
            return {
                ...state,
                loading : true,
                getRendezvousStatus : "",
                addRendezvousStatus : "pending",
                updateRendezvousStatus : "",
                deleteRendezvousStatus : ""
            }
        },

        [addRendezvous.fulfilled] : (state , {payload}) => {
            return {
                ...state,
                loading : false,
                isSuccess : true,
                data : [...state.data , payload.data ],
                getRendezvousStatus : "",
                addRendezvousStatus : "success",
                updateRendezvousStatus : "",
                deleteRendezvousStatus : ""
               
            }
        },

        [addRendezvous.rejected] : (state , {payload}) => {
            return {
                ...state,
                loading : false,
                isSuccess : false,
                message : payload,
                getRendezvousStatus : "",
                addRendezvousStatus : "rejected",
                updateRendezvousStatus : "",
                deleteRendezvousStatus : ""
            }
        },
        [deleteRendezvous.pending] : (state) => {
            return {
                ...state,
                loading : true,
                getRendezvousStatus : "",
                addRendezvousStatus : "",
                updateRendezvousStatus : "",
                deleteRendezvousStatus : "pending"
            }
        },

        [deleteRendezvous.fulfilled] : (state , {payload}) => {
            const deleteItem = state.data.filter((rendezvous) => rendezvous._id !== payload.data._id)
            return {
                ...state,
                loading : false,
                isSuccess : true,
                data : deleteItem,
                getRendezvousStatus : "",
                addRendezvousStatus : "",
                updateRendezvousStatus : "",
                deleteRendezvousStatus : "success"
                
            }
        },

        [deleteRendezvous.rejected] : (state , {payload}) => {
            return {
                ...state,
                loading : false,
                isSuccess : false,
                message : payload,
                getRendezvousStatus : "",
                addRendezvousStatus : "",
                updateRendezvousStatus : "",
                deleteRendezvousStatus : "rejected"
            }
        },
        [updateRendezvous.pending] : (state) => {
            return {
                ...state,
                loading : true,
                getRendezvousStatus : "",
                addRendezvousStatus : "",
                updateRendezvousStatus : "",
                deleteRendezvousStatus : "pending"
                
            }
        },

        [updateRendezvous.fulfilled] : (state , {payload}) => {
            const updateItem = state.data.map((rendezvous) => rendezvous._id === payload.data._id ? payload.data : rendezvous)
            return {
                ...state,
                loading : false,
                isSuccess : true,
                data : updateItem,
                getRendezvousStatus : "",
                addRendezvousStatus : "",
                updateRendezvousStatus : "success",
                deleteRendezvousStatus : ""
            }
        },

        [updateRendezvous.rejected] : (state , {payload}) => {
            return {
                ...state,
                loading : false,
                isSuccess : false,
                message : payload,
                getRendezvousStatus : "",
                addRendezvousStatus : "",
                updateRendezvousStatus : "rejected",
                deleteRendezvousStatus : "",
            }
            }
        }
    },
)

export default rendezvousSlice.reducer