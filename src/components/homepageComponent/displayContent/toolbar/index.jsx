import React from 'react';
import { useState } from 'react';
import './index.scss'
import PubSub from 'pubsub-js';
import { useEffect } from 'react';
import api from '../../../../service/api';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import {selectPresentNote,storagePresentNote} from '../presentNoteSlice'
import {selectGlobalMask,storageGlobalMask} from '../../globalMask/globalMaskSlice'
import { storageTagList } from '../tagListSlice';
import { useRef } from 'react';
export default function NoteItemMask(props) {
    const [controlPresent,setControlPresent] = useState('homepage-noteItem-setting-outer')
    const [noteIdStorageCache,setNoteIdStorageCache] = useState(null)
    const history = useHistory();
    const dispatch = useDispatch()
    const [flagValve,setFlagValve] = useState(0)
    const [changeToolbarPosition,setChangeToolbarPosition] = useState({top:'25px'})
    const toolbarNode = useRef()
    const presentNote = useSelector(selectPresentNote)
    const location = useLocation()
    const flag = useSelector(selectGlobalMask)
    // 删除笔记
    const deleteNote = (event)=>{
        event.stopPropagation()
        console.log(789)
        // 传递信息给删除框
        if(location.pathname!=='/recyclebin'){
            PubSub.publish('arouseGlobalMask-deleteNote',{flag:true,id:noteIdStorageCache})
            setControlPresent('hidden')
            // 清除工具栏节点
            PubSub.publish('hideNode',{flag:true})
        }
    }
    // 添加标签
    useEffect(()=>{
        const height = toolbarNode.current.getBoundingClientRect().height
        const top = toolbarNode.current.getBoundingClientRect().top
        const screenHeight = window.screen.height
        console.log(top)
        if(screenHeight-top-height<80){
            setChangeToolbarPosition({bottom:'55px'})
        }
        else{
            setChangeToolbarPosition({top:'20px'})
        }
        console.log(toolbarNode.current.getBoundingClientRect())
    },[props])
    const addTag = (event)=>{
        event.stopPropagation()

        history.push(`/add-tag/${noteIdStorageCache}`)
    }
    const share = (event)=>{
        event.stopPropagation()
    }
    useEffect(()=>{
        // if(props.index>3){
        //     setChangeToolbarPosition({bottom:'55px'})
        // }
        // console.log(props)
    },[props.index])
    // 恢复
    const recover = (event)=>{
        event.stopPropagation()
        PubSub.publish('arouseGlobalMask-deleteNote',{flag:true,id:noteIdStorageCache,checkState:'recover'})
        PubSub.publish('hideNode',{flag:true})

        setControlPresent('hidden')
    }
    // 永久删除
    const deleteNoteForever = (event)=>{
        event.stopPropagation()
        PubSub.publish('arouseGlobalMask-deleteNote',{flag:true,id:noteIdStorageCache,checkState:'delete-forever'})
        PubSub.publish('hideNode',{flag:true})

        setControlPresent('hidden')
    }
    // 笔记置顶
    const toTop = (event)=>{
        // 设置置顶标签
        event.stopPropagation()

        api.post('/v1/tag/list')
        .then(res=>{
                return res.data.tags
            })
            .then(res=>{
                console.log(presentNote)
                const tags = [...presentNote.tags]
                    if(presentNote.isTop===1){
                        // 切记 reducer是纯函数，是不可变的，不能拿store中的值直接修改，会报错
                        dispatch(storagePresentNote(tags.splice(tags.indexOf('置顶'),1)))
                    }
                    else{
                        tags.unshift('置顶')
                        dispatch(storagePresentNote(tags))
                    }
                    const reverseArr = []
                    res.map(item=>{
                        if(tags.includes(item.tagName)){
                            if(item.tagName==='置顶'){
                                reverseArr.unshift(item.tagId)
                            }
                            else{
                                reverseArr.push(item.tagId);
                            }
                        }
                    })
                    return reverseArr
                })
                .then(res=>{
                        let tagsIdList = res;
                        console.log(tagsIdList)

                        // 发送置顶请求
                        if(presentNote.isTop===1){
                            api.post('/v1/note/top',{noteId:presentNote.id,isTop:0})
                                .then(res=>{
                                        PubSub.publish('toTop',{flag:true})
                                        console.log(res)
                                        
                                    })
                                    .then(res=>{
                                        api.post('/v1/note/add-tag',{
                                            noteId:presentNote.id,
                                            tags:[...tagsIdList]
                                        })
                                        .then(res=>{
                                            console.log(res)
                                        })
                                    })
                            // 取消全局遮罩
                            dispatch(storageGlobalMask(false))
                            // PubSub.publish('arouseGlobalMask-noteItemSetting',{flag:false})
                            PubSub.publish('hideNode',{flag:true})

                            setControlPresent('hidden')
                            // 修改全局笔记isTop样式
                            // dispatch(storagePresentNote())
                        }
                        else{
                            // 发送置顶请求
                            api.post('/v1/note/top',{noteId:presentNote.id,isTop:1})
                            .then(res=>{
                                    PubSub.publish('toTop',{flag:true})
                                    console.log(res)
                                })
                                .then(res=>{
                                    // 添加标签
                                    api.post('/v1/note/add-tag',{
                                            noteId:presentNote.id,
                                            tags:[...tagsIdList]
                                        })
                                        .then(res=>{
                                            console.log(res)
                                        })
                                })
                            // 取消全局遮罩
                            dispatch(storageGlobalMask(false))
                            // PubSub.publish('arouseGlobalMask-noteItemSetting',{flag:false})
                            PubSub.publish('hideNode',{flag:true})

                            setControlPresent('hidden')
                        }
                    })
        
    }
    useEffect(()=>{
        // 接收displayContent发过来的消息
        if(flagValve===0){
            console.log(flag)
            setFlagValve(1)
            PubSub.subscribe('arouseGlobalMask-noteItemSetting',(msg,data)=>{
                console.log(data.id)
                setNoteIdStorageCache(data.id)
            })
        }
        // 状态同遮罩
        if(flag){
            setControlPresent('homepage-noteItem-setting-outer')
        }
        if(!flag){
            setControlPresent('hidden')
        }
        return(()=>{
            PubSub.unsubscribe('arouseGlobalMask-noteItemSetting')
        })
    },[flag])
    // useEffect(()=>{

    //     console.log(presentNote)
    // },[presentNote])
    // useEffect(()=>{
    //     PubSub.subscribe('arouseGlobalMask-deleteNote',(msg,data)=>{
    //         if(data.flag){
    //             setControlPresent('global-mask')
    //         }
    //     })
    //     return(()=>{
    //         PubSub.unsubscribe('arouseGlobalMask-deleteNote')
    //     })
    // },[])
    return (
    <div>
        <div className={controlPresent} style={changeToolbarPosition} ref={toolbarNode}>
            {
                location.pathname!=='/recyclebin'?
                <div>
                    <div className='homepage-noteItem-setting-item' onClick={toTop}>
                        {
                            presentNote.isTop?<span>取消置顶</span>:<span>置顶</span>
                        }
                        
                    </div>
                    <div className='homepage-noteItem-setting-item' onClick={addTag}>
                        <span>添加标签</span>
                    </div>
                    <div className='homepage-noteItem-setting-item' onClick={deleteNote}>
                        <span>删除</span>
                    </div>
                    <div className='homepage-noteItem-setting-item' onClick={share}>
                        <span>分享</span>
                    </div>
                </div>
                :
                <div>
                    <div className='homepage-noteItem-setting-item' onClick={recover} style={{color:'rgba(0, 122, 255, 100)'}}>
                        <span>恢复</span>
                    </div>
                    <div className='homepage-noteItem-setting-item' onClick={deleteNoteForever} style={{color:'rgba(255, 58, 48, 100)'}}>
                        <span>永久删除</span>
                    </div>
                </div>
            }
            
        </div>
    </div>
    );
}
