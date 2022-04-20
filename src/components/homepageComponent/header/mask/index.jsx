import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './index.scss'
export default function Mask(props) {
    const [controlPresent,setControlPresent] = useState('hidden')
    useEffect(()=>{
        if(props.settingFlag){
            setControlPresent('header-mask-outer')
        }
    },[props])
    const cancelMask = ()=>{
        setControlPresent('hidden')
        props.setFlagFn()
    }
    return (
    <div>
        <div className={controlPresent}>
            <div className="header-mask" onClick={cancelMask}/>
            <div className="header-mask-toolbar">
                <div className='header-mask-toolbar-first-line'>
                    <span>我的VIP</span>
                </div>
                <div className='header-mask-toolbar-second-line'>
                    <span>设置</span>
                </div>
            </div>
        </div>
    </div>
    );
}
