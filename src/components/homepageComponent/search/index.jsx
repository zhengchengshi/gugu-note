import React from 'react';
import { useHistory } from 'react-router-dom';
import './index.scss'
export default function Search() {
    const history = useHistory();
    const goSearch = ()=>{
        history.push('/search')
    }
    return (
        <div>
            <div className="homepage-search-outer">
                <div className="homepage-search" onClick={goSearch}>
                    <img src="https://s4.ax1x.com/2022/01/27/7XwggA.png" alt="err" className='homepage-search-img'/>
                    <span>搜索</span>
                </div>
            </div>
        </div>
    );
}
