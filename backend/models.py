from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    brand_name: str
    product_description: str
    target_audience: str
    image_path: str = ""
    analysis_json: Optional[str] = None
    content_json: Optional[str] = None
    creatives_json: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
