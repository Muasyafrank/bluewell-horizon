
import getpass
import http.server
import json
import secrets
import sys
import urllib.error
import urllib.parse
import urllib.request

PORT = 8765
REDIRECT_URI = f"http://localhost:{PORT}"
SCOPE = "https://www.googleapis.com/auth/gmail.send"  # send only: cannot read or delete mail
AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"


def build_auth_url(client_id: str, state: str) -> str:
    return AUTH_URL + "?" + urllib.parse.urlencode({
        "client_id": client_id,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": SCOPE,
        "access_type": "offline",
        "prompt": "consent",
        "state": state,
    })


def code_from_redirect(url: str, expected_state: str) -> str:
    """The authorisation code in Google's redirect, or exit with a clear reason."""
    query = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
    if query.get("state", [None])[0] != expected_state:
        sys.exit("That answer did not belong to this request (state mismatch). Run the script again.")
    if "error" in query:
        sys.exit(f"Google said: {query['error'][0]}")
    if "code" not in query:
        sys.exit("Google's answer had no authorisation code. Run the script again.")
    return query["code"][0]


def wait_for_redirect() -> str:
    """Listens on localhost until the browser is sent back with Google's answer."""
    captured: dict = {}

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):  # noqa: N802 (name fixed by the base class)
            if "code=" in self.path or "error=" in self.path:
                captured["url"] = REDIRECT_URI + self.path
            self.send_response(200)
            self.send_header("content-type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"<h2>Done. You can close this tab and return to the terminal.</h2>")

        def log_message(self, *args):  # keep the terminal quiet
            pass

    with http.server.HTTPServer(("127.0.0.1", PORT), Handler) as server:
        while "url" not in captured:
            server.handle_request()
    return captured["url"]


def exchange_code(code: str, client_id: str, client_secret: str) -> dict:
    body = urllib.parse.urlencode({
        "code": code, "client_id": client_id, "client_secret": client_secret,
        "redirect_uri": REDIRECT_URI, "grant_type": "authorization_code",
    }).encode()
    request = urllib.request.Request(
        TOKEN_URL, data=body, method="POST",
        headers={"content-type": "application/x-www-form-urlencoded"},
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            return json.loads(response.read())
    except urllib.error.HTTPError as error:
        sys.exit(f"Google refused the code ({error.code}): {error.read().decode()[:300]}")


def main() -> None:
    client_id = input("OAuth client ID: ").strip()
    client_secret = getpass.getpass("OAuth client secret (hidden): ").strip()
    if not client_id or not client_secret:
        sys.exit("Both the client ID and the client secret are needed.")

    state = secrets.token_urlsafe(16)
    print("\nOpen this link in your browser and sign in with the Gmail account that should send the mail:\n")
    print(build_auth_url(client_id, state))
    print(f"\nWaiting for Google's answer on {REDIRECT_URI} ...")

    code = code_from_redirect(wait_for_redirect(), state)
    tokens = exchange_code(code, client_id, client_secret)
    refresh = tokens.get("refresh_token")
    if not refresh:
        sys.exit("Google did not return a refresh token. Remove this app at "
                 "https://myaccount.google.com/permissions and run the script again.")

    print("\nAdd these lines to backend_fastapi/.env. EMAIL_USER must be the Gmail address you just signed in with:\n")
    print(f"GMAIL_CLIENT_ID={client_id}")
    print(f"GMAIL_CLIENT_SECRET={client_secret}")
    print(f"GMAIL_REFRESH_TOKEN={refresh}")
    print("\nThen restart the backend.")


if __name__ == "__main__":
    main()
