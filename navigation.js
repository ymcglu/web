document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        // We only want to add click listeners to links that target local content
        if (link.dataset.target) {
            link.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default anchor behavior

                const targetId = this.dataset.target;

                // Handle active state for navigation links
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');

                // Handle visibility of content sections
                contentSections.forEach(section => {
                    if (section.id === targetId) {
                        section.classList.add('active');
                    } else {
                        section.classList.remove('active');
                    }
                });
            });
        }
    });
});
