import {createSlice } from '@reduxjs/toolkit'

export const tagListSlice = createSlice({
    name:'tagList',
    initialState:{
        obj:{}
    },
    reducers:{
        storageTagList:(state,action)=>{
            // state.value+=action.payload
            state.obj = action.payload
        }
    }
})
export const {storageTagList} = tagListSlice.actions

// export const selectCount = state => {console.log(state.value)}
export const selectTagList = state => state.tagList.obj
export default tagListSlice.reducer