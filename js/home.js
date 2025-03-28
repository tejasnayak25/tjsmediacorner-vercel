document.addEventListener("DOMContentLoaded", () => {
    var textWrapper = document.querySelector('.title');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

    anime({
        targets: '.title .letter',
        opacity: [0,1],
        easing: "easeInOutQuad",
        duration: 1000,
        delay: (el, i) => 100 * (i+1)
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

    const scroll = new LocomotiveScroll({
        el: document.body,
        // smooth: true
    });
    
    let lastProgress = -1; // Store last progress value to prevent unnecessary animations
    let bodyRect = document.body.getBoundingClientRect();

    document.getElementById("scroll-next").onclick = () => {
        console.log(lastProgress);
        if(lastProgress === -1) lastProgress = 0.15;
        lastProgress = lastProgress < 1 ? (lastProgress + 0.5) : lastProgress;
        console.log(lastProgress);
        scroll.scrollTo(lastProgress * bodyRect.height);
    }
    
    scroll.on('scroll', (args) => {
        const images = document.querySelectorAll(".prod-cover");
    
        const visibleImage = Array.from(images).filter(img => {
            return img.offsetParent !== null && getComputedStyle(img).display !== "none";
        });
    
        if (!visibleImage) return; // Prevent errors if no visible image is found
    
        let progress = args.currentElements[0]?.progress ?? 0;
    
        if (Math.abs(progress - lastProgress) < 0.05) return; // Prevent redundant updates
        lastProgress = progress;

        console.log(progress)
    
        requestAnimationFrame(() => {
            if (progress < 0.65) {
                anime({
                    targets: visibleImage[0],
                    skewX: 12,
                    skewY: -6,
                    left: "-2rem",
                    scale: 1,
                    opacity: 1,
                    duration: 300, // Shorter animation for smooth effect
                    easing: "easeOutQuad",
                    bottom: "-2rem"
                });

                anime({
                    targets: visibleImage[1],
                    skewX: -12,
                    skewY: 6,
                    right: "-2rem",
                    scale: 1,
                    opacity: 1,
                    duration: 300, // Shorter animation for smooth effect
                    easing: "easeOutQuad"
                });

                anime({
                    targets: document.querySelector(".t-holder"),
                    opacity: 1,
                    top: 0,
                    duration: 300, // Shorter animation for smooth effect
                    easing: "easeOutQuad"
                });

                anime({
                    targets: document.querySelector(".f-holder"),
                    opacity: 0,
                    bottom: "-20rem",
                    duration: 300, // Shorter animation for smooth effect
                    easing: "easeOutQuad"
                });

                document.getElementById("scroll-next").classList.remove("hidden");
            } else {
                // anime({
                //     targets: visibleImage[0],
                //     skewX: 0,
                //     skewY: 0,
                //     left: "-15rem",
                //     scale: 2.2,
                //     duration: 300, 
                //     easing: "easeOutQuad",
                //     bottom: isMobile ? "10rem" : "8rem"
                // });

                anime({
                    targets: visibleImage[0],
                    left: "-10rem",
                    opacity: 0,
                    duration: 300, 
                    easing: "easeOutQuad"
                });

                anime({
                    targets: visibleImage[1],
                    right: "-10rem",
                    opacity: 0,
                    duration: 300, 
                    easing: "easeOutQuad"
                });

                anime({
                    targets: document.querySelector(".t-holder"),
                    opacity: 0,
                    top: "-10rem",
                    duration: 300, // Shorter animation for smooth effect
                    easing: "easeOutQuad"
                });

                setTimeout(() => {
                    anime({
                        targets: document.querySelector(".f-holder"),
                        opacity: 1,
                        bottom: "0rem",
                        duration: 300, // Shorter animation for smooth effect
                        easing: "easeOutQuad"
                    });
                }, 300);

                document.getElementById("scroll-next").classList.add("hidden");
            }
        });
    });
    
});

document.querySelector(".nav-active #share-btn").onclick = () => {
    navigator.share({
        url: window.location.origin
    });
}