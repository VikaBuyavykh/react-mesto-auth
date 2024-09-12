import { emailRegex, nameRegex, urlRegex } from "./regex";

export default function handleInput(ev) {
  function isEmailValid(value) {
    return emailRegex.test(value);
  }
  function isUrlValid(value) {
    return urlRegex.test(value);
  }
  function isNameValid(value) {
    return nameRegex.test(value);
  }
  const element = ev.target;
  const errorElement = document.querySelector(`#error-${ev.target.id}`);
  errorElement.textContent = "";
  errorElement.classList.remove("popup__error-message_active");
  element.classList.remove("popup__form-item_type_error");
  if (element.id === "email") {
    if (!isEmailValid(element.value)) {
      errorElement.textContent = "Передан некорректный email";
      errorElement.classList.add("popup__error-message_active");
      element.classList.add("popup__form-item_type_error");
    }
  } else if (element.type === "url") {
    if (!isUrlValid(element.value)) {
      errorElement.textContent = "Передан некорректный адрес";
      errorElement.classList.add("popup__error-message_active");
      element.classList.add("popup__form-item_type_error");
    }
  } else if (element.type === "text") {
    if (!isNameValid(element.value)) {
      errorElement.textContent =
        "Поле может содержать только латинские и кириллические буквы и пробелы";
      errorElement.classList.add("popup__error-message_active");
      element.classList.add("popup__form-item_type_error");
    }
  } else {
    if (!element.checkValidity()) {
      errorElement.textContent = ev.target.validationMessage;
      errorElement.classList.add("popup__error-message_active");
      element.classList.add("popup__form-item_type_error");
    }
  }
}
