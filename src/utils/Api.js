class Api {
  constructor({ url, headers }) {
    this._url = url;
    this._headers = headers;
  }

  _getResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      return Promise.reject(`Ошибка: ${response.status}`);
    }
  }

  getCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._headers,
    }).then(this._getResponse);
  }

  editProfileInfo(data, id) {
    return fetch(`${this._url}/users/${id}`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._getResponse);
  }

  updateAvatar(data, id) {
    return fetch(`${this._url}/users/${id}`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._getResponse);
  }

  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  addCard(data) {
    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify(data),
    }).then(this._getResponse);
  }

  likeCard(id, likes, userId) {
    return fetch(`${this._url}/cards/${id}`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        likes: [...likes, userId],
      }),
    }).then(this._getResponse);
  }

  dislikeCard(id, likes) {
    return fetch(`${this._url}/cards/${id}`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        likes,
      }),
    }).then(this._getResponse);
  }
}

const api = new Api({
  url: "https://347a9d66cbcc2970.mokky.dev",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
