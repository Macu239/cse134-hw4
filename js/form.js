const form = document.querySelector(".contact-form");


const form_errors = [];

if (form) {
  const nameField = document.querySelector("#name");
  const emailField = document.querySelector("#email");
  const comments = document.querySelector("#comments");
  const fields = [nameField, emailField, comments];
  const submitButton = form.querySelector('button[type="submit"]');

  const errorOutput = document.querySelector("#error-output");
  const infoOutput = document.querySelector("#info-output");
  const errorInput = document.querySelector("#form-errors");

  /** Remaining-character count at which the counter switches to a warning. */
  const WARN_AT = 50;

  /** Human-readable names used in messages, keyed by the field's name attribute. */
  const labels = { name: "Name", email: "Email", comments: "Comments" };

  let attNum = 0;

  /** Per-field flags: has the user typed in this field yet? */
  const touched = { name: false, email: false, comments: false };

  /** Per-field flags: may this field display an error right now? */
  const shown = { name: false, email: false, comments: false };

  errorOutput.hidden = false;
  infoOutput.hidden = false;

  fields.forEach(function (field) {
    field.dataset.describedby = field.getAttribute("aria-describedby") || "";
  });

  function validateField(field) {
    const label = labels[field.name];
    field.setCustomValidity("");

    if (field.validity.valueMissing) {
      field.setCustomValidity(`${label} is required. Please fill it in.`);
    } else if (field.validity.typeMismatch) {
      field.setCustomValidity(`${label} must be a valid email address, such as name@example.com.`);
    } else if (field.validity.tooShort) {
      field.setCustomValidity(
        `${label} must be at least ${field.minLength} characters. You have typed ${field.value.length}.`
      );
    }

    return field.validity.valid;
  }


  function renderErrors() {
    errorOutput.textContent = "";
    const list = document.createElement("ul");

    fields.forEach(function (field) {
      const errorId = `${field.name}-error`;
      const showError = shown[field.name] && !field.validity.valid;
      const describedby = field.dataset.describedby;

      if (showError) {
        const item = document.createElement("li");
        item.id = errorId;
        item.textContent = field.validationMessage;
        list.appendChild(item);
        field.setAttribute("aria-describedby", `${describedby} ${errorId}`.trim());
      } else if (describedby) {
        field.setAttribute("aria-describedby", describedby);
      } else {
        field.removeAttribute("aria-describedby");
      }
    });

    if (list.children.length > 0) {
      errorOutput.appendChild(list);
    }
  }

  function updateCnt() {
    const limit = comments.maxLength;
    const remaining = limit - comments.value.length;

    infoOutput.classList.remove("warn", "limit");

    if (remaining <= 0) {
      infoOutput.classList.add("limit");
      infoOutput.textContent = `You have reached the ${limit}-character limit. No more text can be added.`;
    } else if (remaining <= WARN_AT) {
      infoOutput.classList.add("warn");
      infoOutput.textContent = `Warning: only ${remaining} characters remaining of ${limit}.`;
    } else {
      infoOutput.textContent = `${remaining} characters remaining of ${limit}.`;
    }
  }

  fields.forEach(function (field) {
    field.addEventListener("input", function () {
      touched[field.name] = true;
      validateField(field);
      if (field === comments) {
        updateCnt();
      }
      renderErrors();
    });

    field.addEventListener("blur", function () {
      if (touched[field.name]) {
        shown[field.name] = true;
        validateField(field);
        renderErrors();
      }
    });
  });


  submitButton.addEventListener("click", function () {
    attNum += 1;
    fields.forEach(function (field) {
      shown[field.name] = true;
      validateField(field);
    });
  });

  // Native validation blocks the submit event when a field is invalid, but it
  // fires "invalid" on each bad control once per attempt. Record history here.
  fields.forEach(function (field) {
    field.addEventListener("invalid", function () {
      validateField(field);
      form_errors.push({
        attempt: attNum,
        field: field.name,
        error: field.validationMessage,
        time: new Date().toISOString()
      });
      renderErrors();
    });
  });

  // Only reached when every field is valid. Attach the history and let the POST continue.
  form.addEventListener("submit", function () {
    errorInput.value = JSON.stringify(form_errors);
  });

  updateCnt();
  renderErrors();
}
