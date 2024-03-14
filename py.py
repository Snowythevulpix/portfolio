import spotipy
from spotipy.oauth2 import SpotifyOAuth

# Spotify API credentials
CLIENT_ID = '2f8ef001cceb4b4dbe29ab83e7673864'
CLIENT_SECRET = 'c3a09ef610fc4fddb6f29763bb572fc8'
REDIRECT_URI = 'https://discord.gg/uWAXKetBS8'

# Function to get the name and album art of the last song
def get_newest_song():
    scope = "user-read-recently-played"
    sp = spotipy.Spotify(auth_manager=SpotifyOAuth(client_id=CLIENT_ID, client_secret=CLIENT_SECRET, redirect_uri=REDIRECT_URI, scope=scope))
    recent_tracks = sp.current_user_recently_played(limit=1)
    if recent_tracks['items']:
        track = recent_tracks['items'][0]['track']
        name = track['name']
        album_art_url = track['album']['images'][0]['url'] if track['album']['images'] else None
        print(f"You recently listened to '{name}'")
        if album_art_url:
            print("Album Art:", album_art_url)
        else:
            print("No album art available.")
    else:
        print("You haven't listened to any tracks recently.")

# Main function
def main():
    get_newest_song()

if __name__ == "__main__":
    main()
