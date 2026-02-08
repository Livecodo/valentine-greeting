document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const mainContent = document.getElementById('main-content');
    const videoContainer = document.getElementById('video-container');

    // Make 'No' button evade cursor (Smooth Physics based)

    let btnX = 0;
    let btnY = 0;
    // Velocity
    let vx = 0;
    let vy = 0;

    // Initialize position
    const initBtn = () => {
        const rect = noBtn.getBoundingClientRect();
        btnX = rect.left;
        btnY = rect.top;
        noBtn.style.position = 'absolute';
        noBtn.style.left = `${btnX}px`;
        noBtn.style.top = `${btnY}px`;
    };

    let isRunning = false;
    // Default mouse far away
    let mouseX = -1000;
    let mouseY = -1000;

    // Start loop after a tiny delay to ensure layout is done
    setTimeout(() => {
        initBtn();
        isRunning = true;
        loop();
    }, 100);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const loop = () => {
        const rect = noBtn.getBoundingClientRect();
        // Center of button
        const centerX = btnX + rect.width / 2;
        const centerY = btnY + rect.height / 2;

        let dx = centerX - mouseX;
        let dy = centerY - mouseY;

        const dist = Math.sqrt(dx * dx + dy * dy);

        // If mouse is close (Increase radius for "impossible" feel)
        if (dist < 300) {
            const force = (300 - dist) / 300; // 0 to 1
            // Push away harder
            const speed = 3.5; // High Acceleration
            vx += (dx / dist) * force * speed;
            vy += (dy / dist) * force * speed;
        }

        // Apply friction to slow down
        vx *= 0.92;
        vy *= 0.92;

        // Apply velocity
        btnX += vx;
        btnY += vy;

        // Boundaries (Teleport if cornered)
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        if (btnX < 0 || btnX > maxX || btnY < 0 || btnY > maxY) {
            // Teleport to a random spot within bounds
            btnX = Math.random() * maxX;
            btnY = Math.random() * maxY;
            // Reset velocity to 0 after teleport so it doesn't fly off immediately
            vx = 0;
            vy = 0;
        }

        noBtn.style.left = `${btnX}px`;
        noBtn.style.top = `${btnY}px`;

        requestAnimationFrame(loop);
    };

    // If they somehow click or hover, push it immediately and violently
    const emergencyEvade = (e) => {
        // Add a huge random velocity burst if touched
        vx += (Math.random() - 0.5) * 50;
        vy += (Math.random() - 0.5) * 50;
    }

    noBtn.addEventListener('mouseover', emergencyEvade);
    noBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Stop click
        emergencyEvade();
    });
    // noBtn.addEventListener('touchstart', emergencyEvade); // Covered by mouseover/click usually, but let's leave physics loop to handle proximity

    // 'Yes' button functionality
    // Move this BEFORE the loop or check for errors
    yesBtn.addEventListener('click', () => {
        console.log("Yes button clicked"); // Debug
        mainContent.classList.add('hidden');
        videoContainer.classList.remove('hidden');

        // Ensure video is visible by forcing display style if class doesn't work
        videoContainer.style.display = 'flex';
    });
});
