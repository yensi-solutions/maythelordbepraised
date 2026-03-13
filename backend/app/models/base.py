from datetime import datetime, timezone
from bson import ObjectId


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def to_object_id(id_str: str) -> ObjectId:
    return ObjectId(id_str)


def to_str(oid: ObjectId) -> str:
    return str(oid)
