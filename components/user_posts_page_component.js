import { getPostsUser, likeOff, likeOnn} from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { goToPage} from "../index.js";
import { USER_POSTS_PAGE} from "../routes.js";
import { formatDistanceToNow } from "date-fns"
import { ru } from 'date-fns/locale'
import _, { functions } from 'lodash';

export function renderUserPostPageComponent({appEl, userId, token }) {
  function render () {
    getPostsUser(token, userId).then((data) => {
      let postsHtml = data.map((post) => {
          return `<li class="post">
                  <div class="post-header" data-user-id="${post.id}">
                      <img src="${post.userImageUrl}" class="post-header__user-image">
                      <p class="post-header__user-name">${ _.capitalize(post.userName)}</p>
                  </div>
                  <div class="post-image-container">
                    <img class="post-image" src="${post.imageUrl}">
                  </div>
                  <div class="post-likes">
                    <button data-post-id="${post.id}" class="like-button">
                      <img src="./assets/images/like-active.svg">
                    </button>
                    <p class="post-likes-text">
                      Нравится: <strong>${post.likes.map((like) => {return _.capitalize(like.name)}).join(", ")}</strong>
                    </p>
                  </div>
                  <p class="post-text">
                    <span class="user-name">${ _.capitalize(post.userName)}</span>
                    ${post.description}
                  </p>
                  <p class="post-date">
                  ${formatDistanceToNow(new Date(post.createdAt), { locale: ru })} назад
                  </p>
                </li>`
        }).join("");
  
        console.log(data);
          const appHtml = `
                <div class="page-container">
                  <div class="header-container"></div>
                  <ul class="posts">` 
                  + postsHtml +
                  `</ul>
                </div>`

                appEl.innerHTML = appHtml;

                renderHeaderComponent({
                  element: document.querySelector(".header-container"),
                });

                for (let button of document.querySelectorAll(".like-button")) {
                  button.addEventListener("click", () => {
                    let index = data.findIndex(post => post.id === button.dataset.postId);
                    console.log(data[index].isLiked);
                    if (data[index].isLiked) {
                      likeOff({token, postId: button.dataset.postId}).then(() => {
                          render()
                  })
                    } else {
                      likeOnn({token, postId: button.dataset.postId}).then(() => {
                          goToPage(USER_POSTS_PAGE, { userId: data[index].userId, })
                         render()
                  })
                    }
                  });
                }
                
  });
  }
   
    render()
}