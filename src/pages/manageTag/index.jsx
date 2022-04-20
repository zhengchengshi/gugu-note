import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import PubSub from 'pubsub-js';
import Mask from '../addTag/mask'
import './index.scss'
import api from '../../service/api';
import searchUrlId from '../../utils/searchUrlId'
import { useDispatch, useSelector } from 'react-redux';
import { storageGlobalMask,selectGlobalMask } from '../../components/homepageComponent/globalMask/globalMaskSlice';
import DeleteNotice from '../../components/homepageComponent/displayContent/deleteNotice';
import GlobalMask from '../../components/homepageComponent/globalMask';
export default function AddTag() {
    const location = useLocation()
    const history = useHistory();
    const dispatch = useDispatch()
    const [tags,setTags] = useState([]);
    const [checkState,setCheckState] = useState([])
    const [presentNote,setPresentNote] = useState({})
    const [controlPresent,setControlPresent] = useState([])
    const [presentNoteId,setPresentNoteId] = useState()
    const noteId = location.pathname.substring(searchUrlId(location.pathname,'/',1)+1)
    const flag = useSelector(selectGlobalMask)
    const [deleteNoticeOuterStyle,setDeleteNoticeOuterStyle] = useState({display:'none'})
    useEffect(()=>{
        // 初始化呈现状态数组
        if(flag===false){
            const copyControlPresent = Array(tags.length).fill('hidden')
            setControlPresent([...copyControlPresent])
        }
    },[tags,flag])
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
        PubSub.subscribe('confirmDelete',(msg,data)=>{
            // 强制更新视图层
            api.post('/v1/tag/list')
                .then(res=>{
                    console.log('res')
                    console.log(res)
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
        return(()=>{
            PubSub.unsubscribe('confirmDelete')
        })
    },[])
    useEffect(()=>{
        PubSub.subscribe('newTag',(msg,data)=>{
            console.log()
            // 标签列表种添加新标签
            if(data.checkState==='rename'){
                api.post('/v1/tag/rename',{
                        newTagName:data.newTag,
                        tagId:presentNoteId
                    })
                    .then(res=>{
                        console.log(res)
                        api.post('/v1/tag/list')
                            .then(res=>{
                                    setTags(res.data.tags)
                                    dispatch(storageGlobalMask(false))
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
            }
            else{
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
            }
        })
        return(()=>{
            PubSub.unsubscribe('newTag')
        })
    },[presentNote,presentNoteId])
    // 工具栏随遮罩变化
    const back = ()=>{
        history.goBack();
        dispatch(storageGlobalMask(false))
    }
    // 唤起添加标签框
    const addTag = ()=>{
        PubSub.publish('arouse-addTag-mask',{flag:true})
    }
    // 调出工具栏
    const goMore = (id,index)=>{
        return(()=>{
            console.log(id)
            setPresentNoteId(id)
            dispatch(storageGlobalMask(true))
            controlPresent[index] = "addTag-toolbar"
            setControlPresent([...controlPresent])
        })
    }
    
    // 重命名
    const rename = (item)=>{
        return(()=>{
            console.log(item)
            // 关闭工具栏
            const copyControlPresent = Array(tags.length).fill('hidden')
            setControlPresent([...copyControlPresent])
            PubSub.publish('arouse-addTag-mask',{flag:'rename',tagName:item.tagName})
            // dispatch(storageGlobalMask(false))
        })
    }
    // 删除标签 
    const deleteTag = ()=>{
        const copyControlPresent = Array(tags.length).fill('hidden')
        setControlPresent([...copyControlPresent])
        PubSub.publish('arouseGlobalMask-deleteNote',{flag:true,id:presentNoteId,checkState:'delete'})
    }
    const changeNoticeOuterStyle = (params)=>{
        console.log(params)
        
        setDeleteNoticeOuterStyle(params)
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
        {/* 两种不同遮罩，Mask是修改标签的遮罩，GlobalMask是纯遮罩 */}
        <GlobalMask></GlobalMask>
        <div className='deleteNotice-outer' style={deleteNoticeOuterStyle}>
            <DeleteNotice changeNoticeOuterStyle={changeNoticeOuterStyle}></DeleteNotice>
        </div>
        <Mask rename="rename"></Mask>
        <div className="addTag-outer">
            <div className="addTag">
                <div className="addTag-header">
                    <div className="addTag-header-back-btn" onClick={back}>
                        <img src="https://s4.ax1x.com/2022/01/29/HSxSoQ.png" alt="err" className="addTag-header-back-img"/>
                    </div>
                    <div className="addTag-header-title">
                        标签管理
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
                                            <div className="addTag-body-tag-item-choose-btn" onClick={goMore(item.tagId,index)}>
                                                <img src="https://s4.ax1x.com/2022/02/16/HhSzT0.png" alt="err" className='addTag-body-tag-item-choose-img'/>
                                            </div>
                                            <div className={controlPresent[index]} >
                                                <div className="addTag-first-line" onClick={rename(item)}>
                                                    <span>重命名</span>
                                                </div>
                                                <div className="addTag-second-line" onClick={deleteTag}>
                                                    <span>删除</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }):
                            <></>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}
