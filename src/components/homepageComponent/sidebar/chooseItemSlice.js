import {createSlice } from '@reduxjs/toolkit'

export const chooseItemSlice = createSlice({
    name:'chooseItem',
    initialState:{
        obj:{}
    },
    reducers:{
        storageChooseItem:(state,action)=>{
            console.log(action.payload)
            // state.value+=action.payload
            state.obj = action.payload
        }
    }
})
export const {storageChooseItem} = chooseItemSlice.actions

// export const selectCount = state => {console.log(state.value)}
export const selectChooseItem = state => state.chooseItem.obj
export default chooseItemSlice.reducer