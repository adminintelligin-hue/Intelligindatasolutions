/* ============================================================
   INTELLIGIN — ANIMATION ENGINE V3.0
   Canvas Particles · GSAP Typo · Scroll Effects · Form
   ============================================================ */

// ---- CUSTOM CURSOR ----
const cur = document.getElementById('cur');
const curF = document.getElementById('cur-follower');
if (cur && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function loop() {
        cur.style.left = mx + 'px'; cur.style.top = my + 'px';
        fx += (mx - fx) * 0.1; fy += (my - fy) * 0.1;
        if (curF) { curF.style.left = fx + 'px'; curF.style.top = fy + 'px'; }
        requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .svc-card, input, select, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => { cur.style.cssText += ';width:16px;height:16px;'; if (curF) curF.style.cssText += ';width:50px;height:50px;'; });
        el.addEventListener('mouseleave', () => { cur.style.cssText += ';width:10px;height:10px;'; if (curF) curF.style.cssText += ';width:32px;height:32px;'; });
    });
}

// ---- 3D THREE.JS BACKGROUND ENGINE ----
function initThreeJSBackground() {
    if (typeof THREE === 'undefined') return;
    
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.0005);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(1);
    
    // Make the canvas global and fixed behind everything
    const canvas = renderer.domElement;
    canvas.id = 'global-3d-bg';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    canvas.style.opacity = '0.85';
    document.body.prepend(canvas);

    // ============ GIANT HOLOGRAPHIC 3D ELEMENT ============
    const main3DGroup = new THREE.Group();

    // 1. Inner glowing core
    const coreGeo = new THREE.IcosahedronGeometry(200, 1);
    const coreMat = new THREE.MeshPhysicalMaterial({
        color: 0x1a3cff,
        emissive: 0x1a3cff,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.85,
        roughness: 0.15,
        metalness: 0.9
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);

    // 2. Outer wireframe shell
    const shellGeo = new THREE.IcosahedronGeometry(260, 2);
    const shellMat = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        wireframe: true,
        transparent: true,
        opacity: 0.25
    });
    const shellMesh = new THREE.Mesh(shellGeo, shellMat);

    // 3. Second outer radiant halo ring
    const haloGeo = new THREE.TorusGeometry(300, 4, 16, 100);
    const haloMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.15
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2;

    // 4. Second halo ring (perpendicular)
    const halo2Mesh = new THREE.Mesh(
        new THREE.TorusGeometry(320, 3, 16, 100),
        new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.1 })
    );
    halo2Mesh.rotation.y = Math.PI / 2;

    main3DGroup.add(coreMesh);
    main3DGroup.add(shellMesh);
    main3DGroup.add(haloMesh);
    main3DGroup.add(halo2Mesh);
    
    // Position it dead center so it's perfectly visible in every section
    main3DGroup.position.set(0, 0, -50);

    scene.add(main3DGroup);
    
    // Attach to window so GSAP can grab it later
    window._main3DElement = main3DGroup;

    // Lights - orbiting for radiant effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x00f0ff, 4, 1200);
    pointLight.position.set(300, 300, 150);
    scene.add(pointLight);
    
    const pointLight2 = new THREE.PointLight(0x3b82f6, 4, 1200);
    pointLight2.position.set(-300, -300, -150);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x8b5cf6, 3, 1000);
    pointLight3.position.set(0, 300, -200);
    scene.add(pointLight3);
    // ========================================================

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.05;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.05;
    });

    // Radiant color palette (deep blue -> cyan -> purple -> blue)
    const radiantColors = [
        new THREE.Color(0x1a3cff),  // Intelligin Blue
        new THREE.Color(0x00f0ff),  // Cyan
        new THREE.Color(0x3b82f6),  // Sky Blue
        new THREE.Color(0x8b5cf6),  // Purple
        new THREE.Color(0x1a3cff)   // Back to Blue
    ];

    function animate() {
        requestAnimationFrame(animate);
        const t = performance.now() * 0.001; // time in seconds

        // Slow auto-rotation
        main3DGroup.rotation.y += 0.003;
        main3DGroup.rotation.x += 0.001;

        // Halo rings spin independently
        haloMesh.rotation.z += 0.005;
        halo2Mesh.rotation.z -= 0.004;

        // Pulsing emissive glow (breathe effect)
        const pulse = 0.3 + Math.sin(t * 1.5) * 0.25;
        coreMat.emissiveIntensity = pulse;

        // Shell opacity pulse
        shellMat.opacity = 0.15 + Math.sin(t * 2) * 0.1;
        haloMat.opacity = 0.1 + Math.sin(t * 1.2) * 0.08;

        // Slow color cycling on emissive
        const colorPhase = (t * 0.15) % 1;
        const colorIdx = Math.floor(colorPhase * (radiantColors.length - 1));
        const colorT = (colorPhase * (radiantColors.length - 1)) - colorIdx;
        const currentColor = radiantColors[colorIdx].clone().lerp(radiantColors[Math.min(colorIdx + 1, radiantColors.length - 1)], colorT);
        coreMat.emissive.copy(currentColor);

        // Orbit the lights around the object
        pointLight.position.x = Math.sin(t * 0.5) * 350;
        pointLight.position.z = Math.cos(t * 0.5) * 350;
        pointLight2.position.x = Math.sin(t * 0.3 + 2) * 350;
        pointLight2.position.z = Math.cos(t * 0.3 + 2) * 350;
        pointLight3.position.y = Math.sin(t * 0.4) * 300;
        pointLight3.position.x = Math.cos(t * 0.4) * 200;

        // Camera follow mouse parallax
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    
    animate();
}

