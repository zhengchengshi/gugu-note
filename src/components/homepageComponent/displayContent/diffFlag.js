import {createSlice } from '@reduxjs/toolkit'

export const diffFlagSlice = createSlice({
    name:'diffFlag',
    initialState:{
        value:false
    },
    reducers:{
        storageDiffFlag:(state,action)=>{
            // state.value+=action.payload
            state.value = action.payload
        }
    }
})
export const {storageDiffFlag} = diffFlagSlice.actions

// export const selectCount = state => {console.log(state.value)}
export const selectDiffFlag = state => state.diffFlag.value
export default diffFlagSlice.reducer