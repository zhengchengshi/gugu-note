// 查找某个字符串出现的位置
// 第一个参数为查找的字符串，第二个参数为要查的字符，第三个参数为查的第几个（从0开始）
function find(str,cha,num){
    let x=str.indexOf(cha);
    for(let i=0;i<num;i++){
        x=str.indexOf(cha,x+1);
    }
    return x;
}
export default find;