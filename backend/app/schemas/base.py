from pydantic import BaseModel


class BaseResponse(BaseModel):
    id: str

    class Config:
        from_attributes = True
