import React from 'react';
import './index.scss'
import PubSub from 'pubsub-js';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { storageGlobalMask,selectGlobalMask } from './globalMaskSlice'
export default function GlobalMask() {
    const [controlPresent,setControlPresent] = useState('hidden')
    const dispatch = useDispatch()
    const flag = useSelector(selectGlobalMask)
    const cancelGlobalMask = ()=>{
        console.log(flag)
        // PubSub.publish('arouseGlobalMask-noteItemSetting',{flag:false})
        PubSub.publish('cancelGlobalMask-deleteNote',{flag:false})
        dispatch(storageGlobalMask(false))
        PubSub.publish('hideNode',{flag:true})

    }
    // useEffect(()=>{
    //     // 组件挂载时重置属性
    //     dispatch(storageGlobalMask(false))
    // },[])
    useEffect(()=>{
        // PubSub.subscribe('arouseGlobalMask-noteItemSetting',(msg,data)=>{
            console.log(flag)
            if(flag){
                setControlPresent('global-mask')
            }
            if(!flag){
                setControlPresent('hidden')
            }
        // })
        return(()=>{
            PubSub.unsubscribe('arouseGlobalMask-noteItemSetting')
        })
    },[flag])
    
    return <div className={controlPresent} onClick={cancelGlobalMask}></div>;
}
