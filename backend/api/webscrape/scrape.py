import time

from .parser import scrape_ched_page


def scrape_multiple(urls):

    scholarships = []

    for url in urls:

        print(f"Scraping {url}")

        scholarship = scrape_ched_page(url)

        if scholarship:
            scholarships.append(scholarship)

        time.sleep(2)

    return scholarships