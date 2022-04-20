import React, { useEffect, useState } from 'react';
import PubSub from 'pubsub-js';
import api from '../../../../service/api';
import './index.scss'
import { useDispatch,useSelector } from 'react-redux';
import { storageGlobalMask,selectGlobalMask } from '../../globalMask/globalMaskSlice';
import { selectPresentNote } from '../presentNoteSlice';
import { useLocation } from 'react-router-dom';
export default function DeleteNotice(props) {
    const [controlPresent,setControlPresent] = useState({display:'none'})
    const [noteIdStorageCache,setNoteIdStorageCache] = useState(null)
    const dispatch = useDispatch()
    const [valve,setValve] = useState(0)
    const flag = useSelector(selectGlobalMask)
    const [checkState,setCheckState] = useState()
    const [deleteInfo,setDeleteInfo] = useState({})
    const presentNote = useSelector(selectPresentNote)
    useEffect(()=>{
        // 点击遮罩退出取消
        // PubSub.publish('arouseGlobalMask-deleteNote',{flag:true,id:noteIdStorageCache})
        console.log(controlPresent)
        if(valve===0&&controlPresent.display!=='none'){
            
            setValve(1)
            PubSub.subscribe('cancelGlobalMask-deleteNote',(msg,data)=>{
                console.log(controlPresent.display)
                // controlPresent.display!=='none'解决首次退出全局遮罩时，样式由display:none->退出动画的逻辑bug
                if(data.flag===false){
                    setControlPresent(
                        {
                            animation:'deleteNoticeSlideOut 0.6s',
                            animationFillMode:'forwards',
                        }
                    )
                    setTimeout(()=>{
                        props.changeNoticeOuterStyle({zIndex:-1})
                    },650)
                }

            })
        }
        return(()=>{
            PubSub.unsubscribe('cancelGlobalMask-deleteNote')
        })
    },[controlPresent.display])

    useEffect(()=>{
        
        PubSub.subscribe('arouseGlobalMask-deleteNote',(msg,data)=>{
            // 接到flag 呈现弹窗
            // 回收站删除逻辑重写
            console.log(flag)
            console.log('****************************************')
            if(data.flag===true){
                console.log(987)
                if(data.checkState==='delete'){
                    setDeleteInfo({deleteNotice:'删除标签',deleteContent:'确认要删除选中的标签吗(笔记不会删除)'})
                }

                else{
                    setDeleteInfo({deleteNotice:'删除笔记',deleteContent:'确认要删除选中的笔记吗?'})
                }
                if(data.checkState!=='recover'){
                    setCheckState(data.checkState)
                    props.changeNoticeOuterStyle({zIndex:10005})
                    setNoteIdStorageCache(data.id)
                    setControlPresent({
                        animation:'deleteNoticeSlideIn 0.6s',
                    })
                }
                // 恢复笔记直接恢复
                else{
                    dispatch(storageGlobalMask(false))
                    console.log(presentNote)
                    api.post('/v1/note/delete',{
                        noteId:presentNote.id,
                        isDeleted:0
                    })
                    .then(res=>{
                        PubSub.publish('confirmDelete',{flag:true})
                        
                    })
                }
            }
            else{
                console.log(888)
                setControlPresent(
                    {
                        animation:'deleteNoticeSlideOut 0.6s',
                        animationFillMode:'forwards',
                    }
                )
                setTimeout(()=>{
                    props.changeNoticeOuterStyle({zIndex:-1})
                },650)
            }
        })
        return(()=>{
            PubSub.unsubscribe('arouseGlobalMask-deleteNote')
        })
    },[presentNote])
    
    // 点击取消
    const cancel = ()=>{
        // 取消全局遮罩
        // PubSub.publish('arouseGlobalMask-noteItemSetting',{flag:false})
        dispatch(storageGlobalMask(false))
        console.log()
        setControlPresent(
            {
                animation:'deleteNoticeSlideOut 0.6s',
                animationFillMode:'forwards'
            }
        )
        setTimeout(()=>{
            props.changeNoticeOuterStyle({zIndex:-1})
        },650)
    }
    // 确认删除的回调
    const deleteFn = ()=>{
        dispatch(storageGlobalMask(false))
        // 向父组件发送确认删除消息
        
        console.log(presentNote.id)
        // 删除标签
        if(checkState==='delete'){
            api.post('/v1/tag/delete',{
                    tagId:noteIdStorageCache,
                    isDeleted:1
                })
                .then(res=>{
                    PubSub.publish('confirmDelete',{flag:true})
                    console.log(res)
                })
        }
        // 永久删除
        if(checkState==='delete-forever'){
            api.post('/v1/note/delete',{
                noteId:presentNote.id,
                isDeleted:2
            })
            .then(res=>{
                PubSub.publish('confirmDelete',{flag:true})
                console.log(res)
            })
        }
        
        // 删除笔记到回收站
        else{
            api.post('/v1/note/delete',{
                    noteId:presentNote.id,
                    isDeleted:1
                })
                .then(res=>{
                    PubSub.publish('confirmDelete',{flag:true})
                    console.log(res)
                })
        }
        setControlPresent(
            {
                animation:'deleteNoticeSlideOut 0.6s',
                animationFillMode:'forwards'
            }
        )
        setTimeout(()=>{
            props.changeNoticeOuterStyle({zIndex:-1})
        },650)
    }
    useEffect(()=>{
        console.log(presentNote)
    },[presentNote])
    return (
    <div>
        <div className='homepage-deleteNotice-outer' style={controlPresent}>
            <div className="homepage-deleteNotice">
                <div className="homepage-deleteNotice-title">{deleteInfo.deleteNotice}</div>
                <div className="homepage-deleteNotice-content">{deleteInfo.deleteContent}</div>
                <div className="homepage-deleteNotice-btn">
                    <div className="homepage-deleteNotice-cancel" onClick={cancel}>取消</div>
                    <div className="homepage-deleteNotice-delete" onClick={deleteFn}>删除</div>
                </div>

            </div>
        </div>
    </div>
    );
}
