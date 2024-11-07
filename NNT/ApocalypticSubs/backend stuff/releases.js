document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("releases-container");

    // Fetch the JSON file and process it
    fetch("../backend stuff/releases.json")
        .then(response => response.json())
        .then(data => {
            // Get the query parameter from the URL
            const urlParams = new URLSearchParams(window.location.search);
            const requestedId = urlParams.keys().next().value;

            // Filter data if an id is specified in the query
            const filteredData = requestedId ? data.filter(release => release.id === requestedId) : data.slice().reverse();

            // Determine if the current page is English or Portuguese
            const isPortuguese = window.location.pathname.includes('/br/');

            // Loop through each release and create HTML structure
            filteredData.forEach(release => {
                const releaseDiv = document.createElement("div");
                releaseDiv.classList.add("release");

                // Set image with a placeholder if missing
                const img = document.createElement("img");
                img.src = release.image || "/NNT/ApocalypticSubs/backend stuff/releasephotos/placeholder.png";
                img.alt = `${release.displaytext || "Release"} Image`;
                releaseDiv.appendChild(img);

                // Set the link based on the language
                const langLink = isPortuguese ? release.br : release.en;
                const langText = langLink
                    ? `Download ${release.displaytext || "Release"} (${isPortuguese ? "PT-BR" : "EN"})`
                    : (isPortuguese ? "Estamos trabalhando duro para o lançamento, por favor, entre no nosso Discord para atualizações" : "We are working on this release, please join our Discord for updates");

                const downloadLink = document.createElement("a");
                downloadLink.href = langLink || "https://discord.gg/AsjunzY5"; // Redirect to Discord if link is missing
                downloadLink.textContent = langText; // Keeps the appropriate text based on the link availability
                releaseDiv.appendChild(downloadLink);

                // Append each release to the container
                container.appendChild(releaseDiv);
            });

            // Display message if no release matches the requested id
            if (requestedId && filteredData.length === 0) {
                const noMatchMessage = document.createElement("p");
                noMatchMessage.textContent = "No matching release found.";
                container.appendChild(noMatchMessage);
            }
        })
        .catch(error => console.error("Error loading releases:", error));
});
