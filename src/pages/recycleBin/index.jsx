import React from 'react'
import './index.scss'
import DisplayContent from '../../components/homepageComponent/displayContent'
import { storageNoteList } from '../../components/homepageComponent/displayContent/noteListSlice'
import { storageDiffFlag } from '../../components/homepageComponent/displayContent/diffFlag'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import GlobalMask from '../../components/homepageComponent/globalMask'
import PubSub from 'pubsub-js'
import api from '../../service/api'
export default function RecycleBin() {
    const history = useHistory()
    const dispatch = useDispatch()
    const goBack = ()=>{
        history.goBack()
    }
    const clearAll = ()=>{
        api.post('/v1/note/recycle/clean-all')
            .then(res=>{
                console.log(res)
                PubSub.publish('cleanAll',{flag:true})
            })
    }
    // 清除所有笔记的阀门
    useEffect(()=>{
        dispatch(storageDiffFlag(true))
    },[])
    return (
        <div>
            <GlobalMask></GlobalMask>
            <div className="recyclebin-outer">
                <div className="recyclebin">
                    <div className="recyclebin-header">
                        <img src="https://s4.ax1x.com/2022/02/18/HoO97q.png" alt="err" className='recyclebin-header-back-img' onClick={goBack}/>
                        <span>回收站</span>
                        <span onClick={clearAll}>全部清除</span>
                    </div>
                    <DisplayContent ></DisplayContent>
                </div>
            </div>
        </div>
    )
}
