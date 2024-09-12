import PopupWithForm from "./PopupWithForm";
import React from "react";
import { AppContext } from "../contexts/AppContext";
import { useEffect } from "react";
import handleInput from "../utils/handleInput";

export default function EditAvatarPopup({
  onUpdateAvatar,
  isOpen,
  checkValidity,
  error,
}) {
  const { isLoading } = React.useContext(AppContext);
  const avatarRef = React.useRef("");

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  useEffect(() => {
    avatarRef.current.value = "";
  }, [isOpen]);

  return (
    <PopupWithForm
      name="renew"
      title="Обновить аватар"
      buttonText={isLoading ? "Сохранение..." : "Сохранить"}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      checkValidity={checkValidity}
      error={error}
    >
      <div className="popup__input-contaner">
        <input
          className="popup__form-item"
          type="url"
          id="updateLink"
          name="link"
          onInput={handleInput}
          placeholder="Ссылка на аватар"
          ref={avatarRef}
          required
        />
        <span className="popup__error-message" id="error-updateLink"></span>
      </div>
    </PopupWithForm>
  );
}
