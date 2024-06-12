// scripts.js

async function fetchLastWatchedAnime(userName) {
  const baseURL = "https://graphql.anilist.co";
  const headers = {
    "Content-Type": "application/json",
  };

  const query = `
      query ($userName: String) {
          MediaListCollection(userName: $userName, type: ANIME) {
              lists {
                  entries {
                      media {
                          id
                          title {
                              english
                          }
                          updatedAt
                      }
                      status
                  }
              }
          }
      }
  `;

  const variables = {
    userName: userName
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
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    const mediaLists = data.data.MediaListCollection.lists;
    let lastWatchedAnime = null;
    let lastWatchedTimestamp = 0;

    // Iterate through all entries to find the last watched anime
    mediaLists.forEach(list => {
      list.entries.forEach(entry => {
        // Check if the status indicates an episode was watched
        if (entry.status === 'WATCHING' || (entry.status === 'REPEATING' && lastWatchedAnime === null)) {
          const updatedAt = entry.media.updatedAt;
          // Check if this entry was updated more recently than the current last watched anime
          if (updatedAt > lastWatchedTimestamp) {
            lastWatchedAnime = entry.media;
            lastWatchedTimestamp = updatedAt;
          }
        }
      });
    });

    if (!lastWatchedAnime) {
      throw new Error("No anime entries found.");
    }

    return lastWatchedAnime;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Function to update the HTML with the last watched anime title
function updateLastWatchedAnimeTitle(title) {
  const animeInfoDiv = document.getElementById('last-watched-anime-info');
  if (animeInfoDiv) {
    animeInfoDiv.innerHTML = "<p>" + title + "</p>";
  }
}

// Example usage
const userName = "LikosTerapagos"; // Replace with the desired username
fetchLastWatchedAnime(userName)
  .then(lastWatchedAnime => {
    console.log("Last watched anime:", lastWatchedAnime);
    const englishTitle = lastWatchedAnime.title.english;
    updateLastWatchedAnimeTitle(englishTitle);
  })
  .catch(error => {
    console.error("Error fetching last watched anime:", error);
  });
