// ================================
// 驗證工具
// ================================
const $$ = (sel, root = document) => root.querySelector(sel);
const $$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
};

function setError(input, msg) {
  input.setCustomValidity(msg || "");
  const err = document.getElementById(`${input.id}-error`);
  if (err) err.textContent = msg || "";
  input.setAttribute("aria-invalid", msg ? "true" : "false");
}

function clearError(input) {
  setError(input, "");
}

function validateName(input) {
  if (!input.value.trim()) {
    setError(input, "請填寫姓名");
    return false;
  }
  clearError(input);
  return true;
}

function validateEmail(input) {
  const v = input.value.trim();
  if (!v) {
    setError(input, "請填寫Email");
    return false;
  }
  if (!patterns.email.test(v)) {
    setError(input, "Email格式不正確");
    return false;
  }
  clearError(input);
  return true;
}

function validatePhone(input) {
  const v = input.value.trim();
  if (!v) {
    setError(input, "請填寫手機號碼");
    return false;
  }
  if (!patterns.phone.test(v)) {
    setError(input, "手機為10碼數字");
    return false;
  }
  clearError(input);
  return true;
}

function validatePassword(input) {
  const v = input.value;
  if (!v) {
    setError(input, "請設定密碼");
    return false;
  }
  if (!patterns.password.test(v)) {
    setError(input, "密碼需至少8碼，且同時包含英文字母與數字");
    return false;
  }
  clearError(input);
  return true;
}

function validateConfirmPassword(confirmInput, pwdInput) {
  const v = confirmInput.value;
  if (!v) {
    setError(confirmInput, "再次輸入密碼");
    return false;
  }
  if (v !== pwdInput.value) {
    setError(confirmInput, "兩次輸入的密碼不同");
    return false;
  }
  clearError(confirmInput);
  return true;
}

function validateInterests(groupEl) {
  const checked = $$$('input[name="interests"]:checked', groupEl);
  const err = $("#interests-error");
  if (checked.length === 0) {
    err.textContent = "至少勾選 1 個";
    groupEl.setAttribute("aria-invalid", "true");
    return false;
  }
  err.textContent = "";
  groupEl.setAttribute("aria-invalid", "false");
  return true;
}

function validateTOS(input) {
  const err = $("#tos-error");
  if (!input.checked) {
    input.setCustomValidity("必須同意服務條款");
    err.textContent = "請勾選同意服務條款";
    input.setAttribute("aria-invalid", "true");
    return false;
  }
  input.setCustomValidity("");
  err.textContent = "";
  input.setAttribute("aria-invalid", "false");
  return true;
}

const form = $("#signup-form");
const successBanner = $("#success-banner");

const nameInput = $("#name");
const emailInput = $("#email");
const phoneInput = $("#phone");
const pwdInput = $("#password");
const confirmInput = $("#confirmPassword");
const interestGroup = $("#interest-group");
const interestsCount = $("#interests-count");
const tosInput = $("#tos");

const submitBtn = $("#submit-btn");
const resetBtn = $("#reset-btn");

function $(sel, root = document) { return root.querySelector(sel); }

function updateInterestsUI() {
  $$$("label.tag", interestGroup).forEach(lbl => {
    const cb = $("input[type='checkbox']", lbl);
    lbl.classList.toggle("tag--checked", cb.checked);
  });
  const checked = $$$("input[name='interests']:checked", interestGroup).length;
  interestsCount.textContent = `已選：${checked}`;
}

interestGroup.addEventListener("change", () => {
  updateInterestsUI();
  validateInterests(interestGroup);
});

nameInput.addEventListener("blur", () => validateName(nameInput));
emailInput.addEventListener("blur", () => validateEmail(emailInput));
phoneInput.addEventListener("blur", () => validatePhone(phoneInput));
pwdInput.addEventListener("blur", () => validatePassword(pwdInput));
confirmInput.addEventListener("blur", () => validateConfirmPassword(confirmInput, pwdInput));
tosInput.addEventListener("change", () => validateTOS(tosInput));
interestGroup.addEventListener("blur", () => validateInterests(interestGroup), true);

nameInput.addEventListener("input", () => validateName(nameInput));
emailInput.addEventListener("input", () => validateEmail(emailInput));
phoneInput.addEventListener("input", () => validatePhone(phoneInput));
pwdInput.addEventListener("input", () => {
  const ok = validatePassword(pwdInput);
  if (confirmInput.value) validateConfirmPassword(confirmInput, pwdInput);
  return ok;
});
confirmInput.addEventListener("input", () => validateConfirmPassword(confirmInput, pwdInput));


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  successBanner.hidden = true;

  const checks = [
    validateName(nameInput),
    validateEmail(emailInput),
    validatePhone(phoneInput),
    validatePassword(pwdInput),
    validateConfirmPassword(confirmInput, pwdInput),
    validateInterests(interestGroup),
    validateTOS(tosInput),
  ];

  if (checks.some(ok => !ok)) {
    const firstInvalid =
      [nameInput, emailInput, phoneInput, pwdInput, confirmInput, tosInput]
        .find(el => el.getAttribute("aria-invalid") === "true" || !el.checkValidity())
      || interestGroup.getAttribute("aria-invalid") === "true" ? interestGroup : null;

    if (firstInvalid === interestGroup) {
      const firstCb = $("input[type='checkbox']", interestGroup);
      if (firstCb) firstCb.focus();
    } else if (firstInvalid) {
      firstInvalid.focus();
    }
    return;
  }

  submitBtn.disabled = true;
  submitBtn.classList.add("is-loading");
  submitBtn.dataset.originalText = submitBtn.textContent;
  submitBtn.textContent = "送出中...";

  await new Promise(r => setTimeout(r, 1000));

  submitBtn.disabled = false;
  submitBtn.classList.remove("is-loading");
  submitBtn.textContent = submitBtn.dataset.originalText || "送出";

  successBanner.hidden = false;

  form.reset();
  updateInterestsUI();

  $$$(".error-msg").forEach(p => p.textContent = "");
  [nameInput, emailInput, phoneInput, pwdInput, confirmInput, tosInput].forEach(i => {
    i.setAttribute("aria-invalid", "false");
    i.setCustomValidity("");
  });
  interestGroup.setAttribute("aria-invalid", "false");
});

resetBtn.addEventListener("click", () => {
  setTimeout(() => {
    updateInterestsUI();
    successBanner.hidden = true;
    $$$(".error-msg").forEach(p => p.textContent = "");
    [nameInput, emailInput, phoneInput, pwdInput, confirmInput, tosInput].forEach(i => {
      i.setAttribute("aria-invalid", "false");
      i.setCustomValidity("");
    });
    interestGroup.setAttribute("aria-invalid", "false");
  }, 0);
});

updateInterestsUI();
