import React, { useEffect,useRef, useState } from 'react';
import PubSub from 'pubsub-js';
import searchUrlId from '../../../utils/searchUrlId'
import { useHistory, useLocation } from 'react-router-dom';
import './index.scss'
import { useDispatch } from 'react-redux';
export default function Search(props) {
    const history = useHistory()
    const location = useLocation()
    const ipt = useRef()
    const dispatch = useDispatch()
    
    const cancel = ()=>{
        history.replace('/homepage')
    }
    const reviseIptValue = ()=>{
        let data = location.pathname.substring(searchUrlId(location.pathname,'/',1)+1)
        console.log(data)
        let historyArr = []
        if(localStorage.getItem('history')){
            historyArr = [data,...JSON.parse(localStorage.getItem('history'))]
        }
        else{
            historyArr = [data]
        }
        const uniqueHistoryArr = new Set(historyArr)
        localStorage.setItem('history',JSON.stringify([...uniqueHistoryArr]))
        console.log([...uniqueHistoryArr])
        ipt.current.value = data
    }
    const goSearch = (event)=>{
        if(event.key==='Enter'){
            history.push(`/search-result/${ipt.current.value}`)
            if(localStorage.getItem('history')){
                const historyArr = [ipt.current.value,...JSON.parse(localStorage.getItem('history'))]
                // 数组去重
                const uniqueHistoryArr = new Set(historyArr)
                localStorage.setItem('history',JSON.stringify([...uniqueHistoryArr]))
            }
            else{
                const historyArr = []
                historyArr.push(ipt.current.value)
                console.log(historyArr)
                localStorage.setItem('history',JSON.stringify(historyArr))
            }
            // localStorage.removeItem('history')
        }
    }
    // 只有结果页面才存数据到localstorage
    useEffect(()=>{
        if(location.pathname.indexOf('/search-result')!==-1){
            reviseIptValue()
        }
    },[location.pathname])
    return (
        <div className="Search-container">
            <div className="search-outer">
                <div className="search-header">
                    <div className="search-header-left">
                        <div className="search-btn">
                            <img src="https://s4.ax1x.com/2022/02/02/HAWVAA.png" alt="err" className='search-icon'/>
                        </div>
                        <input type="text" onKeyUp={goSearch} ref={ipt}/>
                    </div>
                    <div className="search-header-right" onClick={cancel}>
                        <span>取消</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
