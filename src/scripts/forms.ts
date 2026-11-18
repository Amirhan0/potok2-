// Общая логика форм: маска телефона, валидация, отправка через fetch.
// Без JS формы всё равно отправляются обычным POST на action.

type FieldEl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
type FormState = "idle" | "submitting" | "success" | "error";

const ENDPOINT = import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined;

/** Нормализует ввод к виду +7 (XXX) XXX-XX-XX */
export function formatPhone(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits[0] === "8") digits = "7" + digits.slice(1);
  if (digits[0] !== "7") digits = "7" + digits;
  digits = digits.slice(0, 11);

  const p = digits.slice(1);
  let out = "+7";
  if (p.length) out += " (" + p.slice(0, 3);
  // Скобку закрываем только когда есть следующая цифра — иначе её нельзя стереть
  if (p.length > 3) out += ") " + p.slice(3, 6);
  if (p.length > 6) out += "-" + p.slice(6, 8);
  if (p.length > 8) out += "-" + p.slice(8, 10);
  return out;
}

function messageFor(el: FieldEl): string {
  const v = el.validity;
  if (el instanceof HTMLInputElement && el.type === "checkbox") {
    return v.valueMissing ? "Нужно ваше согласие, чтобы отправить заявку" : "";
  }
  if (v.valueMissing) {
    return el instanceof HTMLSelectElement ? "Выберите один из вариантов" : "Заполните это поле";
  }
  if (el instanceof HTMLInputElement && el.type === "tel" && v.customError) {
    return "Проверьте номер — не хватает цифр";
  }
  if (v.typeMismatch && el instanceof HTMLInputElement && el.type === "email") {
    return "Похоже, в адресе ошибка — пример: name@mail.ru";
  }
  if (v.tooShort) return `Минимум ${(el as HTMLInputElement).minLength} символа`;
  if (v.rangeUnderflow || v.rangeOverflow) {
    const i = el as HTMLInputElement;
    return `Укажите значение от ${i.min} до ${i.max}`;
  }
  if (v.patternMismatch || v.badInput) return "Проверьте значение";
  return "";
}

function validateField(el: FieldEl): boolean {
  if (el instanceof HTMLInputElement && el.type === "tel") {
    const digits = el.value.replace(/\D/g, "");
    el.setCustomValidity(digits.length > 0 && digits.length < 11 ? "phone" : "");
  }

  const ok = el.checkValidity();
  const error = el.closest("[data-field]")?.querySelector<HTMLElement>("[data-error]");
  if (ok) {
    el.removeAttribute("aria-invalid");
    if (error) error.textContent = "";
  } else {
    el.setAttribute("aria-invalid", "true");
    if (error) error.textContent = messageFor(el);
  }
  return ok;
}

function setState(form: HTMLFormElement, state: FormState, message = "") {
  form.dataset.state = state;
  const submit = form.querySelector<HTMLButtonElement>("[type=submit]");
  if (submit) {
    submit.disabled = state === "submitting";
    submit.setAttribute("aria-busy", String(state === "submitting"));
  }
  const status = form.querySelector<HTMLElement>("[data-status]");
  if (status) status.textContent = message;
}

async function send(form: HTMLFormElement): Promise<void> {
  const data = new FormData(form);
  data.set("form", form.dataset.form ?? "unknown");

  // Без настроенного эндпоинта — демо-режим, чтобы можно было проверить UX
  if (!ENDPOINT) {
    console.info("[forms] PUBLIC_FORM_ENDPOINT не задан, демо-отправка:", Object.fromEntries(data));
    await new Promise((r) => setTimeout(r, 700));
    return;
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

function initForm(form: HTMLFormElement) {
  form.noValidate = true; // показываем свои сообщения вместо системных
  const fields = Array.from(
    form.querySelectorAll<FieldEl>("input:not([type=hidden]):not([name=website]), select, textarea"),
  );

  for (const el of fields) {
    if (el instanceof HTMLInputElement && el.type === "tel") {
      el.addEventListener("input", () => {
        el.value = formatPhone(el.value);
      });
    }
    el.addEventListener("blur", () => {
      if (el.value || el.hasAttribute("aria-invalid")) validateField(el);
    });
    // Ошибку убираем, как только поле стало валидным
    el.addEventListener(el instanceof HTMLSelectElement || el.type === "checkbox" ? "change" : "input", () => {
      if (el.hasAttribute("aria-invalid")) validateField(el);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.dataset.state === "submitting") return;

    const invalid = fields.filter((el) => !validateField(el));
    if (invalid.length) {
      invalid[0].focus();
      setState(form, "idle");
      return;
    }

    // Ловушка для ботов: живой человек это поле не видит
    const honeypot = form.querySelector<HTMLInputElement>("[name=website]");
    if (honeypot?.value) {
      setState(form, "success", form.dataset.success ?? "Спасибо!");
      form.reset();
      return;
    }

    setState(form, "submitting", "Отправляем…");
    try {
      await send(form);
      form.reset();
      setState(form, "success", form.dataset.success ?? "Спасибо! Мы скоро свяжемся с вами.");
    } catch (err) {
      console.error("[forms]", err);
      setState(form, "error", "Не получилось отправить. Проверьте интернет и попробуйте ещё раз.");
    }
  });
}

document.querySelectorAll<HTMLFormElement>("form[data-form]").forEach(initForm);
