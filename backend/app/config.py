from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Project
    project_name: str = "maythelordbepraised"
    environment: str = "development"

    # Server
    backend_port: int = 15782

    # MongoDB
    mongodb_url: str = "mongodb://localhost:15783"
    mongodb_db_name: str = "maythelordbepraised"

    # Redis
    redis_url: str = "redis://localhost:15784"

    # Keycloak
    keycloak_url: str = "http://localhost:15785"
    keycloak_realm: str = "mtlbp"
    keycloak_client_id: str = "mtlbp-api"
    keycloak_client_secret: str = "change-me"

    # Stripe
    stripe_secret_key: str = "sk_test_changeme"
    stripe_webhook_secret: str = "whsec_changeme"

    # MinIO
    minio_endpoint: str = "localhost:15787"
    minio_access_key: str = "minioadmin"
    minio_secret_key: str = "minioadmin"
    minio_bucket: str = "mtlbp-uploads"

    # Frontend URLs (for CORS)
    pastor_portal_url: str = "http://localhost:15780"
    follower_portal_url: str = "http://localhost:15781"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
