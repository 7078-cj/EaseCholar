from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

from .config import HEADERS, NON_PROGRAM_PATH_HINTS, SOURCES


def _strip_www(host):
    return host[4:] if host.startswith("www.") else host


def discover_scholarship_links(
    hub_url,
    allow_subdomains=False,
    fallback_urls=None,
):
    """
    Discover scholarship/program links starting from a hub page.

    - allow_subdomains=False: only keeps links on the *exact* same host as
      hub_url, and only single-segment top-level paths (e.g.
      https://legacy.ched.gov.ph/merit-scholarship/). This matches how the
      CHED legacy site is organized.

    - allow_subdomains=True: also keeps links on any subdomain of the hub's
      base domain (e.g. hub is science-scholarships.ph, and
      jlss.science-scholarships.ph counts too), since some sites put each
      program on its own subdomain instead of a sub-path. For subdomain
      links, the root page itself is the program page, so an empty path is
      allowed; for the hub's own host, a single top-level path segment is
      still required.

    Falls back to fallback_urls (or an empty list) if the request fails or
    nothing usable is found -- e.g. when the hub page is a JS-rendered SPA
    with no crawlable <a> tags in the raw HTML.
    """

    fallback_urls = fallback_urls or []

    try:
        response = requests.get(hub_url, headers=HEADERS, timeout=15)
        response.raise_for_status()
    except requests.RequestException:
        return fallback_urls

    soup = BeautifulSoup(response.text, "html.parser")

    hub_parsed = urlparse(hub_url)
    hub_host = _strip_www(hub_parsed.netloc.lower())
    hub_normalized = hub_url.rstrip("/") + "/"

    found = []

    for a in soup.find_all("a", href=True):
        raw_href = a["href"].split("#")[0].split("?")[0].strip()

        if not raw_href or raw_href.lower().startswith(("mailto:", "tel:", "javascript:")):
            continue

        href = urljoin(hub_url, raw_href)
        parsed = urlparse(href)

        if parsed.scheme not in ("http", "https"):
            continue

        href_host = _strip_www(parsed.netloc.lower())

        same_host = href_host == hub_host
        is_subdomain = allow_subdomains and href_host.endswith("." + hub_host)

        if not (same_host or is_subdomain):
            continue

        if any(hint in href.lower() for hint in NON_PROGRAM_PATH_HINTS):
            continue

        normalized = href.rstrip("/") + "/"

        if normalized == hub_normalized:
            continue

        path = parsed.path.strip("/")

        if same_host:
            # Same host as the hub: require a single top-level path segment,
            # e.g. /merit-scholarship/ -- mirrors the CHED-style layout.
            if not path or "/" in path:
                continue
        else:
            # Subdomain microsite: the root page counts as the program page.
            # Allow at most one extra path segment beyond the root.
            if path.count("/") > 1:
                continue

        found.append(normalized)

    found = sorted(set(found))

    if not found:
        return fallback_urls

    return found


def discover_all_sources(sources=SOURCES):
    """Run discovery across every configured source and return a flat,
    deduplicated list of scholarship URLs tagged with their source name."""

    all_urls = []

    for source in sources:
        urls = discover_scholarship_links(
            hub_url=source["hub_url"],
            allow_subdomains=source.get("allow_subdomains", False),
            fallback_urls=source.get("fallback_urls", []),
        )

        print(f"[{source['name']}] discovered {len(urls)} link(s)")

        all_urls.extend(urls)

    seen = set()
    deduped = []

    for url in all_urls:
        if url not in seen:
            seen.add(url)
            deduped.append(url)

    return deduped