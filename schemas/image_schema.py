from pydantic import BaseModel
from typing import Optional

class ImageBase(BaseModel):
    url: str
    project_id: int

class ImageCreate(ImageBase):
    pass

class Image(ImageBase):
    id: int

    class Config:
        from_attributes = True
