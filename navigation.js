document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const whatToEatIframe = document.querySelector('iframe[src="eat/what_to_eat.html"]');

    function syncIframeTheme() {
        // Ensure the global variable is available before trying to send it
        if (whatToEatIframe && whatToEatIframe.contentWindow && window.dailyThemeColor) {
            whatToEatIframe.contentWindow.postMessage({ themeColor: window.dailyThemeColor }, '*');
        }
    }

    navLinks.forEach(link => {
        if (link.dataset.target) {
            link.addEventListener('click', function(event) {
                event.preventDefault();

                const targetId = this.dataset.target;

                navLinks.forEach(navLink => navLink.classList.remove('active'));
                this.classList.add('active');

                contentSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === targetId) {
                        section.classList.add('active');
                    }
                });

                if (targetId === 'what-to-eat-content') {
                    // A short delay can help ensure the iframe is ready
                    setTimeout(syncIframeTheme, 100);
                }
            });
        }
    });

    if (whatToEatIframe) {
        whatToEatIframe.addEventListener('load', syncIframeTheme);
    }
});
