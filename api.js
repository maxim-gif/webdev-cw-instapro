// Замени на свой, чтобы получить независимый от других набор данных.
// "боевая" версия инстапро лежит в ключе prod
const personalKey = "maxim";
const baseHost = "https://wedev-api.sky.pro";
const postsHost = `${baseHost}/api/v1/${personalKey}/instapro`;

export function onAddPostClick(description, imageUrl, token) {
  if (!imageUrl) {
    alert("Не выбрана фотография");
    return;
  }
  if (!description) {
    alert("Введите описание");
    return;
  }
 return fetch(postsHost, {
    method: "POST",
    body: JSON.stringify({
      description: description,
      imageUrl: imageUrl,}),
      headers: {
        authorization: token,
       },
  }).then((response) => {
    return response.json()
  }).catch((error) => {
    alert(error.message); 
  })
}

export function likeOnn({token, postId}) {
  return fetch(postsHost + `/` + postId +`/like`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }

    return response.json();
  }).catch((error) => {
    alert(error.message);
  })
}

export function likeOff({token, postId}) {
  return fetch(postsHost + `/` + postId +`/dislike`, {
    method: "POST",
    headers: {
      Authorization: token,
    },
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("Нет авторизации");
    }

    return response.json();
  }).catch((error) => {
    alert(error.message);
  })
    
}

export function getPostsUser(token, userId) {
  return fetch(postsHost + `/user-posts/` + userId, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      const arrPosts = data.posts.map((post) => {
        return {
          id: post.id,
          imageUrl:  post.imageUrl,
          createdAt:  post.createdAt,
          description:  post.description,
          userId: post.user.id,
          userName: post.user.name,
          userLogin: post.user.login,
          userImageUrl: post.user.imageUrl,
          likes: post.likes,
          isLiked: post.isLiked,
        };
      });
      return arrPosts
    });
}

export function getPosts( token ) {
  return fetch(postsHost, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        throw new Error("Нет авторизации");
      }

      return response.json();
    })
    .then((data) => {
      const arrPosts = data.posts.map((post) => {
        return {
          id: post.id,
          imageUrl:  post.imageUrl,
          createdAt:  post.createdAt,
          description:  post.description,
          userId: post.user.id,
          userName: post.user.name,
          userLogin: post.user.login,
          userImageUrl: post.user.imageUrl,
          likes: post.likes,
          isLiked: post.isLiked,
        };
      });
      return arrPosts
    });
}

// https://github.com/GlebkaF/webdev-hw-api/blob/main/pages/api/user/README.md#%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%D1%81%D1%8F
export function registerUser({ login, password, name, imageUrl }) {
  return fetch(baseHost + "/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
      name,
      imageUrl,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Такой пользователь уже существует");
    }
    return response.json();
  });
}

export function loginUser({ login, password }) {
  return fetch(baseHost + "/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  }).then((response) => {
    if (response.status === 400) {
      throw new Error("Неверный логин или пароль");
    }
    return response.json();
  });
}

// Загружает картинку в облако, возвращает url загруженной картинки
export function uploadImage({ file }) {
  const data = new FormData();
  data.append("file", file);

  return fetch(baseHost + "/api/upload/image", {
    method: "POST",
    body: data,
  }).then((response) => {
    return response.json();
  });
}
