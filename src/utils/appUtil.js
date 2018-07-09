const appUtil = {
  /*将100,000.00转为100000形式*/
  undoNubmer: function (money) {
    if (money && money != null) {
      money = String(money);
      var group = money.split('.');
      var left = group[0].split(',').join('');
      return Number(left + "." + group[1]);
    } else {
      return "";
    }
  },
  /*将100000 转换为 100,000.00转为形式*/
  dealNumber: function(money, scale) {
      if (!scale || isNaN(scale) || scale < 0) {
        scale = 2;
      }
      if (money && money != null) {
        money = String(money);
        var left = money.split('.')[0], right = money.split('.')[1];
        right = right ? (right.length >= 2 ? '.' + right.substr(0, scale) : '.' + right + '0') : '.00';
        var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
        return (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
      } else if (money === 0) {   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
        return '0.00';
      } else {
        return "";
      }
    }
  }

export default appUtil
