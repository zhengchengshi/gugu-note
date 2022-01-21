import React,{useEffect,useState,useRef} from 'react';
import tinymce from "tinymce/tinymce";
import './index.scss'
import E from 'wangeditor'
import getKeyboardHeight from '../../utils/getKeyboardHeight'
// 
// const editor = new E(document.getElementById('#editor'),"#text-container")
// const editor = new E(document.querySelector("#editor"));
// import { Editor } from '@tinymce/tinymce-react';
// const editorObj={
    //     height: '100vh',
    //     width:'100%',
    //     // language: 'zh_CN',
    //     // language_url : '翻译中文的路径，我尝试很多种方法都不成功，最后叫后台的老哥放进项目的服务器上了，用的线上地址',
    //     plugins: 'table lists link image preview code ',
    //     // quickbars_insert_toolbar: 'quickimage',
    //     toolbar: `undo redo image`,
    //     relative_urls: false,
    //     file_picker_types: 'image',
    //     // images_upload_url: {'上传图片的路径'},
    //     image_advtab: true,
    //     image_u0--ploadtab: true,
    //     statusbar: false,
    //     images_upload_handler:(blobInfo, success, failure)=>{
        //             //这里写你上传图片的方法
        //     }
        //     // selector: 'div.tinymce',
        //     // plugins: [ 'quickbars' ],
        //     // toolbar: false,
        //     // menubar: false,
        //     // inline: true
        // }
export default function Note() {
    // let keyBoardHeight = getKeyboardHeight()
    
    const [stickKeyboard,setStickKeyboard] = useState({})
    const [viewport, setViewport] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [keyboardHeight,setKeyboardHeight] = useState(0)
    const [textStyle,setTextStyle] = useState({})
    let arr = []
    useEffect(() => {
        const handler = () => {
            arr.push(window.visualViewport.height)
            let res = Math.min(...arr)
            // alert(res)
            setKeyboardHeight(res)
            if (!window.visualViewport) return
            setViewport({
            width: window.visualViewport.width,
            height: window.visualViewport.height,
            });
        };

        window.visualViewport.addEventListener("resize", handler);
        // window.visualViewport.addEventListener("scroll", handler);

        return () => {
            window.visualViewport.removeEventListener("resize", handler);
            // window.visualViewport.removeEventListener("scroll", handler);
        };
    }, []);
    // alert(viewport.height)
    // const [keyboardHeight,setKeyboardHeight] = useState(0)
    // alert(keyBoardHeight.height)
    
    const keyboardFocus = ()=>{
        // alert('')
        setStickKeyboard({bottom:`${keyboardHeight}px`})
        if(keyboardHeight-60>0){

            setTextStyle({height:keyboardHeight-60+'px'})
        }
    }
    
    const keyboardBlur =()=>{

        setStickKeyboard({bottom:`0px`})
        setTextStyle({height:'97vh'})
    }
    useEffect(()=>{
        // alert(window.visualViewport.height-keyboardHeight)
        setStickKeyboard({bottom:`${keyboardHeight}px`})
        setTextStyle({height:keyboardHeight-60+'px'})
    },[keyboardHeight])
    // 
    // alert(keyBoardHeight.height)
    useEffect(()=>{
        // getKeyboardHeight()
        // alert(keyBoardHeight.height)
            const editor = new E('#toolbar-container', '#text-container');
            editor.config.placeholder = ''
            editor.config.focus = false
            editor.config.menus = [
                'undo',
                'redo',
            ]
            editor.config.zIndex = 0
            editor.create();
        // console.log (window.keyboard.height) 
    },[])
    // editor.create()
    // tinymce.init({
    //     selector: '#mytextarea',
    //     // toolbar: false,
    //     // inline: true
    // });
    // const [content,setContent] = useState('')
    // function getWindowInfo(){
    //     const windowInfo = {
    //         hight: window.innerHeight
    //     }
    //     setTimeout(()=>{
    //         console.log(windowInfo);
    //     },3000)
    // }
    // useEffect(()=>{
    //     window.addEventListener('resize', getWindowInfo);
    //     // alert(window.innerHeight)
    //     console.log(window.innerHeight)
    // },[])
    // function getKeyboardHeight(e){
    //     // console.log(tinymce.activeEditor.getContent())
    // }
    // const changeContent = ()=>{
    //     setContent(tinymce.activeEditor.getContent())
    //     console.log(content)
    // }
    // console.log(document.querySelector('#mytextarea_ifr'))
    
    // const editor = useRef()
    // console.log(editor.current)
  return (
    <div>
        <div className="note-container">
            <div className="note-outer">
                <div className="editor-outer">
                    <div id="toolbar-container" className='toolbar'></div>
                    <div id="text-container" className='text' onFocus={keyboardFocus} onBlur={keyboardBlur} style={textStyle}></div>

                    {/* <Editor
                        onChange={changeContent}
                        id='mytextarea'
                        inline={false}
                        selector='#mytextarea'  // 选择器
                        // apiKey='官网上申请的key值'
                        // initialValue={editorState}
                        // onFocus={getKeyboardHeight}
                        init={{...editorObj}}
                        ref={editor}
                        // onEditorChange={this.handleEditorChange}
                    /> */}
                </div>
                <div className="note-tool-outer" style={stickKeyboard}>
                    <div className="note-tool">
                        <div className="note-tool-item">
                            <img src="https://s4.ax1x.com/2022/01/20/7cAbTA.png" alt="err" className='note-tool-item-pic'/>
                            <span>语言</span>
                        </div>
                        <div className="note-tool-item">
                            <img src="https://s4.ax1x.com/2022/01/20/7cEOHJ.png" alt="err" className='note-tool-item-pic'/>
                            <span>图片</span>
                        </div>
                        <div className="note-tool-item">
                            <img src="https://s4.ax1x.com/2022/01/20/7cV9gK.png" alt="err" className='note-tool-item-pic'/>
                            <span>列表</span>
                        </div>
                        <div className="note-tool-item">
                            <img src="https://s4.ax1x.com/2022/01/20/7cVtCq.png" alt="err" className='note-tool-item-pic'/>
                            <span>样式</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
