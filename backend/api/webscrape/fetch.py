import requests
from bs4 import BeautifulSoup

from .config import HEADERS


def fetch_page(url):
    response = requests.get(
        url,
        headers=HEADERS,
        timeout=20,
    )
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")

    return soup