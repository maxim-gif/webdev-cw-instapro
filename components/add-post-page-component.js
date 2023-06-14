import { renderHeaderComponent } from "./header-component.js";
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <h1 style="text-align: center;">Добавить пост</h1>
      <label class="file-upload-label secondary-button">
        <input type="file" class="file-upload-input" style="display:none">
        Выберите фото
    </label>
    <div class="page" style="padding-top: 10px; padding-bottom: 5px;">
    <span><b>Опишите фотографию:</b></span>
    <textarea class="dependens" name="" id=""></textarea>
    </div>
    <button class="button" id="add-button" style="width: 100%;">Добавить</button>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    document.getElementById("add-button").addEventListener("click", () => {
      onAddPostClick({
        description: "Описание картинки",
        imageUrl: "https://image.png",
      });
    });
  };


  render();
}
