const blurBg = document.getElementById('global-blur');
const main = document.getElementById('main-container');
const pWrapper = document.getElementById('profile-wrapper');
let zoomed = false;

// Fungsi Kedip Pas Transisi
function blinkAction(el, isOut = false) {
    const tl = gsap.timeline();
    if (!isOut) {
        tl.to(el, { opacity: 0.1, duration: 0.03 }).to(el, { opacity: 1, duration: 0.03 })
          .to(el, { opacity: 0.4, duration: 0.03 }).to(el, { opacity: 1, duration: 0.08 });
    } else {
        tl.to(el, { opacity: 0.2, duration: 0.04 }).to(el, { opacity: 0, duration: 0.1 });
    }
}

window.onload = () => {
    gsap.to(main, { opacity: 1, duration: 2 });
    gsap.from(pWrapper, { duration: 1.5, scale: 3, opacity: 0, ease: "expo.out" });
    
    gsap.to(".reveal", { 
        opacity: 1, y: 0, stagger: 0.15, duration: 0.1, delay: 0.8,
        onStart: function() {
            document.querySelectorAll('.reveal').forEach(el => blinkAction(el));
        }
    });
};

function zoomProfile(e) {
    e.stopPropagation();
    if (!zoomed) {
        zoomed = true;
        blurBg.style.opacity = "1";
        blurBg.style.pointerEvents = "auto";
        main.classList.add('content-dim');
        gsap.to(pWrapper, { 
            position: 'fixed', top: '50%', left: '50%', x: '-50%', y: '-50%', 
            scale: 3, zIndex: 100, duration: 0.8, ease: "expo.inOut" 
        });
    }
}

window.addEventListener('click', () => {
    if (zoomed) {
        zoomed = false;
        blurBg.style.opacity = "0";
        blurBg.style.pointerEvents = "none";
        main.classList.remove('content-dim');
        gsap.to(pWrapper, { 
            position: 'relative', top: '0', left: '0', x: '0', y: '0', 
            scale: 1, duration: 0.7, ease: "power3.inOut" 
        });
    }
});

function triggerWeb(target) {
    blinkAction(main, true);
    setTimeout(() => {
        main.classList.add('content-dim');
        blurBg.style.opacity = "1";
        document.getElementById('loading-box').style.display = "block";
        
        gsap.to("#progress", {
            width: "100%", duration: 2, ease: "power2.inOut",
            onComplete: () => {
                console.log(`Lagi ngirim sinyal ke: ${target}`);
                setTimeout(() => {
                    document.getElementById('loading-box').style.display = "none";
                    gsap.set("#progress", { width: "0%" });
                    blurBg.style.opacity = "0";
                    main.classList.remove('content-dim');
                    blinkAction(main);
                }, 600);
            }
        });
    }, 300);
}
