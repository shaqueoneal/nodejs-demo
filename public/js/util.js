/* 计算中英混合字符串实际长度，1个中文对应2个英文 */
function getStringWidth(str) {
    var width = len = str.length;
    for(var i=0; i < len; i++) {
        if(str.charCodeAt(i) >= 255) {
            width++;
        }
    }
    return width;
}

/* 设置中英混合字符串字节长度，1个中文对应2个字节，不足用空格填充，超过用...截取 */
function setStringWidth(str, len) {
  var strlen = 0;
  var s = "";
  for(var i = 0; i < str.length; i++) {
    s = s + str.charAt(i);
    if (str.charCodeAt(i) > 128) {
      strlen = strlen + 2;
      if(strlen >= len){
        return s.substring(0,s.length-1) + "...";
      }
    } 
    else {
      strlen = strlen + 1;
      if(strlen >= len){
        return s.substring(0,s.length-2) + "...";
      }
    }
  }

  if(strlen < len) {
    for (i = 0; i < len - strlen; i++) {
      s = s.concat(' ');    
    };  
  }
  
  return s;
}

function getColor(index) {
  var colors = ["#e00000"];
  return colors[index] ? colors[index] : colors[colors.length - 1]; 
}

function getHighLightColor(color) {
  var color = color.substring(1);
  color = parseInt(color, 16) + parseInt("141414", 16);

  return '#' + color.toString(16); 
}

function sendJsonData(url, type, data, cb) {
    console.log('sendJsonData' + JSON.stringify(data));

    $.ajax({
      url:      url,
      async:    true,
      dataType: "json",
      data:     data,
      type:     type,
      timeout:  12000, //12s time out
      success:  function (data) {
        console.log('receieveJsonData' + JSON.stringify(data));

      	if($.isFunction(cb)) {
      		cb(data);
      	}
      },
      error: function (xhr, status, error) {
      	alert("通信故障，请稍候再试");
        console.log('Error: ' + error.message);        
      },
	  });
}
