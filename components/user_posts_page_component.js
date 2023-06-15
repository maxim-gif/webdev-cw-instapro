import { getPostsUser, likeOff, likeOnn, deletePost} from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { formatDistanceToNow } from "date-fns"
import { scrollUp } from "../helpers.js";
import { ru } from 'date-fns/locale'
import _ from 'lodash';

export function renderUserPostPageComponent({appEl, userId, token }) {
  function render () {
    getPostsUser(token, userId).then((data) => {
      console.log(token);
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
                  <div class="likes-contain">
                  <button data-post-id="${post.id}" class="like-button">
                    <img src="./assets/images/like-active.svg">
                  </button>
                  <p class="post-likes-text">
                    Нравится: <strong>${post.likes.length === 0 ?"":_.capitalize(post.likes[0].name)} ${post.likes.length > 1 ? `и еще ${post.likes.length - 1}`: ""}</strong>
                  </p>
                 </div>
                <div>
                  <button data-post-id="${post.id}" style="${token === undefined ? "display: none;":""} " class="delete-button">
                    <img class="delete-svg" src="./assets/images/delete.svg">
                  </button>
                </div>
                  </div>
                  <p class="post-text">
                    <span class="user-name">${ _.capitalize(post.userName)}</span>
                    ${post.description}
                  </p>
                  <p class="post-date">
                  ${formatDistanceToNow(new Date(post.createdAt), { locale: ru })} назад
                  </p>
                </li>
                div class="btn-up btn-up_hide"></div>`
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
                      likeOff({token, postId: button.dataset.postId}).then(() => {render()})
                    } else {
                      likeOnn({token, postId: button.dataset.postId}).then(() => {render()})
                    }
                  });
                }
                
                for (let button of document.querySelectorAll(".delete-button")) {
                  button.addEventListener("click", () => {
                    deletePost({token, postId: button.dataset.postId}).then(() => {render()})
                  });
                }

                scrollUp({btnUp : document.querySelector('.btn-up')})
      });
  }
   
    render()
}