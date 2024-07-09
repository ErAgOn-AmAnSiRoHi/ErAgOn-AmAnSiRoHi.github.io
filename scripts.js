document.addEventListener('DOMContentLoaded', () => {
    const starsWrapper = document.getElementById("star-animation");
    const customCursor = document.createElement('div');
    customCursor.classList.add('custom-cursor');
    document.body.appendChild(customCursor);

    // Create force field
    const forceField = document.createElement('div');
    forceField.classList.add('force-field');
    document.body.appendChild(forceField);

    // Create force field rings
    const ringCount = 5; // Increased number of rings
    for (let i = 0; i < ringCount; i++) {
        const ring = document.createElement('div');
        ring.classList.add('force-field-ring');
        ring.style.animationDelay = `${i * 0.5}s`;
        forceField.appendChild(ring);
        setRandomEllipse(ring);
    }

    function setRandomEllipse(ring) {
        const scaleX = 0.8 + Math.random() * 0.4; // Random scale between 0.8 and 1.2
        const scaleY = 0.8 + Math.random() * 0.4;
        const rotation = Math.random() * 360; // Random rotation
        ring.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;
        ring.style.animationDelay = `${Math.random() * 2}s`; // Random delay
    }

    // Periodically change ring shapes
    setInterval(() => {
        forceField.querySelectorAll('.force-field-ring').forEach(setRandomEllipse);
    }, 2000); // Change every 2 seconds

    // Update custom cursor and force field position
    document.addEventListener('mousemove', (e) => {
        const x = `${e.clientX}px`;
        const y = `${e.clientY}px`;
        customCursor.style.left = x;
        customCursor.style.top = y;
        forceField.style.left = x;
        forceField.style.top = y;
    });

    // Show/hide custom cursor and force field based on star animation visibility
    const starAnimation = document.getElementById('star-animation');
    starAnimation.addEventListener('mouseenter', () => {
        customCursor.style.display = 'block';
        forceField.style.opacity = '1';
    });

    starAnimation.addEventListener('mouseleave', () => {
        customCursor.style.display = 'none';
        forceField.style.opacity = '0';
    });

    // Hide custom cursor and force field when scrolling past the star animation
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight) {
            customCursor.style.display = 'none';
            forceField.style.opacity = '0';
        }
    });

    const stars = new Array(200).fill(0).map(() => {
        const star = document.createElement("div");
        starsWrapper.append(star);
        return {
            star,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 2,
            speed: Math.random() * 0.5,
            originalXSpeed: 0,
            originalYSpeed: 0,
            diverting: false,
            divertingTime: 0
        };
    });

    function animateStars() {
        stars.forEach((star) => {
            star.x += star.speed;
            if (star.x > window.innerWidth) {
                star.x = 0;
            }

            const mouseX = event ? event.clientX : 0;
            const mouseY = event ? event.clientY : 0;
            const distanceToMouse = Math.sqrt(
                Math.pow(star.x - mouseX, 2) + Math.pow(star.y - mouseY, 2)
            );

            if (distanceToMouse < 100 && !star.diverting) {
                star.diverting = true;
                star.originalXSpeed = star.speed;
                star.originalYSpeed = star.speed;
                const angle = Math.atan2(star.y - mouseY, star.x - mouseX);
                star.speed = 0.8;
                star.x += Math.cos(angle) * star.speed;
                star.y += Math.sin(angle) * star.speed;
            } else if (star.diverting) {
                star.divertingTime += 1;
                const angle = Math.atan2(star.y - mouseY, star.x - mouseX);
                star.x += Math.cos(angle) * star.speed;
                star.y += Math.sin(angle) * star.speed;

                if (star.divertingTime > 60) {
                    star.diverting = false;
                    star.divertingTime = 0;
                    star.speed = star.originalXSpeed;
                }
            }

            star.star.style.transform = `translate(${star.x}px, ${star.y}px) scale(${star.r})`;
            star.star.style.opacity = `${star.r / 2}`;
        });
        requestAnimationFrame(animateStars);
    }

    animateStars();

    // Hide star animation when scrolling down
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition > window.innerHeight) {
            starsWrapper.style.display = 'none';
        } else {
            starsWrapper.style.display = 'block';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerOffset = document.querySelector('header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            window.scrollBy({
                top: elementPosition - headerOffset,
                behavior: 'smooth'
            });
        });
    });

    // Load GitHub profile badge script
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/Rapsssito/github-profile-badge@latest/src/widget.min.js';
    script.async = true;
    document.body.appendChild(script);

    // Function to truncate strings
    function truncateString(str, num) {
        if (str.length <= num) {
            return str;
        }
        return str.slice(0, num) + '...';
    }

    // Function to fetch and display GitHub repositories
    function fetchAndDisplayProjects() {
        const username = 'ErAgOn-AmAnSiRoHi';
        const projectsContainer = document.getElementById('projects-container');

        fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`)
            .then(response => response.json())
            .then(data => {
                const projects = data.slice(0, 6);
                projects.forEach(project => {
                    const projectElement = document.createElement('div');
                    projectElement.className = 'project';
                    projectElement.innerHTML = `
                        <h3>${truncateString(project.name, 50)}</h3>
                        <p>${project.description ? truncateString(project.description, 100) : 'No description available.'}</p>
                        <div class="project-links">
                            <a href="${project.html_url}" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                            ${project.homepage ? `<a href="${project.homepage}" target="_blank" rel="noopener noreferrer">Live Demo</a>` : ''}
                        </div>
                    `;
                    projectsContainer.appendChild(projectElement);
                });
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
                projectsContainer.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
            });
    }

    // Call the function to fetch and display projects
    fetchAndDisplayProjects();

    // Make header sticky on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // Add event listener for mousemove to track mouse position
    window.addEventListener('mousemove', (e) => {
        event = e; // Update the global 'event' variable
    });
});