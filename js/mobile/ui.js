function checkMobile() {
    let md = window.matchMedia('(min-width: 768px)').matches;
    let lg = window.matchMedia('(min-width: 1024px)').matches;
    if(md || lg) {
        return false;
    } else {
        return true;
    }
}

let header = document.getElementById("main-header");

let isMobile = checkMobile();

// let toprect = document.getElementById("toolbar").getBoundingClientRect();
let topbar = {
    height: 0
}
let headerrect = header.getBoundingClientRect();

if(isMobile) {
    header.firstElementChild.classList.remove("nav-active");
    header.firstElementChild.nextElementSibling.classList.add("nav-active");
}

window.addEventListener("load", () => {
    onload();
});

window.addEventListener("resize", () => {
    onload();
});

function onload() {
    let isMobile = checkMobile();
    document.getElementById("mobile-menu").style.top = headerrect.y + headerrect.height + "px";
    if(isMobile) {
        header.firstElementChild.classList.remove("nav-active");
        header.firstElementChild.nextElementSibling.classList.add("nav-active");

        document.querySelector(".nav-active #change-mode-btn").onclick = () => {
            toggleDarkMode();
        }

        document.getElementById("toggle-mobile-menu").onclick = () => {
            let mobileMenu = document.getElementById('mobile-menu');
            if(mobileMenu.classList.contains("flex")) {
                mobileMenu.classList.replace("flex", "hidden");
            } else {
                mobileMenu.classList.replace("hidden", "flex");
            }
        }
    }
}

function showSidebar() {
    let leftSidebar = document.getElementById("side-bar");
    if(leftSidebar.classList.contains("hidden"))
        leftSidebar.classList.replace("hidden", "flex");
}

function hideSidebar() {
    let leftSidebar = document.getElementById("side-bar");
    if(leftSidebar.classList.contains("flex"))
        leftSidebar.classList.replace("flex", "hidden");
}