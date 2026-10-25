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

  alert(title, description, footer, onClick = undefined) {
    if (this.#onClick !== undefined)
      this.#footerBtn.removeEventListener("click", this.#onClick);

    this.#title.textContent = title;
    this.#description.textContent = description;
    this.#footerBtn.textContent = footer;

    if (onClick !== undefined) {
      this.#onClick = onClick;
      this.#footerBtn.addEventListener("click", this.#onClick);
    }

    // try {
    //   this.#modal.showModal();
    // } finally {
    //   /* empty */
    // }
  }

  setClosedBy(value) {
    this.#modal.closedBy = value;
  }

  close() {
    // try {
    //   this.#modal.close();
    // } finally {
    //   /* empty */
    // }
  }
}
