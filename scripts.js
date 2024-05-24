const fetch = require('node-fetch');

// Function to fetch last watched anime from AniList API
function fetchLastWatchedAnime(username) {
    const query = `
    query {
      User (name: "${username}") {
        statistics {
          anime {
            mediaList {
              status
              score
              progress
              updatedAt
              media {
                id
                title {
                  romaji
                  english
                  native
                }
              }
            }
          }
        }
      }
    }`;

    fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query: query
        })
    })
    .then(response => response.json())
    .then(data => {
        // Log the response from the API
        console.log('API Response:', data);

        // Extracting the last watched anime
        const lastWatchedAnime = data.data.User.statistics.anime.mediaList[0].media;
        console.log('Last Watched Anime:', lastWatchedAnime);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

// Call the function with the username
fetchLastWatchedAnime("Likosterapagos");
