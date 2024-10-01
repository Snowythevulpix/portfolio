import requests
from bs4 import BeautifulSoup
import os

# URL of the page to scrape
url = 'https://showmanga.blog.fc2.com/blog-entry-1790.html'

# Get the page content
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

# Create a directory to store the images
os.makedirs('images', exist_ok=True)

# Find all image links on the page
image_links = []
for img_tag in soup.find_all('img'):
    img_url = img_tag.get('src')
    if img_url.startswith('https://i.ibb.co/'):
        image_links.append(img_url)

# Download and save the images
for idx, img_link in enumerate(image_links, start=1):
    img_data = requests.get(img_link).content
    with open(f'images/{idx}.jpg', 'wb') as f:
        f.write(img_data)
    print(f"Downloaded: {img_link}")

print("All images downloaded successfully!")
