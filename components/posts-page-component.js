import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage} from "../index.js";
import { getPosts, likeOnn,likeOff, deletePost } from "../api.js";
import { formatDistanceToNow } from "date-fns"
import { ru } from 'date-fns/locale'
import _ from 'lodash';

export function renderPostsPageComponent({ appEl, token }) {
  getPosts(token).then((data) => {
    
      let postsHtml = data.map((post) => {
        return `<li class="post">
                <div class="post-header" data-user-id="${post.userId}">
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
    console.log(data);
     appEl.innerHTML = appHtml;

     renderHeaderComponent({
       element: document.querySelector(".header-container"),
     });
            
     for (let userEl of document.querySelectorAll(".post-header")) {
       userEl.addEventListener("click", () => {
         goToPage(USER_POSTS_PAGE, {
           userId: userEl.dataset.userId,
         });
       });
     }
     
     for (let button of document.querySelectorAll(".like-button")) {
      button.addEventListener("click", () => {
        let index = data.findIndex(post => post.id === button.dataset.postId);
        if (data[index].isLiked) {
          likeOff({token, postId: button.dataset.postId}).then(goToPage(POSTS_PAGE))
        } else {
          likeOnn({token, postId: button.dataset.postId}).then(goToPage(POSTS_PAGE))
        }
      });
    }

    for (let button of document.querySelectorAll(".delete-button")) {
      button.addEventListener("click", () => {
        deletePost({token, postId: button.dataset.postId}).then(goToPage(POSTS_PAGE))
      });
    }
    

  });
}
