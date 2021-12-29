// 统计字符长度
String.prototype.getByteLen = function() {    
    var len = 0;    
    for (var i=0; i<this.length; i++) {    
      if (this.charCodeAt(i)>127 || this.charCodeAt(i)==94) {    
            len += 2;    
        } else {    
            len ++;    
        }    
    }
    return len;    
}
// 判断数组是否有重复，并返回重复的索引
Array.prototype.isRepeatEmpty = function() {
    let tempArray = [];
    let result ={
      flag: false,
      list:{}
    };
    for(var i=0;i<this.length;i++){
      if(this[i].value.match(/^[ ]*$/)){//不为空是判断
        result.list[i] = 'empty'
        result.flag = true;
      }else{
        if(tempArray.indexOf(this[i].value)>-1){
          result.list[i] = 'repeat'
          result.flag = true;
        }else{
          tempArray.push(this[i].value);
          result.list[i] = ''
        }
      }
    }
    return result
}
// 按字节截取,参数：n（字符串截取的字节长度）,l（截取前边还是后边：before/after）
// eslint-disable-next-line no-extend-native
String.prototype.getSub = function(n, l = 'after') {
  var r = /[^\x00-\xff]/g;
  var len = this.replace(r, 'mm').length;
  if (len <= n) {
    return this.toString();
  }
  if (l === 'before') {
    for (var i = this.length - 1; i >= 0; i--) {
      if (this.substr(i, this.length).replace(r, 'mm').length > n) {
        return '…' + this.substr(i + 1, this.length);
      }
    }
  } else {
    for (var i = 0; i < this.length; i++) {
      if (this.substr(0, i + 2).replace(r, 'mm').length >= n && this.substr(0, i + 1).replace(r, 'mm').length < n) {
        return this.substr(0, i + 1) + '…';
      }
    }
  }
};