// ---- VANILLA TYPEWRITER EFFECT ----
const texts = ["Custom Software", "Digital Marketing", "AI Agents", "Data Engineering", "Mini ERP Systems"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter');

function type() {
    if(!typewriterEl) return;
    const currentText = texts[textIndex];
    if (isDeleting) {
        typewriterEl.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterEl.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 100;
    
    // Pause momentarily when word is fully typed or completely deleted
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
}
// Start typing immediately after page load
setTimeout(type, 1000);

// ---- PRELOADER ----
const preloader = document.getElementById('preloader');
const preMsg = document.getElementById('pre-msg');
const msgs = ['Initializing AI Engine...', 'Loading Data Systems...', 'Syncing Analytics...', 'Preparing Experience...'];
let mIdx = 0;
const mTimer = setInterval(() => { if (preMsg) preMsg.textContent = msgs[mIdx = (mIdx + 1) % msgs.length]; }, 600);

window.addEventListener('load', () => {
    clearInterval(mTimer);
    initThreeJSBackground(); // start immediately
    setTimeout(() => {
        if (preloader) preloader.classList.add('done');
        initGSAP();
    }, 1900);
});
setTimeout(() => { if (preloader && !preloader.classList.contains('done')) { preloader.classList.add('done'); initGSAP(); } }, 4200);

// ---- MOBILE NAV ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); navLinks.classList.toggle('open'); });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { hamburger.classList.remove('open'); navLinks.classList.remove('open'); }));
}

// ---- NAV SCROLL ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { if (nav) nav.classList.toggle('scrolled', window.scrollY > 60); }, { passive: true });

// ---- FLIP CARDS (touch) ----
document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('click', () => { if (window.matchMedia('(pointer: coarse)').matches) card.classList.toggle('flipped'); });
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); } });
});

