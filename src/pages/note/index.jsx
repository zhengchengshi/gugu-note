import React,{useEffect,useState,} from 'react';
// import { useSelector,useDispatch } from 'react-redux';
// import {storageEditor,selectEditor} from './editorSlice'
import './index.scss'
import E from 'wangeditor'
import Mask from '../../components/noteComponent/mask'
import Recording from '../../components/noteComponent/recording'
import searchUrlId from '../../utils/searchUrlId'
import { useLocation } from 'react-router-dom';
import debounce from '../../utils/debounce';
import insertStr from '../../utils/insertStr'
import api from '../../service/api';
// import PubSub from 'pubsub-js'
export default function Note() {
    
    // const [stickKeyboard,setStickKeyboard] = useState({})
    // const [viewport, setViewport] = useState({
    //     width: window.innerWidth,
    //     height: window.innerHeight,
    // });
    // const [keyboardHeight,setKeyboardHeight] = useState(0)
    // const [textStyle,setTextStyle] = useState({})
    const [pullUpNotice,setPullUpNotice] = useState(false)
    const [noteId,setNoteId] = useState()
    const [globalEditor,setGlobalEditor] = useState()
    const [noteContent,setNoteContent] = useState([])
    const [firstNoteContent,setFirstNoteContent] = useState([])
    const location = useLocation()
    // const dispatch = useDispatch()
    // const globalEditor = useSelector(selectEditor)
    // let arr = []
    // 获取键盘高度
    // useEffect(() => {
    //     const handler = () => {
    //         arr.push(window.visualViewport.height)
    //         let res = Math.min(...arr)
    //         // alert(res)
    //         setKeyboardHeight(res)
    //         if (!window.visualViewport) return
    //         setViewport({
    //         width: window.visualViewport.width,
    //         height: window.visualViewport.height,
    //         });
    //     };

    //     window.visualViewport.addEventListener("resize", handler);
    //     // window.visualViewport.addEventListener("scroll", handler);

    //     return () => {
    //         window.visualViewport.removeEventListener("resize", handler);
    //         // window.visualViewport.removeEventListener("scroll", handler);
    //     };
    // }, []);
    // alert(viewport.height)
    // const [keyboardHeight,setKeyboardHeight] = useState(0)
    // alert(keyBoardHeight.height)

    
    
    // const keyboardFocus = ()=>{
    //     setStickKeyboard({bottom:`${keyboardHeight}px`})
    //     if(keyboardHeight-60>0){

    //         setTextStyle({height:keyboardHeight-60+'px'})
    //     }
    // }
    
    // const keyboardBlur =()=>{
    //     setTimeout(()=>{
    //         setStickKeyboard({bottom:`0px`})
    //         setTextStyle({height:'97vh'})
    //     },0)
    // }
    
    // useEffect(()=>{
    //     // alert(window.visualViewport.height-keyboardHeight)
    //     setStickKeyboard({bottom:`${keyboardHeight}px`})
    //     setTextStyle({height:keyboardHeight-60+'px'})
    // },[keyboardHeight])
    useEffect(()=>{
        setNoteId(location.pathname.substring(searchUrlId(location.pathname,'/',1)+1));
        const id = location.pathname.substring(searchUrlId(location.pathname,'/',1)+1);
        
    },[])
    // 初始化创建编辑器
    const iptChange = ()=>{

    }
    useEffect(()=>{
        // getKeyboardHeight()
        // alert(keyBoardHeight.height)
        const id = location.pathname.substring(searchUrlId(location.pathname,'/',1)+1);
        let editor = new E('#toolbar-container', '#text-container');
        setGlobalEditor(editor)
        editor.config.placeholder = ''
        editor.config.focus = false
        editor.config.menus = [
            // 'list',
            // 'justify',
            'italic',
            'underline',
            'bold',
            'strikeThrough',
            'undo',
            'redo',
        ];



        // 根据url中的id初始化笔记内容
        (async ()=>{
            const noteList = await api.post('/v1/note/list',{
                    key: '',
                    tagId: "0",
                    source: "",
                    index: 0,
                    offset: 100,
                    updateMs:0
                })
                .then(res=>{
                    console.log(res.data.notes)
                    return res.data.notes
                })
            let noteContentArr = []
            noteList.map(item=>{
                if(item.id===id){
                    setNoteContent([...item.noteItems])
                    noteContentArr = [...item.noteItems]
                }
            })
            console.log(noteContentArr)
            const editorNoteContent = []
            noteContentArr.map(item=>{
                if(item.type==='text'){
                    let noteTxtContent = item.content
                    let presentLineObj = {
                        tag: "p",
                        attrs: [],
                        children: []
                    }
                    // 不带样式
                    if(item.inlineStyles.length===0){
                        presentLineObj.children.push(item.content)
                    }
                    else{
                        item.inlineStyles.map(style=>{
                            let reverseTagName = style.inlineType
                            console.log(reverseTagName)
                            switch (reverseTagName) {
                                case 'bold':
                                    reverseTagName = 'b'
                                    break;
                                case 'italic':
                                    reverseTagName = 'i'
                                    break;
                                case 'underline':
                                    reverseTagName = 'u'
                                    break;
                                case 'strike_through':
                                    reverseTagName = 's'
                                    break;
                                default:
                                    break;
                            }
                            const presentStyleObj = {
                                tag: reverseTagName,
                                attrs: [],
                                children: [
                                    item.content.substring(style.offset,style.offset+style.length)
                                ],
                                offset:style.offset,
                                length:style.length
                            }
                            
                            console.log(noteTxtContent)
                            // console.log(noteTxtContent[noteTxtContent.length-1].split(style.offset,style.offset+style.length) )
                            // noteTxtContent = noteTxtContent[noteTxtContent.length-1].split(style.offset,style.offset+style.length)
                            presentLineObj.children.push(presentStyleObj)
                            // console.log(presentStyleObj)
                        })
                        // 一来没有样式 后面才有
                        if(item.inlineStyles[0].offset!==0)
                        presentLineObj.children.splice(0,0,noteTxtContent.slice(0,item.inlineStyles[0].offset))
                        console.log(presentLineObj.children)
                        for(let i = 0;i<item.inlineStyles.length;i++){
                            console.log(item.inlineStyles)
    
                        //         console.log('*****************')
    
                        //     if(presentLineObj.children[0].offset!==0){
                        //         presentLineObj.children.splice(0,0,noteTxtContent.slice(0,presentLineObj.children[0].offset))
                        //         console.log('*****************')
                        //         console.log(presentLineObj.children[0])
                        //     }
                        //     if(presentLineObj.children[i].offset===0){
                                
                        //     }
                        // console.log(item.inlineStyles[i].offset)
                            // 判断两带样式元素间有无空袭
                            // console.log(item.inlineStyles[i+1].offset-item.inlineStyles[i].offset-item.inlineStyles[i].length)
                            console.log(noteTxtContent.length)
                            if(i<item.inlineStyles.length-1){
    
                                if((item.inlineStyles[i+1].offset-item.inlineStyles[i].length-item.inlineStyles[i].offset)>0){
                                    console.log(item.inlineStyles[i+1].offset-item.inlineStyles[i].length-item.inlineStyles[i].offset)
                                    console.log(presentLineObj.children)
                                    // 匹配定位children中的位置
                                    let insertLoc
                                    presentLineObj.children.map((children,index)=>{
                                        if(children.offset === item.inlineStyles[i].offset){
                                            insertLoc = index + 1
                                        }
                                    })
                                    console.log(insertLoc)
                                    presentLineObj.children.splice(
                                        insertLoc,
                                        0,
                                        noteTxtContent.slice(
                                            item.inlineStyles[i].offset+item.inlineStyles[i].length,
                                            item.inlineStyles[i+1].offset
                                        )
                                    )
                                }
                            }
                        }
    
                        // 末尾不带样式处理
                        if(noteTxtContent.length-item.inlineStyles[item.inlineStyles.length-1].offset-item.inlineStyles[item.inlineStyles.length-1].length>0){
                            // console.log(noteTxtContent.slice(
                            //     item.inlineStyles[i].offset+item.inlineStyles[i].length,
                            //     noteTxtContent.length
                            // ))
                            // console.log(item.inlineStyles[i])
                            // let insertLoc
                            // presentLineObj.children.map((children,index)=>{
                            //     if(children.offset === item.inlineStyles[i].offset){
                            //         insertLoc = index + 1
                            //     }
                            // })
                            presentLineObj.children.splice(
                                item.inlineStyles[item.inlineStyles.length-1].offset+item.inlineStyles[item.inlineStyles.length-1].length,
                                0,
                                noteTxtContent.slice(
                                    item.inlineStyles[item.inlineStyles.length-1].offset+item.inlineStyles[item.inlineStyles.length-1].length,
                                    noteTxtContent.length
                                )
                            )
                        }
                    }
                    if(presentLineObj.children[0].length===0){
                        console.log(presentLineObj.tag)
                        presentLineObj.tag = 'br'
                    }
                    // console.log(noteTxtContent)
                    console.log(presentLineObj)
                    editorNoteContent.push(presentLineObj)
                }
                if(item.type==='image'){
                    let presentLineObj = {
                        tag: "img",
                        attrs: [
                            { name: "src", value: item.src },
                        ],
                    }
                    editorNoteContent.push(presentLineObj)
                }
                editor.txt.setJSON([...editorNoteContent]);
                
            })
            // globalEditor.txt.setJSON([...editorNoteContent])
        })()
            // 富文本获取内容 转 接口符合数据
            editor.config.onchange = debounce(
                function () {
                    console.log(editor.txt.getJSON())
                    const noteJSON = editor.txt.getJSON()
                    const noteItems = []
                    noteJSON.map(item=>{
                        const presentLIne = new Object
                        presentLIne.content = ''
                        presentLIne.src = ''
                        presentLIne.type = 'text'
                        presentLIne.inlineStyles = []
                            // 将笔记内容和样式转换为接口匹配的对象
                        function reverseNoteJson (noteItem,flag){
                            // console.log(i++)
                            console.log(noteItem)
                            noteItem.children.map(noteContent=>{
                                    // 这里一定要用这种特殊符号才行
                                    if(noteContent!=="​"&&noteContent.tag!=='br'&&noteContent!==undefined){
                                        // 存在样式
                                        if(noteContent.tag!==undefined&&noteContent.children[0].tag!=='br'){
                                            // console.log(presentLIne.content)
                                            // console.log(presentLIne.content.length)
                                            // console.log(presentLIne.content.indexOf("​"))
                                            console.log(noteContent.children[0])
                                            const presentStyle = {
                                                inlineType:'',
                                                length:noteContent.children[0].length,  //当前带样式笔记长度
                                                offset:presentLIne.content.length //之前笔记的长度
                                            }
                                            if(noteContent.children[0].length!==0){
                                                if(noteContent.children[0].indexOf("​")!==-1){
                                                    presentStyle.length = noteContent.children[0].length - 1
                                                }
                                            }
                                            // console.log(presentLIne.content)
                                            // console.log(presentLIne.content.length)
                                            console.log(noteItem.children[0])
                                            
                                            switch (noteContent.tag) {
                                                case 'b':
                                                    presentStyle.inlineType = 'bold'
                                                    break;
                                                case 'i':
                                                    presentStyle.inlineType = 'italic'
                                                    break;
                                                case 'u':
                                                    presentStyle.inlineType = 'underline'
                                                    break;
                                                case 'strike':
                                                    presentStyle.inlineType = 'strike_through'
                                                    break;
                                                default:
                                                    presentStyle.inlineType = 'bold'
                                                    break;
                                            }
                                            // console.log(noteContent.children)
                                            noteContent.children.map(item=>{
                                                console.log(item)
                                                if(item!=="​"&&noteContent.children&&noteContent.children.length!==0&&item.tag!=='br'){
                                                
                                                    console.log(item)
                                                    // true用于给下次递归传递信号 用于无样式判断
                                                    
                                                    const newstr = item.split('')
                                                    // 拼接时会出现隐藏符号去除后拼接
                                                    // 去除不可见字符
                                                    const strArr = []
                                                    newstr.map(item=>{
                                                        if(item!=="​"){
                                                            strArr.push(item)
                                                        }
                                                    })
                                                    presentLIne.content += strArr.join('')
                                                    console.log(presentLIne.content.indexOf("​"))
                                                    reverseNoteJson(noteContent,true)

                                                }
                                            })
                                            // console.log(noteContent.children)
                                            presentLIne.inlineStyles.push(presentStyle)
                                            // 递归遍历子节点
                                        }
                                        else{
                                            // 不带样式纯文本
                                            if(flag!==true&&noteContent!=="​"){
                                            // console.log(presentLIne.content)
                                                    // 同理，解决偏移量问题
                                                    // console.log(noteContent.indexOf("​"))    
                                                    console.log(noteContent)
                                                    if(noteContent.split){
                                                        const newstr = noteContent.split('')
                                                        const strArr = []
                                                        newstr.map(item=>{
                                                            if(item!=="​"){
                                                                strArr.push(item)
                                                            }
                                                        })
                                                        presentLIne.content += strArr.join('')
                                                    }
                                                // console.log(noteContent)
                                                return
                                            }
                                        }

                                    }
                                
                            })
                        }
                        reverseNoteJson(item)
                        console.log(presentLIne)
                        noteItems.push(presentLIne)
                        // console.log(presentLIne.content.indexOf("​"))
                        // console.log(presentLIne.content.length)
                        // console.log(presentLIne.content.split(''))
                        // console.log(noteItems)
                    })
                    console.log(JSON.stringify(noteItems))
                    api.post('/v1/note/set',{
                        id,
                        noteItems:noteItems,
                        files:[]
                    })
                    .then(res=>{
                        console.log(res)
                    })
                    
                },
                1000 //防抖，间隔5s上传
            );
            editor.config.zIndex = 0
            // editor.txt.setJSON([...])
            editor.config.linkImgCallback = function (src,alt,href) {
                
            }
            
            editor.create();
            // dispatch(storageEditor(editor))
            return(()=>{
                editor.destroy();
                editor = null;
            })
            
        // console.log (window.keyboard.height) 
    },[])
    
    // 还原状态
    const reduction = ()=>{
        setPullUpNotice(false)
    }
    // 添加照片
    // const addPic = ()=>{
    //     // document.getElementById('text-container').blur()
    //     setPullUpNotice(true)
    // }
    // const addRecording = ()=>{
    //     PubSub.publish('flag',{flag:true})
    // }
    
    // const addList = ()=>{
    //     // globalEditor.cmd.do('insertHTML', `<li></li><br/>`)
    // }
    // const setStyle = ()=>{

    // }
  return (
    <div>
        <Mask flag={pullUpNotice} reduction={reduction}></Mask>
        {/* 录音组件 */}
        {/* <Recording></Recording> */}
        <div className="note-container">
            <div className="note-outer">
                <div className="editor-outer">
                    <div id="toolbar-container" className='toolbar'></div>
                    {/* <div id="text-container" className='text' onFocus={keyboardFocus} onBlur={keyboardBlur} style={textStyle}></div> */}
                    {/* <div id="text-container" className='text' onFocus={keyboardFocus} onBlur={keyboardBlur}></div> */}
                    <div id="text-container" className='text' onChange={iptChange}></div>


                </div>
                {/* <div className="note-tool-outer" style={stickKeyboard}>
                    <div className="note-tool">
                        <div className="note-tool-item" onClick={addRecording}>
                            <img src="https://s4.ax1x.com/2022/01/20/7cAbTA.png" alt="err" className='note-tool-item-pic'/>
                            <span>语言</span>
                        </div>
                        <div className="note-tool-item" onClick={addPic}>
                            <img src="https://s4.ax1x.com/2022/01/20/7cEOHJ.png" alt="err" className='note-tool-item-pic'/>
                            <span>图片</span>
                        </div>
                        <div className="note-tool-item" onClick={addList}>
                            <img src="https://s4.ax1x.com/2022/01/20/7cV9gK.png" alt="err" className='note-tool-item-pic'/>
                            <span>列表</span>
                        </div>
                        <div className="note-tool-item" onClick={setStyle}>
                            <img src="https://s4.ax1x.com/2022/01/20/7cVtCq.png" alt="err" className='note-tool-item-pic'/>
                            <span>样式</span>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    </div>
  );
}
