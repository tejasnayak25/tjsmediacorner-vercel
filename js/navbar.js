document.querySelector(".nav-active #change-mode-btn").onclick = () => {
    toggleDarkMode();
}

document.querySelector(".nav-active #share-btn").onclick = () => {
    navigator.share({
        url: window.location.origin
    });
}

document.querySelectorAll(".nav-active #menu a").forEach(target => {
    target.onmouseover = () => {
        anime({
            targets: target.querySelector("span"),
            width: "100%",
            easing: 'easeInOutQuad',
            duration: 300
        });
    }

    target.onmouseout = () => {
        anime({
            targets: target.querySelector("span"),
            width: "0%",
            easing: 'easeInOutQuad',
            duration: 300
        });
    }
});