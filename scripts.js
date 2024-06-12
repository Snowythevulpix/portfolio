// Existing code for fetching last watched anime

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
