import {createSlice } from '@reduxjs/toolkit'

export const globalMaskSlice = createSlice({
    name:'globalMask',
    initialState:{
        obj:false
    },
    reducers:{
        storageGlobalMask:(state,action)=>{
            console.log(action.payload)
            // state.value+=action.payload
            state.obj = action.payload
        }
    }
})
export const {storageGlobalMask} = globalMaskSlice.actions

// export const selectCount = state => {console.log(state.value)}
export const selectGlobalMask = state => state.globalMask.obj
export default globalMaskSlice.reducer