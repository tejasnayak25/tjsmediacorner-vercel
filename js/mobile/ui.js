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

        let mobileMenuBtn = document.getElementById("toggle-mobile-menu");
        mobileMenuBtn.onclick = () => {
            let mobileMenu = document.getElementById('mobile-menu');
            if(mobileMenu.classList.contains("flex")) {
                mobileMenu.classList.replace("flex", "hidden");
                anime({
                    targets: mobileMenu,
                    opacity: 0,
                    right: -56,
                    easing: "easeOutQuad",
                    duration: 100,
                });
                mobileMenuBtn.querySelector("i").classList.replace("fi-sr-cross", "fi-sr-menu-burger");
            } else {
                mobileMenu.classList.replace("hidden", "flex");
                anime({
                    targets: mobileMenu,
                    opacity: 1,
                    right: 0,
                    easing: "easeOutQuad",
                    duration: 100,
                });
                mobileMenuBtn.querySelector("i").classList.replace("fi-sr-menu-burger", "fi-sr-cross");
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