import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../axios/globalInstance";

const getPatients = createAsyncThunk(
    'patients/getPatients',
    async (arg , {rejectWithValue}) => {
        try {
            const {data} = await instance.get('/patient')
            return data
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data)
        }
    }
)

const addPatient = createAsyncThunk(
    'patient/addPatient',
    async (patient, { rejectWithValue }) => {
      try {
        const { data } = await instance.post("/patient", patient);
        return data;
      } catch (error) {
        console.log(error);
        return rejectWithValue(error.response.data);
      }
    }
  );

const deletePatients = createAsyncThunk(
    'patient/deletePatient',
    async(id , {rejectWithValue}) => {
        try {
            const {data} = await instance.delete(`/patient/${id}`)
            return data
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data)
        }
    }
)
  

const updatePatients = createAsyncThunk(
    'patient/updatePatient',
    async(patient , {rejectWithValue}) => {
        try {
            const {data} = await instance.put(`/patient/${patient._id}` , patient)
            return data
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data)
        }
    }
)

export {getPatients , addPatient , deletePatients , updatePatients }