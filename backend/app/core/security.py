import httpx
from jose import JWTError, jwt

from app.config import settings

_jwks_cache: dict | None = None


async def get_keycloak_public_key() -> dict:
    global _jwks_cache
    if _jwks_cache is None:
        base = settings.keycloak_url
        realm = settings.keycloak_realm
        url = f"{base}/realms/{realm}/protocol/openid-connect/certs"
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            _jwks_cache = response.json()
    return _jwks_cache


async def verify_token(token: str) -> dict | None:
    try:
        jwks = await get_keycloak_public_key()
        header = jwt.get_unverified_header(token)
        key = None
        for k in jwks.get("keys", []):
            if k["kid"] == header.get("kid"):
                key = k
                break
        if key is None:
            return None

        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=settings.keycloak_client_id,
            issuer=f"{settings.keycloak_url}/realms/{settings.keycloak_realm}",
        )
        return payload
    except JWTError:
        return None


def invalidate_jwks_cache() -> None:
    global _jwks_cache
    _jwks_cache = None
