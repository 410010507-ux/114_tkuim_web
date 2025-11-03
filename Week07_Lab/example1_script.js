// example1_script.js
// 統一在父層監聽點擊與送出事件，處理清單項目新增/刪除

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = input.value.trim();
  if (!value) {
    return;
  }
  const item = document.createElement('li');
  item.className = 'list-group-item d-flex justify-content-between align-items-center';
  item.innerHTML = `${value} <button class="btn btn-sm btn-outline-danger" data-action="remove">刪除</button>`;
  list.appendChild(item);
  input.value = '';
  input.focus();
});

list.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action="remove"]');
  if (!target) {
    return;
  }
  const item = target.closest('li');
  if (item) {
    item.remove();
  }
});
document.querySelectorAll('#todo-list li').forEach(li => {
  if (!li.querySelector('[data-action="toggle"]')) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-outline-success';
    btn.dataset.action = 'toggle';
    btn.textContent = '完成';
    li.querySelector('.btn-outline-danger').before(btn);
  }
});

document.getElementById('todo-list').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action="toggle"]');
  if (!btn) return;

  const li = btn.closest('li');
  const done = li.classList.toggle('list-group-item-success');
  btn.textContent = done ? '復原' : '完成';
});

input.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    form.requestSubmit();
  }
});
