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

  // Log the request payload for debugging
  console.log("Request payload:", JSON.stringify({
    query: query,
    variables: variables
  }));

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
    console.log("Response data:", data);
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

// Function to update the HTML with the last watched anime title and timestamp
function updateLastWatchedAnimeInfo(title, timestamp) {
  const animeInfoDiv = document.getElementById('last-watched-anime-info');
  if (animeInfoDiv) {
    // Convert the Unix timestamp (if in milliseconds) to a Date object
    const formattedDate = new Date(timestamp * 1000).toLocaleString(); // Convert from seconds to milliseconds

    animeInfoDiv.innerHTML = `
      <p>Title: ${title}</p>
      <p>Watched on: ${formattedDate}</p>
    `;
  }
}

// Function to compare two timestamps and display the newer one
function compareAndDisplayNewer(anime1, anime2) {
  const newerAnime = (anime1.updatedAt > anime2.updatedAt) ? anime1 : anime2;
  const title = newerAnime.media.title.english || newerAnime.media.title.romaji;
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



// New code for make_vote function and informational text

// Helper Functions
function SetCookie(cookieName, cookieValue, nDays) {
  var today = new Date();
  var expire = new Date();
  if (nDays == null || nDays == 0) nDays = 1;

  var now = new Date();
  var nowUtc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
  expire.setDate(today.getDate() + nDays);

  var expireTime = expire.getTime();
  var nowUtcTime = nowUtc.getTime();
  var distance = expireTime - nowUtcTime;

  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  var newFinalDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + hours, now.getMinutes() + minutes, now.getSeconds() + seconds);

  document.cookie = cookieName + "=" + escape(cookieValue) + ";expires=" + newFinalDate.toGMTString() + "; path=/";
}

function readCookie(cookieName) {
  var re = new RegExp('[; ]' + cookieName + '=([^\s;]*)');
  var sMatch = (' ' + document.cookie).match(re);
  if (cookieName && sMatch) return unescape(sMatch[1]);
  return '';
}

// Main Function
function make_vote() {
  var cur_clicks = parseInt(readCookie('clicks_left_9414'));
  if (!cur_clicks && cur_clicks != 0) {
    cur_clicks = 1;
  }

  if (cur_clicks > 0) {
    var data = {
      action: 'make_vote_action',
      button_id: 9414,
      security: '13fe735c10'
    };

    jQuery.ajax({
      url: 'https://arab.org/wp-admin/admin-ajax.php',
      type: 'POST',
      data: data,
      beforeSend: function (msg) { },
      success: function (msg) {
        console.log(msg); // Confirm donation made
      },
      error: function (msg) { }
    });
  }

  cur_clicks--;
  if (cur_clicks == 0) {
    jQuery('.img_pointer').fadeOut();
    jQuery('.img_pointer').attr('src', 'https://arab.org/wp-content/uploads/2017/03/checkmark.gif');
    jQuery('.img_pointer').fadeIn();
    jQuery('.btn_rev').attr('disabled', 'disabled');
    SetCookie('clicks_left_9414', 0, 1);

    jQuery('.sub_text').html('Your click has been registered, please come back & click again tomorrow');
  }

  if (cur_clicks > 0) {
    SetCookie('clicks_left_9414', cur_clicks, 1);
    jQuery('.click_num').html(cur_clicks);
  }
}

// Auto run make_vote on page load
document.addEventListener('DOMContentLoaded', function () {
  console.log('donation made');
  make_vote();

  // Add the informational text to the page
  const infoText = document.createElement('div');
  infoText.className = 'info-text';
  infoText.textContent = 'Once daily when you load this page, a donation is made to Palestine';
  document.body.appendChild(infoText);
});
