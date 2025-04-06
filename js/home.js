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

    const mainScroll = window;
    let lastScrollTop = 0;
    let isAnimating = false;
    let currentSection = 1;
    let scrollHeight = document.getElementById("main-scroll").scrollHeight;

    document.getElementById("scroll-next").onclick = () => {
        window.scrollTo({
            top: mainScroll.scrollY + 0.33 * scrollHeight,
            behavior: "smooth"
        });
    }

    mainScroll.addEventListener("scrollend", () => {
        if (isAnimating) return;

        requestAnimationFrame(() => {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
            let scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            let scrollProgress = (scrollTop / scrollHeight) * 100;

            let progress = scrollProgress.toFixed(2);
            console.log(`Scroll Progress: ${progress}%`);

            let isScrollingDown = scrollTop > lastScrollTop;
            console.log(isScrollingDown ? "Scrolling Down ⬇️" : "Scrolling Up ⬆️");

            lastScrollTop = scrollTop; // Update after checking direction

            animate(isScrollingDown);

            if(progress < 20 && currentSection == 3) {
                setTimeout(() => {
                    animate(false);
                }, 1000);
            }
            if(progress > 80 && currentSection == 1) {
                setTimeout(() => {
                    animate(true);
                }, 1000);
            }
            
        });
    });
    
    const images = document.querySelectorAll(".prod-cover");
    const visibleImage = Array.from(images).filter(img => img.offsetParent !== null && getComputedStyle(img).display !== "none");

    function animate(scrollingDown) {
        if (isAnimating) return;
        isAnimating = true;
    
        const sections = [".t-holder", ".f-holder", ".c-holder"];
        const images = visibleImage || [];
    
        function hideElement(targets, properties, callback) {
            anime({
                targets,
                ...properties,
                duration: 400,
                easing: "easeOutQuad",
                complete: callback || (() => { isAnimating = false; }),
            });
        }
    
        function showElement(targets, properties, callback) {
            anime({
                targets,
                ...properties,
                duration: 400,
                easing: "easeOutQuad",
                complete: callback || (() => { isAnimating = false; }),
            });
        }
    
        // Section 1 ➝ Section 2
        if (currentSection === 1 && scrollingDown) {
            hideElement(images[0], { left: "-30rem", opacity: 0 });
            if (images.length > 1) hideElement(images[1], { right: "-30rem", opacity: 0 });
    
            hideElement(sections[0], { opacity: 0, top: "-10rem" }, () => {
                showElement(sections[1], { opacity: 1, bottom: "0rem" }, () => {
                    currentSection++;
                });
            });
    
        // Section 2 ➝ Section 1 (Scrolling Up)
        } else if (currentSection === 2 && !scrollingDown) {
            hideElement(sections[1], { opacity: 0, bottom: "-20rem" }, () => {
                showElement(sections[0], { opacity: 1, top: "0rem" }, () => {
                    currentSection--;
                });
    
                showElement(images[0], { skewX: 12, skewY: -6, left: "-2rem", scale: 1, opacity: 1 });
                if (images.length > 1) {
                    showElement(images[1], { skewX: -12, skewY: 6, right: "-2rem", scale: 1, opacity: 1 });
                }
            });
    
        // Section 2 ➝ Section 3
        } else if (currentSection === 2 && scrollingDown) {
            hideElement(sections[1], { opacity: 0, bottom: "20rem" }, () => {
                showElement(sections[2], { opacity: 1, bottom: "0rem" }, () => {
                    currentSection++;
                });
            });
    
            document.getElementById("scroll-next").classList.add("hidden");
    
        // Section 3 ➝ Section 2 (Scrolling Up)
        } else if (currentSection === 3 && !scrollingDown) {
            hideElement(sections[2], { opacity: 0, bottom: "-20rem" }, () => {
                showElement(sections[1], { opacity: 1, bottom: "0rem" }, () => {
                    currentSection--;
                });
            });
    
            document.getElementById("scroll-next").classList.remove("hidden");
        }
    
        // Unlock animation flag after the transition
        setTimeout(() => { isAnimating = false; }, 450);
    }
    
    
    
});

document.getElementById("send-mail").onclick = () => {
    window.open(`mailto:arpithanayak900@gmail.com?subject=${encodeURIComponent("Support Request")}&body=${encodeURIComponent(document.getElementById("message").value)}`, "_blank");
}