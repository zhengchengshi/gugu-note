function timestampToTime(timestamp) {
    const presentD = new Date().getDate()
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    if(m<10){
        m = '0' + date.getMinutes();
    }
    if(presentD-D===0){
        return '今天'+ ' ' + h + ':' + m;
    }
    if(presentD-D===1){
        return '昨天'+ ' ' + h + ':' + m;
    }
    if(presentD-D===2){
        return '前天'+ ' ' + h + ':' + m;
    }
    else{
        return Y + '-' + M + '-' + D + ' ' + h + ':' + m;
    }
}
export default timestampToTime;