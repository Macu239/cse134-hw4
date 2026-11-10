const form = document.querySelector(".contact-form");
if (form) {
  const nameField = document.querySelector("#name");
  const emailField = document.querySelector("#email");
  const comments = document.querySelector("#comments");
  const fields = [nameField, emailField, comments];

  const errorOutput = document.querySelector("#error-output");
  const infoOutput = document.querySelector("#info-output");
  const errorInput = document.querySelector("#form-errors");

  const form_errors = [];
  let attNum = 0;
  errorOutput.hidden = false;
  infoOutput.hidden = false;

  function validateField(field) {
    if (field.value.trim() === "") {
      form_errors.push(`The ${field.name} field is required.`);
      field.classList.add("error");
    }
  }

  function renderErrors() {
    if (form_errors.length > 0) {
      errorOutput.innerHTML = form_errors.map(error => `<li>${error}</li>`).join("");
      errorInput.value = form_errors.join("\n");
    } else {
      errorOutput.innerHTML = "";
      errorInput.value = "";
    }
  }

  function updateCnt(){
    const status = document.querySelector("#comments + status");
    status.textContent = `Characters: ${comments.value.length}/800`;
  }

  fields.forEach(function(field) {
     field.addEventListener("input", function () {
        validateField(field);
    });
    field.addEventListener("blur", function () {
      validateField(field);
      renderErrors();
    });
  })

  fields.forEach(function(field) {
    field.addEventListener("invalid", function (event) {
      event.preventDefault();
      validateField(field);
      renderErrors();
    });
  })

  form.addEventListener("submit", function (event) {
    form_errors.length = 0; // Clear previous errors
    fields.forEach(validateField);
    renderErrors();

    if (form_errors.length > 0) {
      event.preventDefault();
      attNum++;
      infoOutput.textContent = `Attempt ${attNum}: Please correct the errors above.`;
    } else {
      infoOutput.textContent = "Form submitted successfully!";
    }
  })

  updateCnt();
}

