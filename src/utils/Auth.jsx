export const BASE_URL = "https://347a9d66cbcc2970.mokky.dev";

function getResponse(response) {
  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(`Ошибка: ${response.status}`);
  }
}

export const register = (email, password) => {
  return fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password,
      email,
      name: "Жак-Ив Кусто",
      about: "Исследователь океана",
      avatar:
        "https://www.rgo.ru/sites/default/files/styles/head_image_article/public/1034295-e1477344635669-1.jpg?itok=4U4Dw9en",
    }),
  });
};

export const authorize = (email, password) => {
  return fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, email }),
  }).then(getResponse);
};

export const tokenCheck = (token) => {
  return fetch(`${BASE_URL}/auth_me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(getResponse);
};
