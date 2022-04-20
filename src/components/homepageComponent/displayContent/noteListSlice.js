import {createSlice } from '@reduxjs/toolkit'

export const noteListSlice = createSlice({
    name:'noteList',
    initialState:{
        obj:{}
    },
    reducers:{
        storageNoteList:(state,action)=>{
            // state.value+=action.payload
            state.obj = action.payload
        },
        setCollectState:(state,action)=>{
            // state.value+=action.payload
            state.obj[action.payload].isCollect = 1
            // state.obj = action.payload
        },
        cancelCollectState:(state,action)=>{
            // state.value+=action.payload
            state.obj[action.payload].isCollect = 0
            // state.obj = action.payload
        }
    }
})
export const {storageNoteList,setCollectState,cancelCollectState} = noteListSlice.actions

// export const selectCount = state => {console.log(state.value)}
export const selectNoteList = state => state.noteList.obj
export default noteListSlice.reducer