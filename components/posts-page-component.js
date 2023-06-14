import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage} from "../index.js";
import { getPosts } from "../api.js";
import { getUserFromLocalStorage} from "../helpers.js";

export function renderPostsPageComponent({ appEl }) {
  let user = getUserFromLocalStorage();
  getPosts(`Bearer ${user.token}`).then((data) => {
      let postsHtml = data.map((post) => {
        return `<li class="post">
                <div class="post-header" data-user-id="${post.id}">
                    <img src="${post.userImageUrl}" class="post-header__user-image">
                    <p class="post-header__user-name">${post.userName}</p>
                </div>
                <div class="post-image-container">
                  <img class="post-image" src="${post.imageUrl}">
                </div>
                <div class="post-likes">
                  <button data-post-id="642d00579b190443860c2f32" class="like-button">
                    <img src="./assets/images/like-active.svg">
                  </button>
                  <p class="post-likes-text">
                    Нравится: <strong>${post.likes.map((like) => {return like.name}).join(" ")}</strong>
                  </p>
                </div>
                <p class="post-text">
                  <span class="user-name">${post.userName}</span>
                  ${post.description}
                </p>
                <p class="post-date">
                  add time
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
            
     for (let userEl of document.querySelectorAll(".post-header")) {
       userEl.addEventListener("click", () => {
         goToPage(USER_POSTS_PAGE, {
           userId: userEl.dataset.userId,
         });
       });
     }

  });
}
