// practice6_dynamic_fields.js
// 動態新增報名欄位並整合事件委派、即時驗證與送出攔截

const form = document.getElementById('dynamic-form');
const list = document.getElementById('participant-list');
const addBtn = document.getElementById('add-participant');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const countLabel = document.getElementById('count');

const maxParticipants = 5;
let participantIndex = 0;

function createParticipantCard() {
  const index = participantIndex++;
  const wrapper = document.createElement('div');
  wrapper.className = 'participant card border-0 shadow-sm';
  wrapper.dataset.index = index;
  wrapper.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <h5 class="card-title mb-0">參與者 ${index + 1}</h5>
        <button type="button" class="btn btn-sm btn-outline-danger" data-action="remove">移除</button>
      </div>
      <div class="mb-3">
        <label class="form-label" for="name-${index}">姓名</label>
        <input id="name-${index}" name="name-${index}" class="form-control" type="text" required aria-describedby="name-${index}-error">
        <p id="name-${index}-error" class="text-danger small mb-0" aria-live="polite"></p>
      </div>
      <div class="mb-0">
        <label class="form-label" for="email-${index}">Email</label>
        <input id="email-${index}" name="email-${index}" class="form-control" type="email" required aria-describedby="email-${index}-error" inputmode="email">
        <p id="email-${index}-error" class="text-danger small mb-0" aria-live="polite"></p>
      </div>
    </div>
  `;
  return wrapper;
}

function updateCount() {
  countLabel.textContent = list.children.length;
  addBtn.disabled = list.children.length >= maxParticipants;
}

function setError(input, message) {
  const error = document.getElementById(`${input.id}-error`);
  input.setCustomValidity(message);
  error.textContent = message;
  if (message) {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
  }
}

function validateInput(input) {
  const value = input.value.trim();
  if (!value) {
    setError(input, '此欄位必填');
    return false;
  }
  if (input.type === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      setError(input, 'Email 格式不正確');
      return false;
    }
  }
  setError(input, '');
  return true;
}

function handleAddParticipant() {
  if (list.children.length >= maxParticipants) {
    return;
  }
  const participant = createParticipantCard();
  list.appendChild(participant);
  updateCount();
  participant.querySelector('input').focus();
}

addBtn.addEventListener('click', handleAddParticipant);

list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action="remove"]');
  if (!button) {
    return;
  }
  const participant = button.closest('.participant');
  participant?.remove();
  updateCount();
});

list.addEventListener('blur', (event) => {
  if (event.target.matches('input')) {
    validateInput(event.target);
  }
}, true);

list.addEventListener('input', (event) => {
  if (event.target.matches('input')) {
    const wasInvalid = event.target.validationMessage;
    if (wasInvalid) {
      validateInput(event.target);
    }
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (list.children.length === 0) {
    alert('請至少新增一位參與者');
    handleAddParticipant();
    return;
  }

  let firstInvalid = null;
  list.querySelectorAll('input').forEach((input) => {
    const valid = validateInput(input);
    if (!valid && !firstInvalid) {
      firstInvalid = input;
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';
  await new Promise((resolve) => setTimeout(resolve, 1000));
  alert('表單已送出！');
  form.reset();
  list.innerHTML = '';
  participantIndex = 0;
  updateCount();
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

resetBtn.addEventListener('click', () => {
  form.reset();
  list.innerHTML = '';
  participantIndex = 0;
  updateCount();
});

// 預設新增一筆，方便學生立即觀察互動
handleAddParticipant();
(function () {
  // 等 DOM 準備好再啟動
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  function boot() {
    const form = document.getElementById('dynamic-form');
    const list = document.getElementById('participant-list');
    const addBtn = document.getElementById('add-participant');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-btn');
    const countLabel = document.getElementById('count');
    const maxParticipants = 5;

    if (!form || !list) return; // 安全防護

    // 以補丁方式注入 CSS（強化 invalid 視覺）
    injectPatchStyle(`
      .form-control.is-invalid { border-width: 2px; }
      .participant.card { border-radius: .75rem; }
    `);

    // —— 工具函式 —— //
    function updateCountAndLimit() {
      if (countLabel) countLabel.textContent = String(list.children.length);
      if (addBtn) addBtn.disabled = list.children.length >= maxParticipants;
    }

    function setError(input, message) {
      const error = document.getElementById(`${input.id}-error`);
      if (typeof input.setCustomValidity === 'function') {
        input.setCustomValidity(message || '');
      }
      if (error) error.textContent = message || '';
      input.classList.toggle('is-invalid', Boolean(message));
    }

    function validateInput(input) {
      const value = (input.value || '').trim();
      if (!value) {
        setError(input, '此欄位必填');
        return false;
      }
      if (input.type === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          setError(input, 'Email 格式不正確');
          return false;
        }
      }
      setError(input, '');
      return true;
    }

    function collectInputs() {
      return Array.from(list.querySelectorAll('input'));
    }

    function firstInvalidInput() {
      for (const input of collectInputs()) {
        if (!validateInput(input)) return input;
      }
      return null;
    }

    // —— 事件委派：移除參與者 —— //
    list.addEventListener('click', (evt) => {
      const btn = evt.target.closest('[data-action="remove"]');
      if (!btn) return;
      const card = btn.closest('.participant');
      card?.remove();
      renumberTitles();
      updateCountAndLimit();
    });

    // —— 即時驗證：blur（離開焦點就檢查） —— //
    list.addEventListener(
      'blur',
      (evt) => {
        if (!(evt.target instanceof HTMLInputElement)) return;
        validateInput(evt.target);
      },
      true // 用捕獲，確保新節點也能被監聽到
    );

    // —— 即時驗證：input（只有之前是 invalid 才即時清除） —— //
    list.addEventListener('input', (evt) => {
      if (!(evt.target instanceof HTMLInputElement)) return;
      if (evt.target.validationMessage || evt.target.classList.contains('is-invalid')) {
        validateInput(evt.target);
      }
    });

    // —— 送出攔截（總體檢查 + 聚焦第一錯誤 + 防重送） —— //
    form.addEventListener(
      'submit',
      async (evt) => {
        // 確保至少一組
        if (list.children.length === 0) {
          evt.preventDefault();
          alert('請至少新增一位參與者');
          // 若有新增按鈕則引導使用者
          addBtn?.focus();
          return;
        }

        // 驗證所有欄位
        const bad = firstInvalidInput();
        if (bad) {
          evt.preventDefault();
          // 阻擋後續 submit listener（避免原始碼也彈錯誤/重置）
          if (typeof evt.stopImmediatePropagation === 'function') {
            evt.stopImmediatePropagation();
          } else {
            evt.stopPropagation();
          }
          bad.focus();
          return;
        }

        // 防重送 UX（不干涉原先提交流程，只加停用效果）
        freezeButtons(true);
        setSubmitText('送出中...');

        // 若原始碼使用 preventDefault 模擬送出，你仍會看到停用狀態
        // 我們在 1.2 秒還原 UI（比一般 1 秒多一點點，避免搶 UI）
        setTimeout(() => {
          freezeButtons(false);
          setSubmitText('送出');
        }, 1200);
      },
      true // 用捕獲：我們先跑，若無效就擋掉原始 submit listener
    );

    // —— 監聽 Reset（協助還原按鈕狀態與計數） —— //
    resetBtn?.addEventListener('click', () => {
      // 若原碼本就清空區塊，這裡只做 UI 邏輯的還原
      setTimeout(() => {
        renumberTitles();
        updateCountAndLimit();
        freezeButtons(false);
        setSubmitText('送出');
      });
    });

    // —— 監看參與者列表 DOM 變化（新增/刪除自動更新計數與編號） —— //
    const mo = new MutationObserver((mutations) => {
      let changed = false;
      for (const m of mutations) {
        if (m.type === 'childList') changed = true;
      }
      if (changed) {
        renumberTitles();
        updateCountAndLimit();
      }
    });
    mo.observe(list, { childList: true });

    // —— 在新增按鈕上加一層保護：超過上限就阻擋（不改原函式） —— //
    addBtn?.addEventListener(
      'click',
      (evt) => {
        if (list.children.length >= maxParticipants) {
          evt.preventDefault();
          evt.stopPropagation(); // 阻擋原始碼繼續新增
          shake(addBtn); // 小動畫提示
        }
      },
      true // 捕獲：先擋，再讓原本的 click handler 有沒有執行都無所謂
    );

    // —— 啟動時做一次同步 —— //
    renumberTitles();
    updateCountAndLimit();
    freezeButtons(false);

    // ====== 小工具區 ====== //
    function renumberTitles() {
      const cards = list.querySelectorAll('.participant');
      cards.forEach((card, i) => {
        const title = card.querySelector('.card-title');
        if (title) title.textContent = `參與者 ${i + 1}`;
        const removeBtn = card.querySelector('[data-action="remove"]');
        if (removeBtn) removeBtn.setAttribute('aria-label', `移除參與者 ${i + 1}`);
      });
    }

    function freezeButtons(state) {
      [submitBtn, addBtn, resetBtn].forEach((b) => b && (b.disabled = !!state));
    }

    function setSubmitText(text) {
      if (submitBtn) submitBtn.textContent = text;
    }

    function injectPatchStyle(cssText) {
      const style = document.createElement('style');
      style.setAttribute('data-from', 'practice6-addon');
      style.textContent = cssText;
      document.head.appendChild(style);
    }

    function shake(el) {
      if (!el) return;
      el.style.transition = 'transform .12s';
      el.style.transform = 'translateX(-3px)';
      setTimeout(() => (el.style.transform = 'translateX(3px)'), 120);
      setTimeout(() => (el.style.transform = 'translateX(0)'), 240);
    }
  }
})();