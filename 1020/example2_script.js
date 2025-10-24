// example2_script.js
// 變數宣告與基本型態操作

var text = '123';              // 字串
var num = 45;                  // 數字
var isPass = true;             // 布林
var emptyValue = null;         // 空值
var notAssigned;               // undefined（尚未指定）

// 型態檢查
var lines = '';
lines += 'text = ' + text + '，typeof: ' + (typeof text) + '\n';
lines += 'num = ' + num + '，typeof: ' + (typeof num) + '\n';
lines += 'isPass = ' + isPass + '，typeof: ' + (typeof isPass) + '\n';
lines += 'emptyValue = ' + emptyValue + '，typeof: ' + (typeof emptyValue) + '\n';
lines += 'notAssigned = ' + notAssigned + '，typeof: ' + (typeof notAssigned) + '\n\n';

// 轉型
var textToNumber = parseInt(text, 10); // 將 '123' → 123
lines += 'parseInt(\'123\') = ' + textToNumber + '\n';
lines += 'String(45) = ' + String(num) + '\n';


// 延伸練習：從使用者輸入兩個數字並計算其和
var a = prompt('請輸入第一個數字：');
var b = prompt('請輸入第二個數字：');

var numA = parseFloat(a);
var numB = parseFloat(b);

if (isNaN(numA) || isNaN(numB)) {
  lines += '\n延伸練習：請輸入有效數字！';
} else {
  var sum = numA + numB;
  lines += '\n延伸練習：' + numA + ' + ' + numB + ' = ' + sum;
}

document.getElementById('result').textContent = lines;