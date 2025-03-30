document.addEventListener("DOMContentLoaded", () => {
    var textWrapper = document.querySelector('.title');
    textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter inline-block'>$&</span>");

    anime({
        targets: '.title .letter',
        opacity: [0,1],
        easing: "easeInOutQuad",
        duration: 1000,
        delay: (el, i) => 100 * (i+1),
    });

    document.querySelectorAll(".title .letter").forEach((l, index, letters) => {
        l.dataset.initialY = 0; // Store initial Y position for smooth transitions
    
        l.onmouseover = () => {
            letters.forEach((letter, i) => {
                const distance = Math.abs(i - index); // Distance from hovered letter
                const moveAmount = -25 * Math.exp(-distance / 2); // Smooth wave effect
    
                // Store the current position for smooth transitions
                letter.dataset.initialY = moveAmount;
    
                anime({
                    targets: letter,
                    translateY: moveAmount, 
                    easing: "easeOutQuad",
                    duration: 400,
                    delay: distance * 50,
                });
            });
        };
    });

    document.querySelector(".title").onmouseout = () => {
        letters.forEach((letter, i) => {
            anime({
                targets: letter,
                translateY: 0, // Reset smoothly from stored position
                easing: "easeOutQuad",
                duration: 400,
                delay: 50,
            });
        });
    };
    

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
    });
    
    let lastProgress = -1; 
    let lastScrollY = 0; // Track scroll direction
    let bodyRect = document.body.getBoundingClientRect();
    let isAnimating = false;
    
    document.getElementById("scroll-next").onclick = () => {
        if (lastProgress === -1) lastProgress = 0.15;
        
        // Recalculate body height
        let bodyHeight = document.body.getBoundingClientRect().height;
    
        lastProgress = Math.min(lastProgress + 0.5, 1); 
    
        scroll.scrollTo(lastProgress * bodyHeight, { 
            duration: 800, 
            easing: [0.25, 0.1, 0.25, 1] 
        });
    
        console.log("Scrolling to:", lastProgress * bodyHeight);
    };
    
    // Debounce function to reduce rapid scroll event handling
    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };
    
    // Scroll event handler
    scroll.on('scroll', debounce((args) => {
        if (isAnimating) return;
    
        const images = document.querySelectorAll(".prod-cover");
        const visibleImage = Array.from(images).filter(img => img.offsetParent !== null && getComputedStyle(img).display !== "none");
    
        if (!visibleImage.length) return;
    
        let progress = args.currentElements[0]?.progress ?? 0;
    
        // Track scroll direction
        let currentScrollY = window.scrollY;
        let scrollingDown = currentScrollY < lastScrollY;
        lastScrollY = currentScrollY;
    
        if (Math.abs(progress - lastProgress) < 0.05) return; 
        lastProgress = progress;
        console.log("Progress:", progress, "| Scrolling Down:", scrollingDown);
    
        isAnimating = true;
    
        if (scrollingDown) {
            // Scrolling down animations
            anime({
                targets: ".f-holder",
                opacity: 0,
                bottom: "-20rem",
                duration: 400,
                easing: "easeOutQuad",
                complete: () => {
                    anime({
                        targets: ".t-holder",
                        opacity: 1,
                        top: 0,
                        duration: 400,
                        easing: "easeOutQuad",
                        complete: () => isAnimating = false
                    });
    
                    anime({
                        targets: visibleImage[0],
                        skewX: 12,
                        skewY: -6,
                        left: "-2rem",
                        scale: 1,
                        opacity: 1,
                        duration: 400,
                        easing: "easeOutQuad",
                    });
    
                    anime({
                        targets: visibleImage[1],
                        skewX: -12,
                        skewY: 6,
                        right: "-2rem",
                        scale: 1,
                        opacity: 1,
                        duration: 400,
                        easing: "easeOutQuad",
                    });
                }
            });
    
            document.getElementById("scroll-next").classList.remove("hidden");
    
        } else {
            // Scrolling up animations
            anime({
                targets: visibleImage[0],
                left: "-10rem",
                opacity: 0,
                duration: 400, 
                easing: "easeOutQuad",
            });
    
            anime({
                targets: visibleImage[1],
                right: "-10rem",
                opacity: 0,
                duration: 400, 
                easing: "easeOutQuad",
            });
    
            anime({
                targets: ".t-holder",
                opacity: 0,
                top: "-10rem",
                duration: 400,
                easing: "easeOutQuad",
                complete: () => {
                    anime({
                        targets: ".f-holder",
                        opacity: 1,
                        bottom: "0rem",
                        duration: 400,
                        easing: "easeOutQuad",
                        complete: () => isAnimating = false
                    });
                }
            });
    
            document.getElementById("scroll-next").classList.add("hidden");
        }
    }, 100)); // Debounce delay to prevent rapid firing
    
    
});

document.querySelector(".nav-active #share-btn").onclick = () => {
    navigator.share({
        url: window.location.origin
    });
}