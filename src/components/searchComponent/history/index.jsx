import React, { useEffect, useState } from 'react';
import PubSub, { subscribe } from 'pubsub-js';
import './index.scss'
import { useHistory } from 'react-router-dom';
export default function History() {
    const [historyItem,setHistoryItem] = useState()
    const [controlHistoryPresent,setControlHistoryPresent] = useState("search-history-content")
    const [controlPresent,setControlPresent] = useState('search-history-container')
    const history = useHistory()
    const clearHistory = ()=>{
        setControlHistoryPresent('hidden')
        localStorage.removeItem('history')
    }
    const goSearch = (item)=>{
        return(()=>{
            history.push(`/search-result/${item}`)
        })
    }
    // 组件挂载时获取历史记录
    useEffect(()=>{
        if(localStorage.getItem('history')!==null){
            setHistoryItem(JSON.parse(localStorage.getItem('history')))
        }
    },[])
    // 接到搜索消息后隐藏历史记录
    // useEffect(()=>{
    //     PubSub.subscribe('goSearch',(msg,data)=>{
    //         if(data){
    //             setControlPresent('hidden')
    //         }
    //     })
    //     return(()=>{
    //         PubSub.unsubscribe('goSearch')
    //     })
    // },[])
    return (
    <div>
        <div className={controlPresent}>
            <div className="search-history-outer">
                <div className="search-history-header">
                    <span>历史搜索</span>
                    <div className="search-history-header-btn" onClick={clearHistory}>
                        <img src="https://s4.ax1x.com/2022/02/02/HAhySx.png" alt="err"/>
                    </div>
                </div>
                <div className={controlHistoryPresent}>
                    {
                        localStorage.getItem('history')!==null&&historyItem!==undefined?
                        historyItem.map((item,index)=>{
                            return(
                                <span className="search-history-item" key={index} onClick={goSearch(item)}>
                                    <span>{item}</span>
                                </span>
                            )
                        }):
                        <></>
                    }
                </div>
            </div>
        </div>
    </div>
    );
}
