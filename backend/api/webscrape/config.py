import re

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    )
}

NON_PROGRAM_PATH_HINTS = [
    "about-us",
    "contact-us",
    "careers",
    "central-office",
    "regional-offices",
    "announcements",
    "procurement",
    "public-consultations",
    "issuances",
    "press-releases",
    "statistics",
    "publication",
    "forms/",
    "sitemap",
    "privacy-notice",
    "privacy-policy",
    "grants/",
    "eteeap",
    "list-of-higher-education",
    "national-higher-education-day",
    "programs-and-projects",
    "gender-and-development",
    "organization-structure",
    "citizens-charter",
    "sdg-rdig",
    "pcari",
    "continuing-professional-development",
    "privacy-awareness",
    "official-organization-structure",
    "endorsed-events-activities",
    "transparency-seal",
    "wp-content",
    "login",
    "register",
    "signup",
    "sign-up",
    "faqs",
    "terms",
]

# ---------------------------------------------------------------------------
# Per-source configuration.
#
# "allow_subdomains" controls how discover_scholarship_links() matches links:
#   - False -> only links on the exact same host as hub_url are kept
#              (mirrors the CHED legacy site, which uses one host + paths)
#   - True  -> links on the hub host OR any subdomain of its base domain are
#              kept (needed for science-scholarships.ph, which puts each
#              program on its own subdomain, e.g. jlss.science-scholarships.ph)
# ---------------------------------------------------------------------------

SOURCES = [
    {
        "name": "CHED",
        "provider": "CHED",
        "hub_url": "https://legacy.ched.gov.ph/stufaps/",
        "allow_subdomains": False,
        "fallback_urls": [
            "https://legacy.ched.gov.ph/merit-scholarship/",
            "https://legacy.ched.gov.ph/estatistikolar/",
            "https://legacy.ched.gov.ph/coscho/",
            "https://legacy.ched.gov.ph/msrs/",
            "https://legacy.ched.gov.ph/sida-sgp/",
            "https://legacy.ched.gov.ph/acef-giahep/",
            "https://legacy.ched.gov.ph/unifast/",
            "https://legacy.ched.gov.ph/mtpsp/",
            "https://legacy.ched.gov.ph/cgms-sucs/",
            "https://legacy.ched.gov.ph/sikap/",
        ],
    },
    {
        "name": "DOST-SEI",
        "provider": "DOST-SEI",
        "hub_url": "https://science-scholarships.ph/",
        # The homepage is a JS-rendered single-page app (the e-application
        # portal), so static discovery usually finds nothing there and this
        # falls back to the list below. allow_subdomains=True is kept on in
        # case the SPA ever server-renders nav links, since each program
        # lives on its own subdomain rather than a sub-path.
        "allow_subdomains": True,
        "fallback_urls": [
            # Undergraduate scholarship (Merit / RA 7687) overview
            "https://www.science-scholarships.ph/undergrad/",
            # General program overview / support page (lists ASTHRDP, CBPSME, etc.)
            "https://www.science-scholarships.ph/support/",
            # Junior Level Science Scholarship (JLSS)
            "https://jlss.science-scholarships.ph/",
            # Capacity Building Program in Science and Mathematics Education
            "https://cbpsme.science-scholarships.ph/",
            # Engineering Research and Development for Technology
            "https://erdt.science-scholarships.ph/",
            # Accelerated Science and Technology Human Resource Dev. Program
            "https://asthrdp.science-scholarships.ph/",
        ],
    },
]

# Kept for backward compatibility with code that imports these directly.
HUB_URL = SOURCES[0]["hub_url"]
FALLBACK_SCHOLARSHIP_URLS = SOURCES[0]["fallback_urls"]


def get_provider_for_url(url, default="Unknown"):
    """Best-effort lookup of which SOURCES entry a URL belongs to,
    used to fill in the 'provider' field for the LLM prompt."""

    host_match = re.match(r"https?://([^/]+)", url)
    host = host_match.group(1).lower() if host_match else ""

    for source in SOURCES:
        hub_host_match = re.match(r"https?://([^/]+)", source["hub_url"])
        hub_host = hub_host_match.group(1).lower() if hub_host_match else ""
        base_domain = hub_host[4:] if hub_host.startswith("www.") else hub_host

        if host == hub_host or host.endswith("." + base_domain) or host == base_domain:
            return source["provider"]

    return default