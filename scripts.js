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
      throw new Error("No anime entries found.");
    }

    return {
      media: latestWatching.media,
      updatedAt: latestWatching.updatedAt
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Function to apply the trans-colored effect to a string
function applyTransColoredEffect(text) {
  return text.split('').map((letter, index) => {
    const span = document.createElement('span');
    span.textContent = letter;
    // Apply color based on position
    const colors = ['#55CDFC', '#F7A8B8', '#FFFFFF', '#F7A8B8', '#55CDFC'];
    span.style.color = colors[index % colors.length];
    return span.outerHTML;
  }).join('');
}

// Function to update the HTML with the last watched anime title and timestamp
function updateLastWatchedAnimeInfo(title, timestamp) {
  const animeInfoDiv = document.getElementById('last-watched-anime-info');
  if (animeInfoDiv) {
    // Convert the Unix timestamp (if in milliseconds) to a Date object
    const formattedDate = new Date(timestamp * 1000).toLocaleString(); // Convert from seconds to milliseconds

    // Apply trans-colored effect to the timestamp and the label
    const formattedDateTransColored = applyTransColoredEffect(formattedDate);
    const watchedOnLabel = applyTransColoredEffect('Watched on:');
    const titleTransColored = applyTransColoredEffect(title);

    animeInfoDiv.innerHTML = `
          <p>${applyTransColoredEffect('Title:')} ${titleTransColored}</p>
          <p>${watchedOnLabel} ${formattedDateTransColored}</p>
      `;
  }
}

// Function to compare two timestamps and display the newer one
function compareAndDisplayNewer(anime1, anime2) {
  const newerAnime = (anime1.updatedAt > anime2.updatedAt) ? anime1 : anime2;
  const title = newerAnime.media.title.romaji || newerAnime.media.title.english;
  updateLastWatchedAnimeInfo(title, newerAnime.updatedAt);
}

// Example usage
const userName = "LikosTerapagos"; // Replace with the desired username
const statusCurrent = "CURRENT";
const statusRewatching = "REPEATING";

Promise.all([
  fetchLastWatchedAnime(userName, statusCurrent),
  fetchLastWatchedAnime(userName, statusRewatching)
])
  .then(([currentAnime, rewatchingAnime]) => {
    compareAndDisplayNewer(currentAnime, rewatchingAnime);
  })
  .catch(error => {
    console.error("Error fetching last watched anime:", error);
  });



function applyTransColoredEffectToAll() {
    document.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach(element => {
        const text = element.textContent;
        element.innerHTML = ''; // Clear the current text

        // Split text into spans and append to the element
        text.split('').forEach(letter => {
            const span = document.createElement('span');
            span.textContent = letter;
            element.appendChild(span);
        });

        element.classList.add('trans-colored');
    });
}

// Initial application of trans-colored effect to all text elements
applyTransColoredEffectToAll();


function applyTransColoredEffectToList() {
  // Select all list items within the trans-colored class
  document.querySelectorAll('ul.trans-colored li').forEach(li => {
      const text = li.textContent;
      li.innerHTML = ''; // Clear the current text

      // Wrap each letter in a span
      text.split('').forEach((letter, index) => {
          const span = document.createElement('span');
          span.textContent = letter;
          li.appendChild(span);
      });
  });
}

// Call the function to apply the effect
applyTransColoredEffectToList();
