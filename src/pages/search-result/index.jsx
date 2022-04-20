import React from 'react';
import DisplayContent from '../../components/homepageComponent/displayContent';
import SearchHeader from '../../components/searchComponent/header'
import GlobalMask from '../../components/homepageComponent/globalMask';
import { storageDiffFlag } from '../../components/homepageComponent/displayContent/diffFlag';
import './index.scss'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
export default function Result() {
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(storageDiffFlag(true))
    },[])
    return (
    <div>
        <div className="search-result-background">
            <GlobalMask></GlobalMask>
            <SearchHeader></SearchHeader>
            <DisplayContent></DisplayContent>
        </div>
    </div>
    );
}
