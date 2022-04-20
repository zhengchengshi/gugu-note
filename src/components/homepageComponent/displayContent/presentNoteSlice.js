import {createSlice } from '@reduxjs/toolkit'

export const presentNoteSlice = createSlice({
    name:'presentNote',
    initialState:{
        obj:{}
    },
    reducers:{
        storagePresentNote:(state,action)=>{
            // state.value+=action.payload
            state.obj = action.payload
        }
    }
})
export const {storagePresentNote} = presentNoteSlice.actions

// export const selectCount = state => {console.log(state.value)}
export const selectPresentNote = state => state.presentNote.obj
export default presentNoteSlice.reducer