// lastwatchedanime.js

// Function to fetch the latest watched anime
async function fetchLastWatchedAnime(userName, status) {
  console.log(`Fetching last watched anime for ${userName} with status: ${status}`); // Log the function call
  const baseURL = "https://graphql.anilist.co";
  const headers = {
    "Content-Type": "application/json",
  };

  const query = `
      query ($username: String!, $status: MediaListStatus!) {
          latestWatching: MediaList(
              userName: $username
              status: $status
              type: ANIME
              sort: UPDATED_TIME_DESC
          ) {
              media {
                  id
                  title {
                      romaji
                      english
                  }
              }
              updatedAt
              progress
          }
      }
  `;

  const variables = {
    username: userName,
    status: status
  };

  try {
    console.log("Sending GraphQL request:", { query, variables }); // Log the request details
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    });

    console.log("Response received:", response); // Log the response object

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch data: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch data: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("Parsed JSON response:", data); // Log the parsed JSON data
    const latestWatching = data.data.latestWatching;

    if (!latestWatching || !latestWatching.media) {
      console.warn(`No anime entries found for status: ${status}`);
      return null;
    }

    return {
      media: latestWatching.media,
      updatedAt: latestWatching.updatedAt,
      progress: latestWatching.progress,
      status: status
    };
  } catch (error) {
    console.error("Error fetching last watched anime:", error);
    throw error;
  }
}

// Function to update the HTML with the last watched anime title, timestamp, and episode
function updateLastWatchedAnimeInfo(title, timestamp, status, progress) {
  console.log("Updating anime info with:", { title, timestamp, status, progress }); // Log the function call
  const animeInfoDiv = document.getElementById('last-watched-anime-info');
  if (animeInfoDiv) {
    // Format the date as dd/mm/yy
    const formattedDate = new Date(timestamp * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    // Format the time as hour:minute (24-hour format)
    const formattedTime = new Date(timestamp * 1000).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const label = status === "COMPLETED" ? 'Completed on:' : 'Watched on:';
    const dateTime = `${formattedDate} ${formattedTime}`;

    let progressInfo = '';
    if (status !== "COMPLETED" && progress) {
      const progressLabel = 'Last watched episode:';
      const progressValue = `Episode ${progress}`;
      progressInfo = `<p>${progressLabel} ${progressValue}</p>`;
    }

    animeInfoDiv.innerHTML = `
          <p>Title: ${title}</p>
          <p>${label} ${dateTime}</p>
          ${progressInfo}
      `;
    console.log("Anime info updated in HTML"); // Log when the HTML is updated
  } else {
    console.warn("Element with ID 'last-watched-anime-info' not found.");
  }
}

// Function to compare multiple timestamps and display the most recent anime
function compareAndDisplayNewest(...animes) {
  console.log("Comparing anime entries:", animes); // Log the anime entries
  const validAnimes = animes.filter(anime => anime !== null);
  console.log("Valid anime entries:", validAnimes); // Log the valid entries
  if (validAnimes.length === 0) {
    console.warn("No valid anime entries to compare.");
    return;
  }

  // Find the anime with the most recent updated timestamp
  const newestAnime = validAnimes.reduce((latest, current) => {
    const result = (current.updatedAt > latest.updatedAt) ? current : latest;
    console.log("Comparing:", current.media?.title?.romaji, "vs", latest.media?.title?.romaji, "Result:", result.media?.title?.romaji);
    return result;
  });

  console.log("Newest anime:", newestAnime); // Log the newest anime
  const title = newestAnime.media.title.romaji || newestAnime.media.title.english;
  updateLastWatchedAnimeInfo(title, newestAnime.updatedAt, newestAnime.status, newestAnime.progress);
}

// Example usage
const userName = "LikosTerapagos"; // Replace with the desired username
const statusCurrent = "CURRENT";
const statusRewatching = "REPEATING";
const statusCompleted = "COMPLETED";

// Store the fetched data
let cachedAnimeData = null;

// Function to fetch and cache anime data on page load
async function loadAndCacheAnimeData() {
  console.log("Loading and caching anime data on page load...");
  try {
    const [currentAnime, rewatchingAnime, completedAnime] = await Promise.all([
      fetchLastWatchedAnime(userName, statusCurrent),
      fetchLastWatchedAnime(userName, statusRewatching),
      fetchLastWatchedAnime(userName, statusCompleted)
    ]);
    cachedAnimeData = [currentAnime, rewatchingAnime, completedAnime];
    console.log("Anime data cached:", cachedAnimeData);
  } catch (error) {
    console.error("Error fetching and caching anime data on page load:", error);
    cachedAnimeData = null; // Clear the cache on error
  }
}

// Call the function to load and cache the data on page load
loadAndCacheAnimeData();

// Function to display the cached anime data
function displayCachedAnimeData() {
  if (cachedAnimeData) {
    console.log("Displaying cached anime data...");
    compareAndDisplayNewest(...cachedAnimeData);
  } else {
    console.warn("No cached anime data available.");
  }
}
