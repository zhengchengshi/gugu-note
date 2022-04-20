import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PubSub from 'pubsub-js';
import Mask from './mask'
import './index.scss'
import api from '../../service/api';
import searchUrlId from '../../utils/searchUrlId'
import { useDispatch, useSelector } from 'react-redux';
import {selectPresentNote} from '../../components/homepageComponent/displayContent/presentNoteSlice'
import { storageGlobalMask } from '../../components/homepageComponent/globalMask/globalMaskSlice';
export default function AddTag() {
    const location = useLocation()
    const history = useHistory();
    const dispatch = useDispatch()
    const [tags,setTags] = useState([]);
    const [checkState,setCheckState] = useState([])
    const [presentNote,setPresentNote] = useState({})
    const noteId = location.pathname.substring(searchUrlId(location.pathname,'/',1)+1)
    useEffect(()=>{
        const data = {
            key: "",
            tagId: "0",
            source: "",
            index: 0,
            offset: 100,
            updateMs:0
        }
        // 使用字符串查找函数取到url中的id
        
        // 获取所有笔记，通过路由传过来的id取到对应笔记项
        api.post('/v1/note/list',data)
            .then(res=>{
                    return res.data.notes
                })
                .then(res=>{
                        res.map(item=>{
                            if(item.id===noteId){
                                console.log(item)
                                setPresentNote(item)
                            }
                        })
                    })
                    .catch(err=>{
                        throw err
                    })
    },[])    
    
    useEffect(()=>{
        PubSub.subscribe('newTag',(msg,data)=>{
            // 标签列表种添加新标签
            api.post('/v1/tag/add',{
                    tagName:data.newTag
                })
                .then(res=>{
                    console.log(res)
                    // 重新请求，强制更新视图层
                    api.post('/v1/tag/list')
                        .then(res=>{
                                setTags(res.data.tags)
                                return res.data.tags
                            })
                            .then(res=>{
                                    const initStateArr = []
                                    for(let i =0;i<res.length;i++){
                                        if(presentNote.tags!==undefined){
                                            initStateArr.push(presentNote.tags.includes(res[i].tagId))
                                        }
                                    }
                                    setCheckState(initStateArr)
                                })
                })
        })
        return(()=>{
            PubSub.unsubscribe('newTag')
        })
    },[presentNote])
    const back = ()=>{
        history.goBack();
        dispatch(storageGlobalMask(false))
    }
    // 唤起添加标签框
    const addTag = ()=>{
        PubSub.publish('arouse-addTag-mask',{flag:true})
    }
    // 点击圆圈修改选中状态
    const checkStateFn = (index)=>{
        return(()=>{
            // 状态取反
            checkState[index] = !checkState[index]
            // 码一下,由于地址没变,所以视图层不更新,要用扩展数组实现地址改变才能更新视图
            setCheckState([...checkState])
        })
    }
    // 确认按钮事件
    const confirm = ()=>{
        const checkTagArr= []
        // 筛选选中的tag的id用于发送请求
        tags.map((item,index)=>{
            if(checkState[index]){
                checkTagArr.push(item.tagId)
            }
        })
        // 如果有置顶标签，发送置顶请求，没有则取消
        let judgeTagsFlag = false
        api.post('/v1/tag/list')
            .then(res=>{
                // 判断是否有置顶
                res.data.tags.map(item=>{
                    // 判断是否有对应tag
                    if(checkTagArr.includes(item.tagId)){
                        if(item.tagName==='置顶'){
                            judgeTagsFlag = true
                        }
                    }
                })
                if(judgeTagsFlag){
                    api.post('/v1/note/top',{
                            isTop:1,
                            noteId:presentNote.id
                        })
                        .then(res=>{
                            console.log(res)
                        })
                }
                else{
                    api.post('/v1/note/top',{
                                isTop:0,
                                noteId:presentNote.id
                            })
                            .then(res=>{
                                console.log(res)
                            })
                }
            })
        
        // 更新该笔记标签
        api.post('/v1/note/add-tag',{
                tags:checkTagArr,
                noteId
            })
            .then(res=>{
                console.log(res)
                dispatch(storageGlobalMask(false))
                history.goBack();
            })
    }
    // 获取tags列表
    useEffect(()=>{
        api.post('/v1/tag/list')
            .then(res=>{
                    setTags(res.data.tags)

                    return res.data.tags
                })
                .then(res=>{
                        const initStateArr = []
                        for(let i =0;i<res.length;i++){
                            if(presentNote.tags!==undefined){
                                initStateArr.push(presentNote.tags.includes(res[i].tagId))
                            }
                        }
                        setCheckState(initStateArr)
                    })
    },[presentNote])
    
    return (
    <div>
        <Mask></Mask>
        <div className="addTag-outer">
            <div className="addTag">
                <div className="addTag-header">
                    <div className="addTag-header-back-btn" onClick={back}>
                        <img src="https://s4.ax1x.com/2022/01/29/HSxSoQ.png" alt="err" className="addTag-header-back-img"/>
                    </div>
                    <div className="addTag-header-title">
                        添加标签
                    </div>
                    <div className="addTag-header-addNewTag-btn" onClick={addTag}>
                        <img src="https://s4.ax1x.com/2022/01/29/HSxUFH.png" alt="err"  className="addTag-header-addNewTag-img"/>
                    </div>
                </div>
                <div className="addTag-body-outer">
                    <div className="addTag-body">
                        {   
                            tags?
                            tags.map((item,index)=>{
                                return(
                                    <div className="addTag-body-tag-item-outer" key={index}>
                                        <div className="addTag-body-tag-item">
                                            <div className="addTag-body-tag-item-left">
                                                <img src="https://s4.ax1x.com/2022/01/29/HpSlqK.png" alt="err" className="addTag-body-tag-item-img"/>
                                                <span>{item.tagName}</span>
                                            </div>
                                            <div className="addTag-body-tag-item-choose-btn" onClick={checkStateFn(index)}>
                                                {/* 对应勾选状态数组 */}
                                                {/* 这个方法还不错，修改两种状态对应样式可以这样做 */}
                                                {
                                                    checkState[index]?
                                                    <img src="https://s4.ax1x.com/2022/01/29/HpSNRA.png" alt="err" className='addTag-body-tag-item-choose-img'/>
                                                    :
                                                    <img src="https://s4.ax1x.com/2022/01/29/HppBlR.png" alt="err" className='addTag-body-tag-item-choose-img'/>
                                                }
                                                
                                            </div>
                                        </div>
                                    </div>
                                )
                            }):
                            <></>
                        }
                        
                    </div>
                </div>
                <div className="addTag-fixed-footer">
                    <div className="addTag-confirm-btn" onClick={confirm}>
                        确定
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