// ---- GSAP ENGINE ----
function initGSAP() {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // ============ 3D BACKGROUND ZOOM SYNC ============
    if (window._main3DElement) {
        gsap.to(window._main3DElement.rotation, {
            y: Math.PI * 4,
            x: Math.PI * 2,
            z: Math.PI,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5
            }
        });
    }

    // ============ HERO ENTRY ============
    // Badge tag
    gsap.fromTo('.hero-badge .typo-w',
        { y: '130%', opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
    );
    // Big title words
    gsap.fromTo('.hero-title .typo-w',
        { y: '115%', opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.055, ease: 'power4.out', delay: 0.45, clearProps: 'transform,opacity' }
    );
    // Subtext, buttons, stats
    gsap.fromTo('.hero-sub',   { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 1.1, ease: 'power3.out' });
    gsap.fromTo('.hero-actions', { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 1.25, ease: 'power3.out' });
    gsap.fromTo('.hero-stats',   { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 1.4, ease: 'power3.out' });
    // Panel slides in
    gsap.fromTo('.hero-panel',  { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.4, delay: 0.7, ease: 'power3.out' });
    gsap.from('.stat-pill', { scale: 0.8, opacity: 0, duration: 0.5, stagger: 0.1, delay: 1.6, ease: 'back.out(2)' });
    // Animate the metric bar filling
    gsap.fromTo('.mbar-fill', { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 1.8, delay: 1.3, ease: 'power2.out' });

    // ============ UNIVERSAL TYPO ON ALL SECTIONS ============
    // This picks up every .sec-head automatically
    document.querySelectorAll('.sec-head, .about-left').forEach(head => {
        const label = head.querySelector('.sec-label, .typo-label');
        const words = head.querySelectorAll('.typo-w');
        const sub = head.querySelector('.sec-sub, .about-body');

        const trigger = { trigger: head, start: 'top 88%', toggleActions: 'play none none none' };

        if (label) {
            gsap.fromTo(label, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: trigger });
        }
        if (words.length) {
            gsap.fromTo(words,
                { y: '115%', opacity: 0 },
                { y: 0, opacity: 1, duration: 1.1, stagger: 0.04, ease: 'power4.out', clearProps: 'transform,opacity', scrollTrigger: trigger }
            );
        }
        if (sub) {
            gsap.fromTo(sub, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: 'power2.out', scrollTrigger: trigger });
        }
    });

    // ============ ABOUT SECTION ============
    gsap.fromTo('.about-badges .about-badge',
        { y: 20, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '.about-badges', start: 'top 85%' } }
    );
    gsap.fromTo('.feat-item',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-features', start: 'top 82%' } }
    );

    // ============ INTERACTIVE 3D TILTS ============
    document.querySelectorAll('.svc-card, .why-card, .ben-card, .proc-step, .about-badge').forEach(card => {
        // Set CSS dynamically for 3D
        gsap.set(card, { transformStyle: 'preserve-3d', transformPerspective: 1000 });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(card, {
                duration: 0.4,
                rotationY: (x / rect.width) * 15,
                rotationX: -(y / rect.height) * 15,
                ease: 'power1.out',
                boxShadow: '0 20px 40px rgba(26,60,255,0.2)'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { 
                duration: 0.7, 
                rotationY: 0, 
                rotationX: 0, 
                ease: 'power3.out',
                clearProps: 'boxShadow'
            });
        });
    });

    // ============ SCRUBBING PARALLAX SCROLL ============
    document.querySelectorAll('.sec-head').forEach(head => {
        gsap.to(head, {
            y: 80,
            opacity: 0,
            scrollTrigger: {
                trigger: head,
                start: "top center",
                end: "bottom top",
                scrub: 1
            }
        });
    });

    // ============ SERVICE CARDS: 3D Perspective Entrance ============
    gsap.fromTo('.svc-card',
        { y: 80, opacity: 0, rotationX: 18, scale: 0.9 },
        { y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 0.9, stagger: 0.07, ease: 'back.out(1.3)',
          scrollTrigger: { trigger: '#services-sec', start: 'top 78%' } }
    );

    // ============ PROCESS STEPS ============
    gsap.fromTo('.proc-step',
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '#proc-sec', start: 'top 80%' } }
    );
    gsap.fromTo('.proc-num',
        { scale: 0.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(2.5)',
          scrollTrigger: { trigger: '#proc-sec', start: 'top 80%' } }
    );

    // ============ BENEFITS ============
    gsap.fromTo('.ben-card',
        { y: 40, opacity: 0, scale: 0.93 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.07, ease: 'back.out(1.2)',
          scrollTrigger: { trigger: '#ben-sec', start: 'top 78%' } }
    );
    // Animate benefit stats
    document.querySelectorAll('.ben-stat').forEach(stat => {
        gsap.fromTo(stat, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)',
            scrollTrigger: { trigger: stat.closest('.ben-card'), start: 'top 85%' } });
    });

    // ============ WHY CARDS ============
    gsap.fromTo('.why-card',
        { y: 55, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '#why-sec', start: 'top 78%' } }
    );
    gsap.fromTo('.why-stat',
        { y: 15, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '#why-sec', start: 'top 78%' } }
    );

    // ============ TEAM CARDS ============
    gsap.fromTo('.team-card',
        { y: 50, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.18, ease: 'power3.out',
          scrollTrigger: { trigger: '#about-team', start: 'top 80%' } }
    );

    // ============ REVIEWS ============
    gsap.fromTo('.review-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.13, ease: 'power3.out',
          scrollTrigger: { trigger: '#reviews-sec', start: 'top 80%' } }
    );
    gsap.fromTo('.rating-score',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(2)',
          scrollTrigger: { trigger: '.rating-badge', start: 'top 85%' } }
    );

    // ============ METRICS BELT ============
    gsap.fromTo('.metric-chip',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.metrics-belt', start: 'top 92%' } }
    );

    // ============ CONTACT ============
    gsap.fromTo('.contact-info',
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: '#con-sec', start: 'top 80%' } }
    );
    gsap.fromTo('.contact-form-wrap',
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, delay: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '#con-sec', start: 'top 80%' } }
    );
    gsap.fromTo('.ci-item',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '.contact-info', start: 'top 82%' } }
    );

    // ============ FOOTER ============
    gsap.fromTo('.footer-col',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: { trigger: '#footer', start: 'top 92%' } }
    );

    // ============ SCROLL-PROGRESS INDICATOR ============
    gsap.fromTo('.wa-float', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)', delay: 2 });
}

