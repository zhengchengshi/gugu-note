import { createSlice } from "@reduxjs/toolkit";

export const recordingSlice = createSlice({
    name:'recorder',
    initialState:{
        obj:{}
    },
    reducers:{
        storageRecorder:(state,action)=>{
            state.obj = action.payload
        }
    }

})
export const {storageRecorder} = recordingSlice.actions
export const selectRecording = state => state.record.obj
export default recordingSlice.reducer