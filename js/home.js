document.addEventListener("DOMContentLoaded", () => {
    anime({
        targets: "#title",
        translateY: 0
    });
    anime({
        targets: "#email-holder",
        translateY: 0
    });

    if(isMobile) {
        document.getElementById("poster").style.transform = "translateY(100px)";
        anime({
            targets: "#poster",
            translateY: -50
        });
    } else {
        document.getElementById("poster").style.transform = "translateX(200px)";
        anime({
            targets: "#poster",
            translateX: 0
        });

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
    }
});

let email = document.getElementById("email");
document.getElementById("register-btn").onclick = () => {
    window.location.href = `/signup?email=${email.value}`;
}

document.querySelector(".nav-active #share-btn").onclick = () => {
    navigator.share({
        url: window.location.origin
    });
}