// ---- GOOGLE SHEETS + EMAILJS FORM ----
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const msgEl = document.getElementById('form-msg');

        btn.textContent = 'Sending...';
        btn.disabled = true;
        if (msgEl) { msgEl.style.display = 'none'; msgEl.className = 'form-msg'; }

        const fd = new FormData(contactForm);
        const formData = {
            name: fd.get('name') || '',
            contact: fd.get('contact') || '',
            company: fd.get('company') || '',
            service: fd.get('service') || '',
            message: fd.get('message') || '',
            timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        };
        const params = new URLSearchParams(formData);

        const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzHOa9N0h9LUnpSdk8cmJy7rKHhFkH4K87VzmhrUFmPnfouJXiDrvNIA1okG1xC16wL/exec';

        try {
            // 1. Send to Google Sheets
            await fetch(`${SHEET_URL}?${params}`, { method: 'GET', mode: 'no-cors' });

            // 2. Send email notification via EmailJS
            if (typeof emailjs !== 'undefined') {
                try {
                    await emailjs.send('service_bx666ch', 'template_5cz74c5', {
                        from_name: formData.name,
                        contact: formData.contact,
                        company: formData.company,
                        service: formData.service,
                        message: formData.message,
                        timestamp: formData.timestamp
                    });
                } catch (emailErr) {
                    console.log('EmailJS fallback - Sheet submission succeeded.');
                }
            }

            if (msgEl) {
                msgEl.style.display = 'block';
                msgEl.className = 'form-msg';
                msgEl.textContent = 'Success - Message received! We will call you within 24 hours.';
            }
            contactForm.reset();
        } catch {
            if (msgEl) {
                msgEl.style.display = 'block';
                msgEl.className = 'form-msg error';
                msgEl.textContent = 'Error - Could not send. Please call +91 8418803403 directly.';
            }
        } finally {
            btn.textContent = 'Send & Book Free Call';
            btn.disabled = false;
        }
    });
}

// ============ GLOBAL DETAILS MODAL LOGIC ============
(function initGlobalModal() {
    const modalHTML = `
        <div class="global-modal-overlay" id="global-modal-overlay">
            <div class="global-modal">
                <button class="modal-close" id="modal-close">&times;</button>
                <div class="modal-title" id="modal-title">Details</div>
                <div class="modal-body" id="modal-body">Processing details...</div>
                <a href="#con-sec" class="modal-cta" id="modal-cta">Discuss this with us</a>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const overlay = document.getElementById('global-modal-overlay');
    const closeBtn = document.getElementById('modal-close');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');

    function openModal(title, text) {
        titleEl.textContent = title;
        bodyEl.innerHTML = text + '<br><br><strong>Why Intelligin?</strong> Our engineering team can deploy a custom solution for this capability within 3-6 weeks, heavily reducing your operational overhead.';
        overlay.classList.add('active');
    }

    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => { if(e.target === overlay) overlay.classList.remove('active'); });

    document.querySelectorAll('.svc-card, .why-card, .ben-card, .proc-step, .about-badge').forEach(card => {
        card.style.cursor = 'none';
        card.addEventListener('click', () => {
            let title = "Feature Focus";
            let text = "We handle complex data integrations to make your workflow significantly more efficient.";

            const h3 = card.querySelector('h3, .svc-title, .why-title, .ben-title, .proc-title, h4');
            const p = card.querySelector('p, .svc-desc, .why-desc, .ben-desc, .proc-desc');
            
            if(h3) title = h3.textContent;
            if(p) text = p.textContent;
            
            const ul = card.querySelector('ul');
            if(ul) text += '<br><br>' + ul.outerHTML;

            openModal(title, text);
        });
    });
})();
