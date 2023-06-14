import { renderHeaderComponent } from "./header-component.js";
import { uploadImage, onAddPostClick } from "../api.js";
import { goToPage } from "../index.js";
import {POSTS_PAGE} from "../routes.js";


export function renderAddPostPageComponent({ appEl, token}) {
  const render = () => {
    let imageUrl = localStorage.getItem('url');
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <h1 style="text-align: center;">Добавить пост</h1>
      ${
        imageUrl
          ? `
          <div class="file-upload-image-conrainer">
            <img class="file-upload-image" src="${imageUrl}">
            <button class="file-upload-remove-button button">Заменить фото</button>
          </div>
          `
          : `
            <label class="file-upload-label secondary-button">
                <input
                  type="file"
                  class="file-upload-input"
                  style="display:none"
                />
                Выберите фото
            </label>
          
      `
      }
    <div class="page" style="padding-top: 10px; padding-bottom: 5px;">
    <span><b>Опишите фотографию:</b></span>
    <textarea class="description" name="" id="description"></textarea>
    </div>
    <button class="button" id="add-button" style="width: 100%;">Добавить</button>
    </div>
  `;
    
    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const fileInputElement = document.querySelector(".file-upload-input");
    
    fileInputElement?.addEventListener("change", () => {
      const file = fileInputElement.files[0];
      if (file) {
        const lableEl = document.querySelector(".file-upload-label");
        lableEl.setAttribute("disabled", true);
        lableEl.textContent = "Загружаю файл...";
        uploadImage({ file }).then(({ fileUrl }) => {
          imageUrl = fileUrl;
          window.localStorage.setItem('url', imageUrl);
          render();
        });
      }
    });
   
    document.querySelector(".file-upload-remove-button")
    ?.addEventListener("click", () => {
      localStorage.removeItem('url');
      render();
    });

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick(document.getElementById("description").value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"), imageUrl, token).then((data) => {
        goToPage(POSTS_PAGE);
      });
    });
    localStorage.removeItem('url');
  };


  render();
}
