document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("releases-container");

    // Fetch the JSON file and process it
    fetch("../backend stuff/releases.json")
        .then(response => response.json())
        .then(data => {
            // Reverse the order of the JSON data
            const reversedData = data.slice().reverse();

            // Determine if the current page is English or Portuguese
            const isPortuguese = window.location.pathname.includes('/br/');

            // Loop through each release and create HTML structure
            reversedData.forEach(release => {
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
                    : (isPortuguese ? "Mei language oui oui or smthn" : "We are working on this release, please join our Discord for updates");

                const downloadLink = document.createElement("a");
                downloadLink.href = langLink || "https://discord.gg/AsjunzY5"; // Redirect to Discord if link is missing
                downloadLink.textContent = langText; // Keeps the appropriate text based on the link availability
                releaseDiv.appendChild(downloadLink);

                // Append each release to the container
                container.appendChild(releaseDiv);
            });
        })
        .catch(error => console.error("Error loading releases:", error));
});
