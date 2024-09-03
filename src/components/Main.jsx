import plusPath from "../images/plus.svg";
import Card from "./Card";
import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Main({
  cards,
  onCardClick,
  onCardLike,
  onCardDelete,
  onEditAvatar,
  onEditProfile,
  onAddPlace,
}) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__content">
          <div
            className="profile__avatar"
            style={{ backgroundImage: `url(${currentUser.avatar})` }}
            onClick={onEditAvatar}
          >
            <div className="profile__hover-avatar"></div>
          </div>
          <div className="profile__info">
            <div className="profile__name-section">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                aria-label="Редактировать"
                type="button"
                className="profile__edit-button"
                onClick={onEditProfile}
              ></button>
            </div>
            <p className="profile__occupation">{currentUser.about}</p>
          </div>
        </div>
        <button
          aria-label="Добавить"
          type="button"
          className="profile__add-button"
          onClick={onAddPlace}
        >
          <img
            src={plusPath}
            alt="Значок плюса: 
                кнопка добавления контента"
            className="profile__add-button-plus"
          />
        </button>
      </section>

      <section className="elements">
        {cards
          .sort((a, b) => b.id - a.id)
          .slice(0, 30)
          .map((item) => (
            <Card
              key={item.id}
              _id={item.id}
              owner={item.owner}
              name={item.name}
              link={item.link}
              likes={item.likes}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onCardDelete={onCardDelete}
            />
          ))}
      </section>
    </main>
  );
}
