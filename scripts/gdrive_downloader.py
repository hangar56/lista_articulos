import requests
from bs4 import BeautifulSoup

def get_direct_download_link(drive_url):
    # Extract the file ID from the Google Drive URL
    file_id = drive_url.split('/d/')[1].split('/')[0]
    direct_link = f"https://drive.google.com/uc?export=download&id={file_id}"
    return direct_link

def download_image(url, save_path):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful
        with open(save_path, 'wb') as file:
            file.write(response.content)
        print(f"Downloaded: {url}")
    except requests.exceptions.RequestException as e:
        print(f"Failed to download {url}: {e}")

def download_images_from_file(file_path):
    with open(file_path, 'r') as file:
        links = file.readlines()
    
    for i, link in enumerate(links):
        link = link.strip()
        if link:
            direct_link = get_direct_download_link(link)
            save_path =f"images\\" + f"image_{i+1}.jpeg"  # Save each file with a unique name
            download_image(direct_link, save_path)

if __name__ == "__main__":
    # Change this to the path of your text file with hyperlinks
    file_path = "F:\data\lista_articulos\out_hyper.txt"
    download_images_from_file(file_path)
