from .config import get_provider_for_url
from .fetch import fetch_page

# Keep the combined prompt from growing unbounded. Adjust if your model's
# context window can comfortably fit more.
MAX_HTML_CHARS = 6000


def extract_page_content(url):
    """Fetch a single URL and pull out its title + main content HTML.
    Returns None if the page can't be fetched or has no usable content."""

    try:
        soup = fetch_page(url)
    except Exception as exc:
        print(f"Failed to fetch {url}: {exc}")
        return None

    title = (
        soup.select_one("h1").get_text(strip=True)
        if soup.select_one("h1")
        else "Unknown Scholarship"
    )

    article = (
        soup.select_one("article")
        or soup.select_one(".entry-content")
        or soup.select_one("main")
        or soup.body
    )

    if article is None:
        return None

    html = str(article)[:MAX_HTML_CHARS]

    return {
        "url": url,
        "title": title,
        "provider": get_provider_for_url(url),
        "html": html,
    }


def collect_pages(urls):
    """Fetch every URL and return the list of usable page payloads."""

    pages = []

    for url in urls:
        print(f"Fetching {url}")

        page = extract_page_content(url)

        if page:
            pages.append(page)

    return pages