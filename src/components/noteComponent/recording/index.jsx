import React,{useState} from 'react';
import './index.scss'
import PubSub from 'pubsub-js';
import Recorder from 'js-audio-recorder';
import { useEffect } from 'react';
// import { storageRecorder,selectRecording } from './recordingSlice';
// import {selectEditor} from '../../../pages/note/editorSlice'
// import { useSelector,useDispatch } from 'react-redux';

const recorder = new Recorder({
    sampleBits: 16, 
    sampleRate: 16000, 
    numChannels: 1
});
export default function Recording() {
    const [recordingStyle,setRecordingStyle] = useState({display:'none'})
    // const dispatch = useDispatch()
    // const globalEditor = useSelector(selectEditor)
    const recording = ()=>{
        recorder.start().then(() => {
            // 开始录音
            console.log('开始录音了=========')
        }, (error) => {
            // 出错了
            alert(`${error.name} : ${error.message}`);
        });
    }
    const endRecording = () =>{
        console.log('录音结束')
        recorder.stop();
        // const node = { type: 'paragraph', children: [{ text: 'simple text' }] }
        // globalEditor.cmd.do('insertHTML', `<img src="https://s4.ax1x.com/2022/01/26/7LuCVK.png" id="test">   </img>`)
        // console.log()
        document.querySelector('#test').style.cssText="width:330px;height:34px"
        // globalEditor.selection.getSelectionContainerElem().elems[0].style.cssText="background-color:pink;width:50px;height:30px"
        // console.log(globalEditor.selection.getSelectionEndElem())
        // globalEditor.insertNode(node)
        // 为音频添加绑定事件
        // globalEditor.selection.getSelectionContainerElem().elems[0].addEventListener('click',()=>{
        //     let wavBlob = recorder.getWAVBlob()
        //     let renameFile =new File([wavBlob], 'test.wav', { type: 'audio/wav' })
        //     // alert(renameFile)
        //     recorder.play();
        //     console.log(renameFile)
        //     console.log(globalEditor.config)
        // })
        // globalEditor.txt.eventHooks.clickEvents.push(()=>{
        //     alert('hello')
        // })

        // console.log(globalEditor.selection.getSelectionEndElem())
        // 
        // console.log()
        
    }
    
    useEffect(()=>{
        // dispatch(storageRecorder(recorder))
    },[])
    useEffect(()=>{
        PubSub.subscribe('flag',(msg,data)=>{
            if(data){
                setRecordingStyle({})
            }
        })
    },[])
    const cancel = ()=>{
        setRecordingStyle({display:'none'})
    }
  return (
  <div>
      <div className="recording-container" style={recordingStyle}>
          {/* <div id='test' onClick={test}>测试</div> */}
        <div className="recording-outer">
            <div className="recording-back"><img src="https://s4.ax1x.com/2022/01/22/7fqLV0.png" alt="err" id="recording-back-btn" onClick={cancel}/></div>
            <div className="recording-content">
                <span>按住说话</span>
                <div onTouchStart={recording} onTouchEnd={endRecording} id="virtual-btn"/>
                <div className="recording-btn">
                    <img src="https://s4.ax1x.com/2022/01/22/7fXD8U.png" alt="err" id='recording-btn-icon'/>
                </div>
            </div>

        </div>
      </div>
  </div>
  );
}

