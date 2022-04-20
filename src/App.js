import React, { useEffect } from 'react';
import Note from './pages/note'
import Homepage from './pages/homepage'
import AddTag from './pages/addTag'
import Search from './pages/search'
import Result from './pages/search-result'
import ManageTag from './pages/manageTag'
import RecycleBin from './pages/recycleBin';
import {Route,Switch,Redirect} from 'react-router-dom'
import axios from 'axios';
import api from './service/api';
import './App.scss'
import testImg from './test.jpg'
export default function App() {
  // 组件挂载时，使用refreshtoken换取token
  useEffect(()=>{
    // 添加置顶标签
      api.post('/v1/tag/add',{tagName:'置顶'})
        .then(res=>{
          console.log(res)
        })
      axios({
          headers: {
              'Content-Type':'application/json'
            },
          method:'Post',
          url:'https://ggnote-dev.g2y.top/auth/refresh-token',
          data:JSON.stringify({refreshToken:"DSdTHtWKJWYFcxmPELzg"})
      }).then((res)=>{
        // console.log(res.data)
        localStorage.setItem('token_id',res.data.token)
      })

  },[])
  return( 
  <div>
    <Switch>
        <Route component={Homepage} path="/homepage"></Route>
        <Route component={AddTag} path='/add-tag'></Route>
        <Route component={Search} path='/search'></Route>
        <Route component={Result} path="/search-result"></Route>
        <Route component={ManageTag} path='/manage-tag'></Route>
        <Route component={Note} path='/note'></Route>
        <Route component={RecycleBin} path='/recyclebin'></Route>
        <Redirect to="/homepage"></Redirect>

        {/* <Route component={Note} path="/note"></Route> */}
    </Switch>
  </div>
   );
}
