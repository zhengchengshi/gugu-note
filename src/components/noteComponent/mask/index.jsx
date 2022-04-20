import React, { useState,useEffect } from 'react';
import './index.scss'
// import { useSelector } from 'react-redux';
// import {selectEditor} from '../../../pages/note/editorSlice'
import photo from '../../../utils/photo'
export default function Mask(props) {
  const [noticeStyle,setNoticeStyle] = useState({});
  const [modalStyle,setModalStyle] = useState({display:'none'});
  const [cameraStyle,setCameraStyle] = useState({display:"none"})
  // const globalEditor = useSelector(selectEditor);
  const  cancelMask = ()=>{
    setNoticeStyle({animation:'slideOut 0.5s',animationFillMode:'forwards'})
    setTimeout(()=>{
      setModalStyle({display:'none'})
      props.reduction()
    },600)
  }
  const startPhoto = ()=>{
    photo.openMedia();
    setCameraStyle({})
    // photo.takePhoto()
  }
  useEffect(()=>{
    // console.log(props.flag)
    if(props.flag){
      setModalStyle({})
      setNoticeStyle({animation:'slideIn 0.5s'})
    }
  },[props])
  
  const cancel = ()=>{
    cancelMask()
  }
  const addPic = ()=>{
      // let url = 'https://s4.ax1x.com/2022/01/22/7ftToQ.png'
      // globalEditor.cmd.do('insertHTML', `<img src=${url}></img>`)
      // cancelMask()
  }
  return (
    <div>
        <div className="modal-container" style={modalStyle}>
            <div className="modal-outer" onClick={cancel}/>
            <div className="modal-notice" style={noticeStyle}>
                <span className='modal-notice-item'>添加图片</span>
                {/* <input id="takepicture" type="file" accept="image/*" capture="camera" style="display: none"></input> */}
                <span className='modal-notice-item' onClick={startPhoto}>拍摄照片</span>
                <span className='modal-notice-item' onClick={addPic}>从相册中选取</span>
                <span className='modal-notice-item' onClick={cancel}>取消</span>
            </div>
        </div>
        <div className="video_outer" style={cameraStyle}>
          <div className="video">
            <video id="video"></video>
          </div>
          <button>拍照</button>
        </div>
    </div>
  );
}
