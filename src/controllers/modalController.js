export class MessageModalController {
  #modal = undefined;
  #title = undefined;
  #description = undefined;
  #onClick = undefined;
  #footerBtn = undefined;

  constructor() {
    this.#modal = document.getElementById("message-modal");
    this.#title = document.getElementById("modal-title");
    this.#description = document.getElementById("modal-description");
    this.#footerBtn = document.getElementById("modal-footer-btn");
  }

  alert(title, description, footer, onClick) {
    if (this.#onClick !== undefined)
      this.#footerBtn.removeEventListener("click", this.#onClick);
    this.#title.textContent = title;
    this.#description.textContent = description;
    this.#footerBtn.textContent = footer;
    this.#onClick = onClick;
    this.#footerBtn.addEventListener("click", this.#onClick);

    this.#modal.showModal();
  }

  close() {
    this.#modal.close();
  }
}
