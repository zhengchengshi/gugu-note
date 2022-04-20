import React from 'react';
import Header from '../../components/homepageComponent/header'
import Search from '../../components/homepageComponent/search'
import DisplayContent from '../../components/homepageComponent/displayContent'
import Sidebar from '../../components/homepageComponent/sidebar'
import GlobalMask from '../../components/homepageComponent/globalMask'
import './index.scss'
export default function Homepage() {
  return (
  <div>
    <div className="homepage-background">
        <GlobalMask></GlobalMask>
        <Sidebar></Sidebar>
        <Header></Header>
        <Search></Search>
        <DisplayContent></DisplayContent>
    </div>
  </div>
  );
}
