import { useEffect, useState } from "react";
import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { AppContext } from "../contexts/AppContext";
import api from "../utils/Api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRouteElement from "./ProtectedRoute";
import * as Auth from "../utils/Auth";
import InfoTooltip from "./InfoTooltip";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isCardPopupOpen, setIsCardPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loggedIn, setLoggedIn] = useState(true);
  const [message, setMessage] = useState("");
  const [isRegisterSuccessful, setIsRegisterSuccessful] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleInfoTooltip() {
    setIsInfoTooltipOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setIsCardPopupOpen(true);
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsCardPopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({});
  }

  function handleCardLike({ likes, _id }) {
    const isLiked = likes.some((i) => i === currentUser._id);
    if (isLiked) {
      const updatedLikes = likes.filter((item) => item !== currentUser._id);
      api
        .dislikeCard(_id, updatedLikes)
        .then((newCard) => {
          setCards((state) =>
            state.map((card) => (card.id === _id ? newCard : card))
          );
        })
        .catch(console.error);
    } else {
      api
        .likeCard(_id, likes, currentUser._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((card) => (card.id === _id ? newCard : card))
          );
        })
        .catch(console.error);
    }
  }

  function handleCardDelete(_id) {
    api
      .deleteCard(_id)
      .then((res) => {
        if (res.ok) {
          setCards((state) => state.filter((card) => card.id !== _id && card));
        } else {
          return Promise.reject(`Ошибка: ${res.status}`);
        }
      })
      .catch(console.error);
  }

  function handleUpdateUser({ name, about }) {
    function makeRequest() {
      return api
        .editProfileInfo({ name, about }, currentUser._id)
        .then((res) => {
          setCurrentUser({ ...currentUser, name: res.name, about: res.about });
        });
    }
    handleSubmit(makeRequest);
  }

  function handleUpdateAvatar({ avatar }) {
    function makeRequest() {
      return api.updateAvatar({ avatar }, currentUser._id).then((res) => {
        setCurrentUser({ ...currentUser, avatar: res.avatar });
      });
    }
    handleSubmit(makeRequest);
  }

  function handleAddPlaceSubmit({ name, link }) {
    function makeRequest() {
      return api
        .addCard({ owner: currentUser._id, name, link, likes: [] })
        .then((newCard) => setCards([newCard, ...cards]));
    }
    handleSubmit(makeRequest);
  }

  function handleSubmit(request) {
    setIsLoading(true);
    request()
      .then(closeAllPopups)
      .catch((error) => {
        setError("На сервере произошла ошибка. Повторите попытку позже");
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  }

  function auth(token) {
    Auth.tokenCheck(token)
      .then((res) => {
        if (res) {
          setCurrentUser({
            _id: res.id,
            name: res.name,
            email: res.email,
            about: res.about,
            avatar: res.avatar,
          });
          setLoggedIn(true);
          navigate("/");
        }
      })
      .catch(() => {
        console.error;
        setLoggedIn(false);
        navigate("/sign-in");
      });
  }

  function handleRegister({ email, password }) {
    Auth.register(email, password)
      .then((response) => {
        if (response.status === 201) {
          setMessage("Вы успешно зарегистрировались!");
          setIsRegisterSuccessful(true);
          return response.json();
        } else {
          setMessage("Что-то пошло не так! Попробуйте  ещё раз.");
          setIsRegisterSuccessful(false);
          return Promise.reject(`Ошибка: ${response.status}`);
        }
      })
      .catch((error) => {
        if (error === "Ошибка: 401") {
          setError("Пользователь с таким email уже зарегистрирован");
        } else {
          setError("При регистрации произошла ошибка. Повторите попытку позже");
        }
        console.log(error);
      })
      .finally(handleInfoTooltip);
  }

  function handleLogin({ email, password }) {
    Auth.authorize(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem("token", res.token);
          setLoggedIn(true);
          setCurrentUser({
            _id: res.data.id,
            email: res.data.email,
            name: res.data.name,
            about: res.data.about,
            avatar: res.data.avatar,
          });
          navigate("/");
        }
      })
      .catch((error) => {
        if (error === "Ошибка: 401") {
          setError("Вы ввели неправильный email или пароль");
        } else {
          setError("При авторизации произошла ошибка. Повторите попытку позже");
        }
        console.log(error);
      });
  }

  function handleSignOut() {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/sign-in");
  }

  function checkValidity(e) {
    setError("");
    const form = e.target.form;
    const formErrors = form.querySelectorAll("span");
    const formInputs = form.querySelectorAll("input");
    const formButton = form.querySelector('button[type="submit"]');
    const isFormInvalid = Array.from(formErrors).some((error) => {
      return error.textContent !== "";
    });
    const hasAnEmptyInput = Array.from(formInputs).some((input) => {
      return input.value === "";
    });
    if (!isFormInvalid && !hasAnEmptyInput) {
      formButton.removeAttribute("disabled");
    } else {
      formButton.setAttribute("disabled", true);
    }
  }

  useEffect(() => {
    api.getCards().then(setCards).catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      auth(token);
    } else {
      setLoggedIn(false);
      navigate("/sign-in");
    }
  }, [loggedIn]);

  return (
    <AppContext.Provider value={{ closeAllPopups, isLoading }}>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header
            loggedIn={loggedIn}
            onSignOut={handleSignOut}
            email={currentUser.email}
          />
          <Routes>
            <Route
              path="/sign-up"
              element={
                <>
                  <Register
                    onRegister={handleRegister}
                    checkValidity={checkValidity}
                    setError={setError}
                    error={error}
                  />
                  <InfoTooltip
                    isOpen={isInfoTooltipOpen}
                    isRegisterSuccessful={isRegisterSuccessful}
                    messageText={message}
                  />
                </>
              }
            />
            <Route
              path="/sign-in"
              element={
                <Login
                  onLogin={handleLogin}
                  checkValidity={checkValidity}
                  setError={setError}
                  error={error}
                />
              }
            />
            <Route
              path="/"
              element={
                <>
                  <ProtectedRouteElement
                    loggedIn={loggedIn}
                    component={Main}
                    cards={cards}
                    onCardDelete={handleCardDelete}
                    onCardLike={handleCardLike}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                  />
                  <ProtectedRouteElement
                    loggedIn={loggedIn}
                    component={Footer}
                  />
                  <ProtectedRouteElement
                    loggedIn={loggedIn}
                    component={EditProfilePopup}
                    onUpdateUser={handleUpdateUser}
                    isOpen={isEditProfilePopupOpen}
                    checkValidity={checkValidity}
                    error={error}
                  />
                  <ProtectedRouteElement
                    loggedIn={loggedIn}
                    component={AddPlacePopup}
                    onAddPlace={handleAddPlaceSubmit}
                    isOpen={isAddPlacePopupOpen}
                    checkValidity={checkValidity}
                    error={error}
                  />
                  <ProtectedRouteElement
                    loggedIn={loggedIn}
                    component={ImagePopup}
                    card={selectedCard}
                    isOpen={isCardPopupOpen}
                  />
                  <ProtectedRouteElement
                    loggedIn={loggedIn}
                    component={EditAvatarPopup}
                    onUpdateAvatar={handleUpdateAvatar}
                    isOpen={isEditAvatarPopupOpen}
                    checkValidity={checkValidity}
                    error={error}
                  />
                </>
              }
            />
          </Routes>
        </div>
      </CurrentUserContext.Provider>
    </AppContext.Provider>
  );
}

export default App;
