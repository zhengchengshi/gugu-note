import React ,{useState,useEffect}from 'react';
import PubSub from 'pubsub-js';
import api from '../../../service/api'
import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectTagList } from '../displayContent/tagListSlice';
import {storageChooseItem,selectChooseItem} from './chooseItemSlice';
import { storageNoteList } from '../displayContent/noteListSlice';
import AddTag from '../../../pages/addTag/mask'
import { useHistory, useLocation } from 'react-router-dom';
export default function Sidebar() {
    // 因为每个icon图片地址不同，所以使用状态对应样式的方式
    const chooseIndex = useSelector(selectChooseItem).index
    const dispatch = useDispatch()
    const [checkState,setCheckState] = useState([true,false,false,false])
    const [sideBarStyle,setSideBarStyle] = useState({display:"none"})
    const [quitSideBarStyle,setQuitSideBarStyle] = useState({})
    const [userInfo,setUserInfo] = useState(null)
    const [allTag,setAllTag] = useState([])
    const tagList = useSelector(selectTagList)
    const [checkStateArr,setCheckStateArr] = useState([])
    const [statisticsNum,setStatisticsNum] = useState({
        allNum:0,
        collectNum:0,
        hszNum:0,
        wxNum:0
    })
    const location = useLocation()
    // 初始化所有选中状态
    const initcheckStyle = [
        {imgUrl:'https://s4.ax1x.com/2022/01/27/7jEqAO.png',style:{color:'#000000'}},
        {imgUrl:'https://s4.ax1x.com/2022/01/27/7XjAV1.png',style:{color:'#000000'}},
        {imgUrl:'https://s4.ax1x.com/2022/01/27/7XjMKH.png',style:{color:'#000000'}},
        {imgUrl:'https://s4.ax1x.com/2022/01/27/7XjYPf.png',style:{color:'#000000'}},
    ]
    const [styleArr,setStyleArr] = useState(initcheckStyle)
    const history = useHistory()
    // 修改选中状态的函数，作用于点击事件中
    
    // 重构的事件函数，所有点击事件共用一个函数
    const changeCheckState = (index,title,noteNum)=>{
        return(()=>{
            if(title==='回收站'){
                // dispatch(storageChooseItem({title:'全部笔记',noteNum,index:0}))
                dispatch(storageNoteList({}))
                history.push('/recyclebin')
            }
            else{
                dispatch(storageChooseItem({title,noteNum,index}))
            }
            const initStateArr = Array(allTag.length).fill(false)
            initStateArr[index] = true
            console.log(`${title} ${noteNum}`)
            setCheckStateArr(initStateArr)
            // 隐藏抽屉
            setQuitSideBarStyle({animation:'slideOut 0.5s',animationFillMode:'forwards'})
            setTimeout(()=>{
                setSideBarStyle({display:'none'})
            },600)
        })
    }
    useEffect(()=>{
        PubSub.subscribe('sidebarNum',(msg,data)=>{
            setStatisticsNum(data)
        })
    },[])
    // useEffect(()=>{
    //     dispatch(storageChooseItem({title:'全部笔记'}))
    // },[location.pathname])
    // 修改选中态
    useEffect(()=>{
        const initStateArr = Array(allTag.length).fill(false)
        console.log(chooseIndex)
        // 若无选中则默认选中第一个
        if(JSON.stringify(chooseIndex)===undefined){
            initStateArr[0] = true
        }
        else{
            console.log(chooseIndex)
            initStateArr[chooseIndex] = true
        }
        setCheckStateArr(initStateArr)
    },[allTag])
    // 已重构
    // function checkStateFn(index){
    //     let initArr = [false,false,false,false]
    //     initArr[index] = true;
    //     setCheckState([...initArr])
    // }
    // const allNote = (index)=>{
    //     return()=>{
    //         checkStateFn(index)
    //     }
    // }
    // const myCollect = (index)=>{
    //     return()=>{
    //         checkStateFn(index)
    //     }
    // }
    // const fromWechat = (index)=>{
    //     return()=>{
    //         checkStateFn(index)
    //     }
    // }
    // const recycleBin = (index)=>{
    //     return()=>{
    //         checkStateFn(index)
    //     }
    // }
    // useEffect(()=>{
    //     if(checkState[0]){
    //         initcheckStyle[0] = {imgUrl:'https://s4.ax1x.com/2022/01/27/7jmXZt.png',style:{color:'#007AFF'}}
    //         setStyleArr([...initcheckStyle])
    //     }
    //     if(checkState[1]){
    //         initcheckStyle[1] = {imgUrl:'https://s4.ax1x.com/2022/01/27/7jncY8.png',style:{color:'#007AFF'}}
    //         setStyleArr([...initcheckStyle])
    //     }
    //     if(checkState[2]){
    //         initcheckStyle[2] = {imgUrl:'https://s4.ax1x.com/2022/01/27/7jn7kV.png',style:{color:'#007AFF'}}
    //         setStyleArr([...initcheckStyle])
    //     }
    //     if(checkState[3]){
    //         initcheckStyle[3] = {imgUrl:'https://s4.ax1x.com/2022/01/27/7jnHYT.png',style:{color:'#007AFF'}}
    //         setStyleArr([...initcheckStyle])
    //     }
    // },[checkState])

    useEffect(()=>{
        PubSub.subscribe('arouseSideBar',(data,msg)=>{
            if(msg.flag){
                setSideBarStyle({})
                // 注意：animationFillMode不能在进入和离开时同时拥有
                setQuitSideBarStyle({animation:'slideIn 0.5s'})
            }
        })
        return(()=>{
            PubSub.unsubscribe('arouseSideBar')
        })
    },[])

    useEffect(()=>{
        api.post('/v1/user/info')
            .then(res=>{
                setUserInfo(res.data)
                console.log(res.data)
            })
    },[])
    useEffect(()=>{
        if(JSON.stringify(tagList)!=='{}'){
            setAllTag(tagList)
            console.log(tagList)
        }
    },[tagList])
    // 初始化状态数组

    // 取消侧边栏
    const cancelMask = ()=>{
        setQuitSideBarStyle({animation:'slideOut 0.5s',animationFillMode:'forwards'})
        setTimeout(()=>{
            setSideBarStyle({display:'none'})
        },600)
    }
    const manageTag = ()=>{
        history.push('/manage-tag')
    }
    // 添加标签
    // const addTag = ()=>{
    //     cancelMask()
    //     setTimeout(()=>{
    //         PubSub.publish('arouse-addTag-mask',{flag:true})
    //     },600)
    // }
    return (
    <div>
        <div className="homepage-sidebar-outer" style={sideBarStyle}>
            <div className="homepage-sidebar" style={quitSideBarStyle}>
                <div className="homepage-sidebar-main-box">
                    <div className="homepage-sidebar-main-box-item"> 
                        <div className="firstline">
                            {
                                userInfo!==null?<span>{userInfo.userAchieve.days}</span>:<span></span>
                            }
                            <span>天</span>
                        </div>
                        <div className="secondline">
                            <span>成为作者</span>
                        </div>
                    </div>
                    <div className="homepage-sidebar-main-box-item">
                        <div className="firstline">
                            {
                                userInfo!==null?<span>{userInfo.userAchieve.noteNum}</span>:<span></span>
                            }
                            <span>个</span>
                        </div>
                        <div className="secondline">
                            <span>笔记数量</span>
                        </div>
                    </div>
                    <div className="homepage-sidebar-main-box-item">
                        <div className="firstline">
                            {
                                userInfo!==null?<span>{userInfo.userAchieve.totalDays}</span>:<span></span>
                            }
                            <span>天</span>
                        </div>
                        <div className="secondline">
                            <span>连续写作</span>
                        </div>
                    </div>
                </div>
                {/* <div className="homepage-sidebar-features">
                    <div className="homepage-sidebar-features-item" onClick={allNote(0)}>
                        <img src={styleArr[0].imgUrl} alt="err" className='homepage-sidebar-features-item-icon'/>
                        <span style={styleArr[0].style}>全部笔记 (112)</span>
                    </div>
                    <div className="homepage-sidebar-features-item" onClick={myCollect(1)}>
                        <img src={styleArr[1].imgUrl} alt="err" className='homepage-sidebar-features-item-icon'/>
                        <span style={styleArr[1].style}>我的收藏 (33)</span>
                    </div>
                    <div className="homepage-sidebar-features-item" onClick={fromWechat(2)}>
                        <img src={styleArr[2].imgUrl} alt="err" className='homepage-sidebar-features-item-icon'/>
                        <span style={styleArr[2].style}>来自微信 (30)</span>
                    </div>
                    <div className="homepage-sidebar-features-item" onClick={recycleBin(3)}>
                        <img src={styleArr[3].imgUrl} alt="err" className='homepage-sidebar-features-item-icon'/>
                        <span style={styleArr[3].style}>回收站 (1)</span>
                    </div>
                </div> */}
                <div className="homepage-sidebar-features">
                    <div className="homepage-sidebar-features-item" onClick={changeCheckState(0,'全部笔记',112)}>
                        {
                            checkStateArr[0]?
                            <>
                                <img src='https://s4.ax1x.com/2022/01/27/7jmXZt.png' alt="err" className='homepage-sidebar-features-item-icon'/>
                                <span style={{color:'#007AFF'}}>全部笔记 ({statisticsNum.allNum})</span>
                            </>
                            :
                            <>
                                <img src='https://s4.ax1x.com/2022/01/27/7jEqAO.png' alt="err" className='homepage-sidebar-features-item-icon'/>
                                <span style={{color:'#000000'}}>全部笔记 ({statisticsNum.allNum})</span>
                            </>
                        }
                    </div>
                    <div className="homepage-sidebar-features-item" onClick={changeCheckState(1,'我的收藏',33)}>
                        {
                            checkStateArr[1]?
                            <>
                                <img src='https://s4.ax1x.com/2022/01/27/7jncY8.png' alt="err" className='homepage-sidebar-features-item-icon'/>
                                <span style={{color:'#007AFF'}}>我的收藏 ({statisticsNum.collectNum})</span>
                            </>
                            :
                            <>
                                <img src='https://s4.ax1x.com/2022/01/27/7XjAV1.png' alt="err" className='homepage-sidebar-features-item-icon'/>
                                <span style={{color:'#000000'}}>我的收藏 ({statisticsNum.collectNum})</span>
                            </>
                        }
                    </div>
                    <div className="homepage-sidebar-features-item" onClick={changeCheckState(2,'来自微信',30)}>
                        {
                            checkStateArr[2]?
                            <>
                                <img src='https://s4.ax1x.com/2022/01/27/7jn7kV.png' alt="err" className='homepage-sidebar-features-item-icon'/>
                                <span style={{color:'#007AFF'}}>来自微信 ({statisticsNum.wxNum})</span>
                            </>
                            :
                            <>
                                <img src='https://s4.ax1x.com/2022/01/27/7XjMKH.png' alt="err" className='homepage-sidebar-features-item-icon'/>
                                <span style={{color:'#000000'}}>来自微信 ({statisticsNum.wxNum})</span>
                            </>
                        }
                    </div>
                    <div className="homepage-sidebar-features-item" onClick={changeCheckState(3,'回收站',1)}>
                        {
                            checkStateArr[3]?
                            <>
                                <img src='https://s4.ax1x.com/2022/01/27/7jnHYT.png' alt="err" className='homepage-sidebar-features-item-icon'/>
                                <span style={{color:'#007AFF'}}>回收站 ({statisticsNum.hszNum})</span>
                            </>
                            :
                            <>
                                <img src='https://s4.ax1x.com/2022/01/27/7XjYPf.png' alt="err" className='homepage-sidebar-features-item-icon'/>
                                <span style={{color:'#000000'}}>回收站 ({statisticsNum.hszNum})</span>
                            </>
                        }
                    </div>
                </div>
                <div className="homepage-sidebar-manageTag">
                    <div className="homepage-sidebar-manageTag-header">
                        <span>我的标签</span>
                        <span onClick={manageTag}>管理</span>
                    </div>
                    {   
                        allTag.map((item,index)=>{
                            return(
                                <div className="homepage-sidebar-manageTag-item" key={index} onClick={changeCheckState(index+4,item.tagName,item.noteNum)}>
                                    {
                                        checkStateArr[index+4]?
                                        <>
                                            <img src="https://s4.ax1x.com/2022/02/05/Hnt4Vx.png" alt="err" className='homepage-sidebar-manageTag-item-icon'/>
                                            <span style={{color:'#007AFF'}}>{item.tagName} ({item.noteNum})</span>
                                        </>
                                        :
                                        <>
                                            <img src="https://s4.ax1x.com/2022/01/27/7Xvqkq.png" alt="err" className='homepage-sidebar-manageTag-item-icon'/>
                                            <span style={{color:'#000000'}}>{item.tagName} ({item.noteNum})</span>
                                        </>
                                    }
                                </div>
                            )
                        })
                    }
                    {/* <div className="homepage-sidebar-manageTag-addTag">
                        <img src="https://s4.ax1x.com/2022/01/27/7XzFbj.png" alt="err" className='homepage-sidebar-manageTag-item-icon'/>
                        <span>添加标签</span>
                    </div> */}
                </div>
            </div>
            <div className="homepage-sidebar-background" onClick={cancelMask}/>
        </div>
        {/* <AddTag></AddTag> */}
    </div>
    );
}
