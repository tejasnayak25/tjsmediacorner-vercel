let win = document.getElementById("alert-window");
let msg = win.querySelector("#alert-message");
let closebtn = win.querySelector("#closebtn");

let btns = [], onhide = () => {};

let alertwindow = {
    /**
     * @param {string} value 
     */
    set message(value) {
        msg.innerText = value;
    },
    /**
     * @param {Array<HTMLButtonElement>} value 
     */
    set btns(value) {
        btns = value;
    },
    /**
     * @param {Function} value 
     */
    set onhide(value) {
        onhide = value;
    },
    show: () => {
        if(window.location.pathname === "/account") {
            let btnsHolder = win.querySelector("#alert-btns");
            btnsHolder.innerHTML = "";
            btnsHolder.append(...btns);

            if(btns.length > 0) {
                btnsHolder.classList.add("py-4");
            } else {
                btnsHolder.classList.remove("py-4");
            }

            if(btns.length === 1) {
                btnsHolder.classList.add("justify-center");
            } else {
                btnsHolder.classList.add("justify-between");
            }
        }
        win.classList.replace("hidden", "flex");
    }, 
    hide: () => {
        win.classList.replace("flex", "hidden");
        onhide();
        onhide = () => {};
    }
}

closebtn.onclick = () => {
    alertwindow.hide();
}