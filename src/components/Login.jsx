import { useEffect } from "react";
import { useForm } from "../hooks/useForm";
import handleInput from "../utils/handleInput";

export default function Login({ onLogin, checkValidity, setError, error }) {
  const { values, handleChange } = useForm({ email: "", password: "" });

  function handleSubmit(evt) {
    evt.preventDefault();
    onLogin({ email: values.email, password: values.password });
  }

  useEffect(() => {
    return () => setError("");
  }, []);

  return (
    <div className="popup__container popup__container_dark-theme">
      <h2 className="popup__title popup__title_dark-theme">Вход</h2>
      <form
        name="loginForm"
        className="popup__form"
        onSubmit={handleSubmit}
        onInput={checkValidity}
      >
        <div className="popup__input-contaner">
          <input
            className="popup__form-item popup__form-item_dark-theme"
            type="email"
            id="email"
            name="email"
            value={values.email || ""}
            placeholder="Email"
            onInput={handleInput}
            onChange={handleChange}
            minLength="2"
            maxLength="200"
            required
          />
          <span className="popup__error-message" id="error-email"></span>
        </div>
        <div className="popup__input-contaner">
          <input
            className="popup__form-item popup__form-item_dark-theme"
            type="password"
            id="password"
            name="password"
            value={values.password || ""}
            placeholder="Пароль"
            onChange={handleChange}
            onInput={handleInput}
            minLength="2"
            maxLength="200"
            required
          />
          <span className="popup__error-message" id="error-password"></span>
        </div>
        <button
          disabled
          aria-label="Войти"
          type="submit"
          className="popup__submit-button popup__submit-button_dark-theme"
        >
          Войти
        </button>
        <span className="popup__api-error">{error}</span>
      </form>
    </div>
  );
}
