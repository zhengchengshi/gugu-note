import React, { useEffect, useRef, useState } from 'react';
import { storageGlobalMask } from '../../../components/homepageComponent/globalMask/globalMaskSlice';
import PubSub from 'pubsub-js';
import './index.scss'
import { useDispatch } from 'react-redux';
export default function Mask() {
    const [controlPresent,setControlPresent] = useState('hidden')
    const [maskStyle,setMaskStyle] = useState({})
    const iptValue = useRef()
    const [iptPlaceholder,setIptPlaceholder] = useState('标签名')
    const [controlMaskPresent,setControlMaskPresent] = useState({})
    const [differentInfo,setDifferentInfo] = useState({title:'添加标签',btnInfo:'添加'})
    const [presentCheckState,setPresentCheckState] = useState()
    const dispatch = useDispatch()
    useEffect(()=>{
        PubSub.subscribe('arouse-addTag-mask',(msg,data)=>{
            // 判空
            setPresentCheckState(data.flag)
            if(iptValue!==null){
                // 每次唤起标签输入框清空上次输入
                iptValue.current.value = ''
                // 还原placeholder
                setIptPlaceholder('标签名')
            }
            if(data.flag==='rename'){
                iptValue.current.value = data.tagName
                setDifferentInfo({title:'重命名标签',btnInfo:'重命名'})

                // 解决rename复用时闪烁现象（这里这样是因为有两层遮罩，所以要隐藏一层，但这一层什么又有交互，所以使用透明度为0的方式实现）
                setControlMaskPresent({opacity:0})
                
                setMaskStyle({
                    animation: 'addTagNoticeSlideIn 0.5s',
                })
                setControlPresent("addTag-mask-outer")

                // setControlPresent()
            }
            if(data.flag===true){
                setMaskStyle({
                    animation: 'addTagNoticeSlideIn 0.5s',
                })
                setControlPresent("addTag-mask-outer")
            }
            return(()=>{
                PubSub.unsubscribe('arouse-addTag-mask')
            })
        })
    },[])
    const cancelMask = ()=>{
        // 关闭全局遮罩
        dispatch(storageGlobalMask(false));
        setMaskStyle({
            animation: 'addTagNoticeSlideOut 0.5s',
            animationFillMode:'forwards'
        })
        setTimeout(()=>{
            // 透明度恢复
            setControlMaskPresent({})
            setControlPresent('hidden')
        },600)
    }
    const addTag = ()=>{
        // 判断输入标签是否为空
        if(iptValue.current.value.split(" ").join("").length !== 0){
            PubSub.publish('newTag',{newTag:iptValue.current.value,checkState:presentCheckState})
            setMaskStyle({
                animation: 'addTagNoticeSlideOut 0.5s',
                animationFillMode:'forwards'
            })
            setTimeout(()=>{
                setControlPresent('hidden')
            },600)
        }
        else{
            // 清空输入内容
            iptValue.current.value = ''
            // 输入为空则修改提示语
            setIptPlaceholder('输入不能为空')
        }
    }
    
    return (
    <div>
        <div className={controlPresent}>
            <div className='addTag-mask-fixed'>
                <div className="addTag-mask" style={maskStyle}>
                    <div className="addTag-mask-operatingArea">
                        <span>{differentInfo.title}</span>
                        <input type="text" placeholder={iptPlaceholder} ref={iptValue}/>
                        <div className="addTag-mask-operatingArea-btns">
                            <div className="addTag-mask-operatingArea-left-btn" onClick={cancelMask}>取消</div>
                            <div className="addTag-mask-operatingArea-right-btn" onClick={addTag}>{differentInfo.btnInfo}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='addTag-mask-background' onClick={cancelMask} style={controlMaskPresent}/>
        </div>
    </div>
    );
}
