import React, { useState } from 'react';
import ToolBar from './toolbar'
import PubSub, { unsubscribe } from 'pubsub-js';
import api from '../../../service/api'
import DeleteNotice from './deleteNotice'
import timestampConversion from '../../../utils/timestampConversion';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {storagePresentNote} from './presentNoteSlice'
import {storageNoteList,setCollectState,cancelCollectState,selectNoteList} from './noteListSlice'
import {storageTagList} from './tagListSlice'
import {storageGlobalMask} from '../globalMask/globalMaskSlice'
import { selectChooseItem } from '../sidebar/chooseItemSlice';
import { useHistory, useLocation } from 'react-router-dom';
import searchUrlId from '../../../utils/searchUrlId'
import { selectDiffFlag,storageDiffFlag } from './diffFlag';
import './index.scss'
export default function DisplayContent() {
    const [noteInfo,setNoteInfo] = useState([])
    const [tags,setTags] = useState([])
    const [toolbarsClassName,setToolbarsClassName] = useState([])
    const [noteIndexStorageCache,setNoteIndexStorageCache] = useState(null)
    const [noteItemClassName,setNoteItemClassName] = useState([])
    const [valve,setValve] = useState(0)
    const [toTopValve,setToTopValve] = useState(0)
    const [searchVal,setSearchVal] = useState('')
    const dispatch = useDispatch();
    const location = useLocation()
    const history = useHistory()
    const [copyNoteInfoValve,setCopyNoteInfoValve] = useState(0)
    const [deleteNoticeOuterStyle,setDeleteNoticeOuterStyle] = useState({display:'none'})
    const [recycleBinValve,setRecycleBinValve] = useState(0)
    // 全局noteInfo
    const copyNoteInfo = useSelector(selectNoteList)
    const info = useSelector(selectChooseItem)
    const diffFlag = useSelector(selectDiffFlag)
    // valve用于控制getNoteList在组件挂载时执行一次
    // 获取笔记列表的函数
    const getNoteList = (data)=>{
        
        return api.post('/v1/note/list',data)
            .then(res=>{
                console.log(res)
                    // setNoteInfo(res.data.notes)
                    console.log(res.data.notes)
                    return res.data.notes
                })
                .then(res=>{
                        //建立映射 
                        // tagId -> tagName
                        const tagsMap = new Map()
                        tags.map(item=>{
                            tagsMap.set(item.tagId,item.tagName)
                        })
                        return {data:res,tagsMap:tagsMap}
                    })
                    .then(res=>{
                            // 替换标签数组
                            
                            for(let i=0;i<res.data.length;i++){
                                // 遍历对象属性
                                for(let item in res.data[i]){
                                    if(item === 'tags'){
                                        // 映射取值，替换对象属性
                                        for(let k = 0;k<res.data[i][item].length;k++){
                                            res.data[i][item][k] = res.tagsMap.get(res.data[i][item][k])
                                            // console.log(res.tagsMap.get(res.data[i][item][k]))
                                            // console.log(res.tagsMap.get(res.data[i][item][k])==='置顶')
                                            // if(res.data[i][item][k]==='置顶'){
                                            //     console.log()
                                            //     api.post('/v1/note/top',{
                                            //         noteId:res.data[i],
                                            //         isTop:1
                                            //     })
                                            // }
                                        }
                                    }
                                }
                            }
                            return res.data;
                            
                        })
                        .then(res=>{
                            for(let i = 0;i<res.length;i++){
                                res[i].tags.map((item,index)=>{
                                    if(item===undefined){
                                        res[i].tags.splice(index,1)
                                    }
                                })
                            }
                            // 修改更新了tags的所有笔记信息
                            // 一定要先改样式 再传数据 不然会有闪烁
                            console.log(res)
                            dispatch(storageNoteList(res))
                            // if(location.pathname.indexOf('/search-result')===-1){
                            // }
                            // 防止页面刷新后全局数据丢失（虽然会有一次闪烁）
                            // if(JSON.stringify(copyNoteInfo)==='{}'){
                            // }
                            // console.log(data)
                            // console.log(res)

                            // if(location.pathname.indexOf('/search-result')!==-1&&data.tagId==='0'&&data.key===''){
                            //     dispatch(storageNoteList(res.data))
                            // }
                            setNoteInfo(res);
                            return res;
                        })
                        
    }
    const chooseDataFn = (val)=>{
        let tag = null
        tags.map(item=>{
            if(val===item.tagName){
                tag = item
            }
        })
        console.log(val)
        // 关键字搜索
        let data = null;
        if(tag===null){
            return data = {
                key: val,
                tagId: "0",
                source: "",
                index: 0,
                offset: 100,
                updateMs:0
            }
        }
        // 标签搜索
        else{
            return data = {
                key: '',
                tagId: tag.tagId,
                source: "",
                index: 0,
                offset: 100,
                updateMs:0
            }
        }
    }
    const setNoteInfoFn = ()=>{
        let strCopyNoteInfo = JSON.stringify(copyNoteInfo)
        if(strCopyNoteInfo!=='{}'){
            setNoteInfo([...copyNoteInfo])
        }
    }
    // useEffect(()=>{
    //     // 路由跳转时清空数据
    //     dispatch(storageNoteList([]))
    // },[location.pathname])
    // 获取tags列表 
    useEffect(()=>{
        api.post('/v1/tag/list')
        .then(res=>{
            console.log(res)
            dispatch(storageTagList(res.data.tags))
            setTags(res.data.tags)
            PubSub.publish('sidebarNum',{
                allNum:res.data.allNum,
                collectNum:res.data.collectNum,
                hszNum:res.data.hszNum,
                wxNum:res.data.wxNum
            })
        })
        .catch(err=>{
            console.log(err)
        })
    },[])
    
    
    useEffect(()=>{
        // 路由为首页时才请求
        if(location.pathname==='/homepage'&&JSON.stringify(info)==='{}'){
            console.log(info)
            // 手动设置节流阀，当且只执行tags不为空时的第一次
            // if(tags.length===0){
            //     const data = {
            //         key: "",
            //         tagId: "0",
            //         source: "",
            //         index: 0,
            //         offset: 100,
            //         updateMs:0
            //     }
            //     getNoteList(data)
            //     .then(res=>{
            //         // 通过总笔记数量初始化每项笔记工具栏样式(默认隐藏)
            //         // 单独发一次请求用于解决redux中数据不可变问题
            //         // 后面需要改这里，这里不太好！
            //         const initArr = Array(res.length).fill('hidden')
            //         setToolbarsClassName(initArr);
            //         // 通过总笔记数量初始化每项笔记外壳样式(默认显示)
            //         const initNoteClassNameArr = Array(res.length).fill('homepage-displayContent-item')
            //         setNoteItemClassName(initNoteClassNameArr)
            //         return res
            //     })
            //     .then(res=>{
            //         dispatch(storageNoteList(res))
            //     })
            //     .catch(err=>{
            //         throw err;
            //     })
                
            // }
            if(tags.length!==0){
                console.log(tags)
                setValve(1)
                const data = {
                    key: "",
                    tagId: "0",
                    source: "",
                    index: 0,
                    offset: 100,
                    updateMs:0
                }
                getNoteList(data)
                    .then(res=>{
                        
                        return res
                    })
                    .catch(err=>{
                        throw err;
                    })
            }
        }
        
    },[tags])
    // 首页专用
    // 接收到了置顶消息强刷视图层
    useEffect(()=>{
        // 手动设置节流阀（只监听一次），又获取最新searchVal进行匹配
        if(location.pathname==='/homepage'&&valve === 0){
            setValve(1) 
            PubSub.subscribe('toTop',(msg,data)=>{
                console.log(111)
                if(data.flag){
                    // 首页中直接调用所有数据进行强刷
                    const data = {
                        key: "",
                        tagId: "0",
                        source: "",
                        index: 0,
                        offset: 100,
                        updateMs:0
                    }
                    getNoteList(data)
                    .catch(err=>{
                        throw err;
                    })
                    // 重新匹配标签
                    api.post('/v1/tag/list')
                    .then(res=>{
                        console.log(res)
                        
                        dispatch(storageTagList(res.data.tags))
                        setTags(res.data.tags)
                        // T_T这里仅仅只是为了能百分百不出现置顶数不更新的情况
                        api.post('/v1/tag/list')
                            .then(res=>{
                                console.log(res)
                                
                                dispatch(storageTagList(res.data.tags))
                                setTags(res.data.tags)

                            })
                            .catch(err=>{
                                console.log(err)
                            })
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                    // api.post('/v1/tag/list')
                    //     .then(res=>{
                    //         console.log(res)
                    //         dispatch(storageTagList(res.data.tags))
                    //         setTags(res.data.tags)
                    //         PubSub.publish('sidebarNum',{
                    //             allNum:res.data.allNum,
                    //             collectNum:res.data.collectNum,
                    //             hszNum:res.data.hszNum,
                    //             wxNum:res.data.wxNum
                    //         })
                    //     })
                    //     .catch(err=>{
                    //         console.log(err)
                    //     })
                    }
            })
        }
    },[tags])
    useEffect(()=>{
        // 尽可能减少数据清空
        if(location.pathname==='/homepage'&&diffFlag===true){
            setNoteInfo([])
            dispatch(storageNoteList([]))
            // 还原控制数组
            dispatch(storageDiffFlag(false))
        }
    },[location.pathname])
    useEffect(()=>{
        // 接收到删除确认消息,删除index缓存区index对应项
        // console.log(noteIndexStorageCache)
        PubSub.subscribe('confirmDelete',(msg,data)=>{
            if(data.flag){
                noteItemClassName[noteIndexStorageCache] = 'hidden'
                console.log(noteItemClassName)
                // 更新修改后的类名
                setNoteItemClassName(noteItemClassName)
                // 强制更新依赖
                setNoteIndexStorageCache()
                api.post('/v1/tag/list')
                .then(res=>{
                    console.log(res)
                    dispatch(storageTagList(res.data.tags))
                    setTags(res.data.tags)
                    PubSub.publish('sidebarNum',{
                        allNum:res.data.allNum,
                        collectNum:res.data.collectNum,
                        hszNum:res.data.hszNum,
                        wxNum:res.data.wxNum
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
            }
        })
        return(()=>{
            unsubscribe('confirmDelete')
        })
    },[noteIndexStorageCache,noteIndexStorageCache])
    // 进入笔记工具栏
    const noteSetting = (item,index)=>{
        return((event)=>{
                event.stopPropagation()
                // 回收站重写逻辑
                // 防止顺序变化后出现bug
                    if(item.id===noteInfo[index].id){
                        // 根据填充hidden
                        console.log(item)
                        dispatch(storagePresentNote(item))
                        // 控制点击项显示样式
                        const initArr = Array(noteInfo.length).fill('hidden')
                        initArr[index] = ''
                        setToolbarsClassName(initArr)
                        setNoteIndexStorageCache(index)
                        // 发送消息,唤起遮罩和工具栏(toolbar)
                        console.log(item.id)
                        PubSub.publish('arouseGlobalMask-noteItemSetting',{id:item.id})
                        dispatch(storageGlobalMask(true))
                    }
                
        })
    }
    // 搜索专用
    useEffect(()=>{
        console.log(location.pathname.indexOf('/search-result'))
        // 判断是否为搜索结果路由
        if(location.pathname.indexOf('/search-result')!==-1&&tags.length!==0){
            let val = location.pathname.substring(searchUrlId(location.pathname,'/',1)+1)
            setSearchVal(val)
            // 选择是关键字搜索还是tagId搜索
            const data = chooseDataFn(val)
            getNoteList(data)
                .catch(err=>{
                    throw err;
                })
            if(toTopValve===0&&searchVal!==undefined&&tags!==undefined){
                // 置顶消息订约当且只订阅一次，设置节流阀
                setToTopValve(1)
                // 标签刷新影响依赖，然后重新发送请求
                // 顺序：消息订阅 -> useEffect外层
                PubSub.subscribe('toTop',(msg,val)=>{
                    if(val){
                        // console.log(searchVal)
                        // let data = chooseDataFn(searchVal)
                        // getNoteList(data)
                        // .catch(err=>{
                        //     throw err;
                        // })
                        api.post('/v1/tag/list')
                            .then(res=>{
                                    console.log(res.data.tags)
                                    setTags(res.data.tags)
                                })
                                .catch(err=>{
                                        console.log(err)
                                    })
                    }
                })
                // 搜索页中需要判断是通过什么搜索的
            }
        }
    },[tags,location.pathname])
    // 回收站专用
    useEffect(()=>{
        if(location.pathname==='/recyclebin'&&tags.length!==0){
            // 监听全选信号
            if(recycleBinValve===0){
                setRecycleBinValve(1)
                PubSub.subscribe('cleanAll',(msg,data)=>{
                    if(data===true){
                        
                    }
                })
            }
            const data = {
                key: "",
                tagId: "0",
                source: "hsz",
                index: 0,
                offset: 100,
                updateMs:0
            }
            getNoteList(data)
                .then(res=>{
                    console.log(res)
                })
                .catch(err=>{
                    throw err;
                })
        }
    },[tags])
    // 请求所有笔记内容并替换tagId
    useEffect(()=>{
        PubSub.subscribe('hideNode',(msg,data)=>{
            const initArr = Array(copyNoteInfo.length).fill('hidden')
            setToolbarsClassName(initArr);
        })
    },[])
    useEffect(()=>{
        // 通过全局总笔记数量初始化每项笔记工具栏样式(默认隐藏)
        // 解决路由回退时闪烁bug
        // if(noteInfo.length!==0){
            console.log(copyNoteInfo)
            const initArr = Array(copyNoteInfo.length).fill('hidden')
            setToolbarsClassName(initArr);
            // 通过总笔记数量初始化每项笔记外壳样式(默认显示)
            const initNoteClassNameArr = Array(copyNoteInfo.length).fill('homepage-displayContent-item')
            setNoteItemClassName(initNoteClassNameArr)
        // }
    },[copyNoteInfo])
    // 修改收藏
    const collect = (id,presentCollectState,index)=>{
        return((event)=>{
            // console.log(presentCollectState)
            event.stopPropagation();
            console.log(presentCollectState)
            console.log(copyNoteInfo)
            // 这里分路由的原因在首页会被redux跟踪到，无法修改数据
            // 而搜索结果页面进行收藏存在bug
            // if(location.pathname.indexOf('/search-result')!==-1){
            //     if(noteInfo[index].isCollect===1){
            //         // console.log(noteInfo)
            //         // 强制更新视图层
            //         api.post('/v1/note/collect',{
            //                 "noteId":id,
            //                 "isCollect":0
            //             })
            //             .then(res=>{
            //                 dispatch(cancelCollectState(index))
            //                 // dispatch(cancelCollectState(index))
            //                 console.log(res)
            //             })
            //     }
            //     else{
            //         api.post('/v1/note/collect',{
            //                 "noteId":id,
            //                 "isCollect":1
            //             })
            //             .then(res=>{
            //                 dispatch(setCollectState(index))
            //                 // dispatch(setCollectState(index))
            //                 console.log(res)
            //             })
            //     }
            // }
            // if(location.pathname==='/homepage'){
                if(noteInfo[index].isCollect===1){
                    // console.log(noteInfo)
                    // 强制更新视图层
                    api.post('/v1/note/collect',{
                            "noteId":id,
                            "isCollect":0
                        })
                        .then(res=>{
                            api.post('/v1/tag/list')
                            .then(res=>{
                                dispatch(storageTagList(res.data.tags))
                                setTags(res.data.tags)
                                PubSub.publish('sidebarNum',{
                                    allNum:res.data.allNum,
                                    collectNum:res.data.collectNum,
                                    hszNum:res.data.hszNum,
                                    wxNum:res.data.wxNum
                                })
                            })
                            dispatch(cancelCollectState(index))
                            console.log(res)
                        })
                }
                else{
                    api.post('/v1/note/collect',{
                            "noteId":id,
                            "isCollect":1
                        })
                        .then(res=>{
                            api.post('/v1/tag/list')
                            .then(res=>{
                                dispatch(storageTagList(res.data.tags))
                                setTags(res.data.tags)
                                PubSub.publish('sidebarNum',{
                                    allNum:res.data.allNum,
                                    collectNum:res.data.collectNum,
                                    hszNum:res.data.hszNum,
                                    wxNum:res.data.wxNum
                                })
                            })
                            dispatch(setCollectState(index))
                            console.log(res)
                        })
                }
            // }
        })
    }
    const changeNoticeOuterStyle = (params)=>{
        console.log(params)
        setDeleteNoticeOuterStyle(params)
    }
    const goNote = (id)=>{
        return(()=>{
            history.push(`/note/${id}`)
        })
    }
    // 用于解决全局noteList数据不可变问题并实现视图层实时更新
    useEffect(()=>{
        // 对象判空
        // 这么做的主要目的是为了解决/search首次挂载渲染数据为全局的所有lists导致的闪烁问题
        // 故设置节流阀
        setCopyNoteInfoValve(1)
        if(location.pathname.indexOf('/search-result')!==-1&&copyNoteInfoValve===1){
            setNoteInfoFn()
        }
        if(location.pathname==='/homepage'){
            setNoteInfoFn()
        }
    },[copyNoteInfo])
    // 根据sidebar选中内容发送请求
    useEffect(()=>{
        if(JSON.stringify(info)!=='{}'&&location.pathname==='/homepage'&&tags.length!==0){
            let val = info.title
            console.log(val)
            console.log(info)
            let data
            if(info.title!=='全部笔记'&&info.title!=='我的收藏'&&info.title!=='来自微信'){
                data = chooseDataFn(val)
            }
            switch (info.title) {
                case '全部笔记':
                    data = {
                        key: '',
                        tagId: "0",
                        source: "",
                        index: 0,
                        offset: 100,
                        updateMs:0
                    }
                    break;
                case '我的收藏':
                    data = {
                        key: '',
                        tagId: "0",
                        source: "sc",
                        index: 0,
                        offset: 100,
                        updateMs:0
                    }
                    break;
                case '来自微信':
                    data = {
                        key: '',
                        tagId: "0",
                        source: "wx",
                        index: 0,
                        offset: 100,
                        updateMs:0
                    }
                    break;
                default:
                    break;
            }
            console.log(data)
            getNoteList(data)
                .then(res=>{
                    console.log(res)
                })
                .catch(err=>{
                    throw err;
                })
        }
    },[info,location.pathname,tags])
    
    return (
    <div>
        <div className="homepage-displayContent-outer">
            <div className="homepage-displayContent">
                {
                    noteInfo.map((item,index)=>{
                        return(
                            <div className={noteItemClassName[index]} key={item.id} onClick={goNote(item.id)}>
                                <div className={toolbarsClassName[index]}>
                                    {/* 防止重复挂载，提升性能 */}
                                    {
                                        toolbarsClassName[index]===''?
                                        <ToolBar></ToolBar>:
                                        <></>
                                    }
                                </div>
                                <div className="homepage-displayContent-item-header">
                                    <div className="homepage-displayContent-item-header-left">
                                        <span className="time">
                                        {
                                            timestampConversion(item.updateMs)
                                        }
                                        </span>
                                        {
                                            item.tags.map((tag,index)=>{
                                                return(
                                                    <span className="tag" key={index}>#{tag}</span>
                                                )
                                            })
                                        }
                                    </div>
                                    <div className="homepage-displayContent-item-header-right">
                                        <div className="homepage-displayContent-item-header-setting-btn" onClick={noteSetting(item,index)}>
                                            <img src="https://s4.ax1x.com/2022/01/27/7XB20P.png" alt="err" className='homepage-displayContent-item-header-setting-img'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="homepage-displayContent-item-content">
                                    <span>{item.title}</span>
                                    <div className="homepage-displayContent-item-content-collect-btn" onClick={collect(item.id,item.isCollect,index)}>
                                        {
                                            location.pathname!=='/recyclebin'?
                                            item.isCollect?<img src='https://s4.ax1x.com/2022/01/29/HSrUjU.png' alt="err" className="homepage-displayContent-item-content-collect-img" />
                                            :
                                            <img src="https://s4.ax1x.com/2022/01/27/7Xrm5T.png" alt="err" className="homepage-displayContent-item-content-collect-img" />
                                            :<></>
                                        }
                                        {/* <img src="https://s4.ax1x.com/2022/01/27/7Xrm5T.png" alt="err" className="homepage-displayContent-item-content-collect-img" /> */}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                
            </div>
        </div>
        <div className='deleteNotice-outer' style={deleteNoticeOuterStyle}>
            <DeleteNotice changeNoticeOuterStyle={changeNoticeOuterStyle}></DeleteNotice>
        </div>
    </div>
    );
}
