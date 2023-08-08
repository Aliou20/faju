import { createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../axios/globalInstance";


const sendSms = createAsyncThunk(
    'sms/send',
    async (sms , {rejectWithValue}) => {
        try {
            const {data} = await instance.post('/sms' , sms)
            return data
        } catch (error) {
            rejectWithValue(error.response.data)
        }
    }
)