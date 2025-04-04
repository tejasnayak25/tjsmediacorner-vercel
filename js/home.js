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

    let letters = document.querySelectorAll(".title .letter");

    document.body.onclick = (e) => {
        if(e.target.classList.contains("t-holder") || e.target.classList.contains("letter")) return;
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
    
        lastProgress = Math.min(lastProgress + 0.15, 1); 
    
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

    let currentSection = 1;
    let stepSize = window.innerHeight / 3;

    let autoscroll = false;
    
    const images = document.querySelectorAll(".prod-cover");
    const visibleImage = Array.from(images).filter(img => img.offsetParent !== null && getComputedStyle(img).display !== "none");

    // Scroll event handler
    scroll.on('scroll', debounce((args) => {
        if (isAnimating) return;
    
        if (!visibleImage.length) return;
    
        let progress = Object.values(args.currentElements)[0]?.progress ?? 0; // Fix for getting progress correctly
        let scrollDiff = Math.abs(progress - lastProgress);
    
        // Track scroll direction
        let currentScrollY = window.scrollY;
        let scrollingDown = currentScrollY > lastScrollY;
        lastScrollY = currentScrollY;
    
        if (Math.abs(progress - lastProgress) < 0.05) return;
        lastProgress = progress;
    
        console.log("Progress:", progress, "| Scrolling Down:", scrollingDown);
    
        animate(scrollingDown);
        if(scrollDiff > (isMobile ? 0.7 : 0.4)) setTimeout(() => {
            animate(scrollingDown);
        }, 1000);
    
        console.log("Current Section:", currentSection);
    }, 100)); // Debounce delay to prevent rapid firing
    
    function animate(scrollingDown) {
        isAnimating = true;
        
        if (currentSection === 1) {
            if (scrollingDown) {
                anime({
                    targets: visibleImage[0],
                    left: "-30rem",
                    opacity: 0,
                    duration: 400,
                    easing: "easeOutQuad",
                });
    
                if (visibleImage.length > 1) {
                    anime({
                        targets: visibleImage[1],
                        right: "-30rem",
                        opacity: 0,
                        duration: 400,
                        easing: "easeOutQuad",
                    });
                }
    
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
                            complete: () => {
                                isAnimating = false;
                                currentSection++; // Update section AFTER animation
                            }
                        });
                    }
                });
            } else {
                isAnimating = false;
            }
        } else if (currentSection === 2) {
            if (!scrollingDown) {
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
                            complete: () => {
                                isAnimating = false;
                                currentSection--; // Update section AFTER animation
                            }
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
    
                        if (visibleImage.length > 1) {
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
                    }
                });
            } else {
                anime({
                    targets: ".f-holder",
                    opacity: 0,
                    bottom: "20rem",
                    duration: 400,
                    easing: "easeOutQuad",
                    complete: () => {
                        anime({
                            targets: ".c-holder",
                            opacity: 1,
                            bottom: "0rem",
                            duration: 400,
                            easing: "easeOutQuad",
                            complete: () => {
                                isAnimating = false;
                                currentSection++;
                            }
                        });
                    }
                });
    
                document.getElementById("scroll-next").classList.add("hidden");
            }
        } else if(currentSection === 3) {
            if(!scrollingDown) {
                anime({
                    targets: ".c-holder",
                    opacity: 0,
                    bottom: "-20rem",
                    duration: 400,
                    easing: "easeOutQuad",
                    complete: () => {
                        anime({
                            targets: ".f-holder",
                            opacity: 1,
                            bottom: "0rem",
                            duration: 400,
                            easing: "easeOutQuad",
                            complete: () => {
                                isAnimating = false;
                                currentSection--;
                            }
                        });
                    }
                });
    
                document.getElementById("scroll-next").classList.remove("hidden");
            } else {
                isAnimating = false;
            }
        }
    } 
    
});

document.getElementById("send-mail").onclick = () => {
    window.open(`mailto:arpithanayak900@gmail.com?subject=${encodeURIComponent("Support Request")}&body=${encodeURIComponent(document.getElementById("message").value)}`, "_blank");
}