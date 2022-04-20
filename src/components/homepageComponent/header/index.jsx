import React, { useEffect } from 'react';
import './index.scss'
import PubSub from 'pubsub-js';
import Mask from './mask'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectNoteList } from '../displayContent/noteListSlice';
import {selectChooseItem} from '../sidebar/chooseItemSlice';
import { useLocation } from 'react-router-dom';
export default function HomepageHeader() {
    const [settingFlag,setSettingFlag] = useState(false)
    const [noteNum,setNoteNum] = useState()
    const [noteTitle,setNoteTitle] = useState()
    const location = useLocation()
    const goSidebar = ()=>{
        PubSub.publish('arouseSideBar',{flag:true})
    }
    const goSetting = ()=>{
        setSettingFlag(true)
    }
    const setFlagFn = ()=>{
        setSettingFlag(false)
    }
    const res = useSelector(selectNoteList)
    const info = useSelector(selectChooseItem)
    useEffect(()=>{
        setNoteNum(res.length)
    },[res])
    
    useEffect(()=>{
        console.log(info)
        console.log(noteTitle)
        if(JSON.stringify(info)!=='{}'){
            setNoteNum(info.noteNum)
            setNoteTitle(info.title)
        }
        else{
            setNoteTitle('全部笔记')
        }
    },[info])

  return (
    <div>
        <Mask settingFlag = {settingFlag} setFlagFn= {setFlagFn}></Mask>
        <div className="homepage-header-outer">
            <div className="homepage-header">
                <div className="homepage-header-left">
                        <img src="https://s4.ax1x.com/2022/01/27/7XaeUg.png" alt="err" className="homepage-leftsideBar-img" onClick={goSidebar}/>
                    <div className="homepage-header-intro">
                        <span>{noteTitle}({noteNum})</span>
                        <span>今天</span>
                    </div>
                </div>
                <div className="homepage-header-right">
                    <div className="homepage-setting-btn" onClick={goSetting}>
                        <img src="https://s4.ax1x.com/2022/01/27/7XdCoF.png" alt="err" className='homepage-setting-img'/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
