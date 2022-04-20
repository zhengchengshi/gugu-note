import axios from 'axios'
const baseUrl = 'https://ggnote-dev.g2y.top'

const api = {
    get(url,data){
        const token = `${localStorage.getItem('token_id')}`
        if(data){
            return axios({
                method:'GET',
                url:baseUrl+url+'?'+data,
                headers:{Authorization:token}
            })

        }
        else{
            return axios({
                method:'GET',
                url:baseUrl+url,
                headers:{Authorization:token}
            })
        }
    },
    post(url,data){
        const token = `${localStorage.getItem('token_id')}`
        if(data){
            return axios({
                method:'post',
                url:baseUrl+url+'?'+data,
                data:data,
                headers:{authorization:token}
            })
        }
        else{
            return axios({
                method:'post',
                url:baseUrl+url,
                headers:{Authorization:token}
            })
        }
        
    },
    put(url){
        const token = `${localStorage.getItem('token_id')}`
        return axios({
            method:'PUT',
            url:baseUrl+url,
            headers:{Authorization:token}
        })
    }
}
export default api