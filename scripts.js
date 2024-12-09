// Function to fetch the latest watched anime
async function fetchLastWatchedAnime(userName, status) {
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
    const response = await fetch(baseURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        query: query,
        variables: variables
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch data: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
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
    console.error("Error:", error);
    throw error;
  }
}

// Function to update the HTML with the last watched anime title, timestamp, and episode
function updateLastWatchedAnimeInfo(title, timestamp, status, progress) {
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
  }
}

// Function to compare multiple timestamps and display the most recent anime
function compareAndDisplayNewest(...animes) {
  const validAnimes = animes.filter(anime => anime !== null);
  if (validAnimes.length === 0) {
    console.warn("No valid anime entries to compare.");
    return;
  }

  // Find the anime with the most recent updated timestamp
  const newestAnime = validAnimes.reduce((latest, current) =>
    (current.updatedAt > latest.updatedAt) ? current : latest
  );

  const title = newestAnime.media.title.romaji || newestAnime.media.title.english;
  updateLastWatchedAnimeInfo(title, newestAnime.updatedAt, newestAnime.status, newestAnime.progress);
}

// Example usage
const userName = "LikosTerapagos"; // Replace with the desired username
const statusCurrent = "CURRENT";
const statusRewatching = "REPEATING";
const statusCompleted = "COMPLETED";

Promise.all([
  fetchLastWatchedAnime(userName, statusCurrent),
  fetchLastWatchedAnime(userName, statusRewatching),
  fetchLastWatchedAnime(userName, statusCompleted)
])
  .then(([currentAnime, rewatchingAnime, completedAnime]) => {
    compareAndDisplayNewest(currentAnime, rewatchingAnime, completedAnime);
  })
  .catch(error => {
    console.error("Error fetching last watched anime:", error);
  });
