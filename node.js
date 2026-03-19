const blurBg = document.getElementById('global-blur');
const main = document.getElementById('main-container');
const pWrapper = document.getElementById('profile-wrapper');
let zoomed = false;

// 1. Efek Kedip Manual (Pas transisi masuk/keluar)
function blinkAction(el, isOut = false) {
    const tl = gsap.timeline();
    if (!isOut) {
        tl.to(el, { opacity: 0.1, duration: 0.03 }).to(el, { opacity: 1, duration: 0.03 })
          .to(el, { opacity: 0.4, duration: 0.03 }).to(el, { opacity: 1, duration: 0.08 });
    } else {
        tl.to(el, { opacity: 0.2, duration: 0.04 }).to(el, { opacity: 0, duration: 0.1 });
    }
}

// 2. Animasi Awal Saat Buka Web
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

// 3. Logika Zoom Profile Nawa
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

// 4. Logika Klik Tombol & Kirim Sinyal ke Discord
function triggerWeb(target) {
    // Kedip dulu sebelum konten redup
    blinkAction(main, true);

    setTimeout(() => {
        main.classList.add('content-dim');
        blurBg.style.opacity = "1";
        document.getElementById('loading-box').style.display = "block";
        
        gsap.to("#progress", {
            width: "100%", 
            duration: 2, 
            ease: "power2.inOut",
            onComplete: async () => {
                
                // --- BAGIAN WEBHOOK DISCORD NAWA ---
                const dcUrl = "https://discord.com/api/webhooks/1483994571175100516/eBEl7x19z_kOLOGPQRCqKn1qmeXJpfqP0k1R_Qt1Tf-cvw9g-GfzIrWamjB5ZHQAhW6R"; 
                
                try {
                    await fetch(dcUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            content: `🚀 **Sinyal Masuk!** Seseorang baru aja ngeklik tombol **${target}** di portofolio lo, Wa!`
                        })
                    });
                } catch (err) {
                    console.log("Kabel putus, gagal kirim sinyal.");
                }
                // -----------------------------------

                setTimeout(() => {
                    document.getElementById('loading-box').style.display = "none";
                    gsap.set("#progress", { width: "0%" });
                    blurBg.style.opacity = "0";
                    main.classList.remove('content-dim');
                    blinkAction(main); // Muncul lagi dengan kedipan puitis
                }, 400);
            }
        });
    }, 150);
}
