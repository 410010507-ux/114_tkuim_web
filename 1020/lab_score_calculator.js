// lab_score_calculator.js
// 以 prompt 取得三科成績，計算平均與等第

function toNumber(str) {
  var n = parseFloat(str);
  return isNaN(n) ? null : n;
}

function gradeFrom(avg) {
  var g = 'F';
  if (avg >= 90) {
    g = 'A';
  } else if (avg >= 80) {
    g = 'B';
  } else if (avg >= 70) {
    g = 'C';
  } else if (avg >= 60) {
    g = 'D';
  } else {
    g = 'F';
  }
  return g;
}

function getScore(label) {
  var v = toNumber(prompt('請輸入 ' + label + ' 成績（0–100）：'));
  if (v === null || v < 0 || v > 100) return null;
  return v;
}

var name = prompt('請輸入姓名：');
if (!name) {
  name = '同學';
}

var subjects = ['國文', '英文', '數學', '自然', '社會'];
var scores = [];
for (var i = 0; i < subjects.length; i++) {
  var s = getScore(subjects[i]);
  if (s === null) {
    document.getElementById('result').textContent = '輸入有誤）。';
    console.log('輸入有誤');
    throw new Error('Invalid score');
  }
  scores.push(s);
}
var sum = 0;
var hasFail = false;
for (var j = 0; j < scores.length; j++) {
  sum += scores[j];
  if (scores[j] < 60) hasFail = true;
}
var avg = sum / scores.length;
var grade = gradeFrom(avg);

var lines = '姓名：' + name + '\n';
for (var k = 0; k < subjects.length; k++) {
  lines += subjects[k] + '：' + scores[k] + '\n';
}
lines += '平均：' + avg.toFixed(2) + '\n';
lines += '等第：' + grade + '\n';
if (hasFail) lines += '⚠ 有不及格科目\n';

console.log(lines);
document.getElementById('result').textContent = lines;