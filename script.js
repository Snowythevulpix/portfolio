document.addEventListener('DOMContentLoaded', () => {
    const innerBoxes = document.querySelectorAll('.inner-box');
    const centralBox = document.querySelector('.central-box');
    let activeContentBox = null;

    innerBoxes.forEach(box => {
        box.addEventListener('click', () => {
            const content = box.dataset.content;

            // If a content box is already active and it's the same box, close it
            if (activeContentBox && activeContentBox.parentNode.previousElementSibling === box) {
                activeContentBox.style.opacity = 0;
                activeContentBox.classList.remove('active');
                centralBox.classList.remove('active');
                setTimeout(() => {
                    activeContentBox.remove();
                    activeContentBox = null;
                }, 300);
                return; // Exit the function to prevent reopening
            }

            // If a content box is already active, hide it
            if (activeContentBox) {
                activeContentBox.style.opacity = 0;
                activeContentBox.classList.remove('active');
                centralBox.classList.remove('active');
                setTimeout(() => {
                    activeContentBox.remove();
                    activeContentBox = null;
                    // Create the content box *after* the old one is removed
                    createContentBox(content, box);
                }, 300);
            } else {
                // If no content box is active, create it immediately
                createContentBox(content, box);
            }
        });
    });

    // Function to create and position the content box
    function createContentBox(content, box) {
        const contentBox = document.createElement('div');
        contentBox.classList.add('content-box');
        contentBox.innerHTML = content; // Use innerHTML
        document.body.appendChild(contentBox);

        // Position the content box
        const centralBoxRect = centralBox.getBoundingClientRect();
        contentBox.style.top = (centralBoxRect.bottom - 5) + 'px'; // Move up by 5px
        contentBox.style.display = 'block'; // Or 'flex' if you want to use flexbox for the content box
        contentBox.style.opacity = 0; // Start hidden
        contentBox.classList.add('active');
        centralBox.classList.add('active');
        setTimeout(() => {
            contentBox.style.opacity = 1; // Fade in
        }, 10);
        activeContentBox = contentBox;

        // Load the anime information *after* the content box is created
        if (box.dataset.content.includes('last_watched_anime')) { // Check if it's the anime box
            console.log("Loading anime info...");
            // Display cached data if available, otherwise, do nothing (it will load on page load)
            if (typeof displayCachedAnimeData === 'function') {
                displayCachedAnimeData();
            }
        }
    }

    // Add a click listener to the document to close the content box when clicking outside
    document.addEventListener('click', (event) => {
        if (activeContentBox && !event.target.closest('.inner-box') &&
            !event.target.closest('.content-box')) {
            activeContentBox.style.opacity = 0; // Fade out
            activeContentBox.classList.remove('active');
            centralBox.classList.remove('active');
            setTimeout(() => {
                activeContentBox.remove();
                activeContentBox = null;
            }, 300); // Match the transition duration
        }
    });
});
