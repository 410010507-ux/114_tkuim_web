// example5_script.js
// 以巢狀 for 產生 1~9 的乘法表

var output = '';
for (var i = 1; i <= 9; i++) {
  for (var j = 1; j <= 9; j++) {
    output += i + 'x' + j + '=' + (i * j) + '\t';
  }
  output += '\n';
}

// 讓使用者自訂乘法表範圍
var startInput = prompt('請輸入起始乘數（例如 2）：');
var endInput = prompt('請輸入結束乘數（例如 5）：');

var start = parseInt(startInput, 10);
var end = parseInt(endInput, 10);

output += '\n【自訂範圍乘法表】\n';

if (isNaN(start) || isNaN(end) || start < 1 || end > 9 || start > end) {
  output += '輸入錯誤！請輸入介於 1～9 的整數，且起始 ≤ 結束。\n';
} else {
  for (var x = start; x <= end; x++) {
    for (var y = 1; y <= 9; y++) {
      output += x + 'x' + y + '=' + (x * y) + '\t';
    }
    output += '\n';
  }
}

document.getElementById('result').textContent = output;
