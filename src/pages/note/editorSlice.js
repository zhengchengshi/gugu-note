import {createSlice } from '@reduxjs/toolkit'

export const editorSlice = createSlice({
    name:'editor',
    initialState:{
        obj:{}
    },
    reducers:{
        storageEditor:(state,action)=>{
            console.log(action)
            // state.value+=action.payload
            state.obj = action.payload
        }
    }
})
export const {storageEditor} = editorSlice.actions

// export const selectCount = state => {console.log(state.value)}
export const selectEditor = state => state.editor.obj
export default editorSlice.reducer
