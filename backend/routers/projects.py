import os
import shutil
import uuid
import json

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session, select

from database import get_session
from models import Project

router = APIRouter()

UPLOAD_DIR = "uploads"
ALLOWED_TYPES = {"image/jpeg", "image/jpg", "image/png", "image/webp"}


def _serialize(p: Project) -> dict:
    return {
        "id": p.id,
        "brand_name": p.brand_name,
        "product_description": p.product_description,
        "target_audience": p.target_audience,
        "image_path": p.image_path,
        "analysis": json.loads(p.analysis_json) if p.analysis_json else None,
        "content": json.loads(p.content_json) if p.content_json else None,
        "creatives": json.loads(p.creatives_json) if p.creatives_json else None,
        "created_at": p.created_at,
    }


@router.post("/projects", status_code=201)
async def create_project(
    brand_name: str = Form(...),
    product_description: str = Form(...),
    target_audience: str = Form(...),
    image: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(400, "Only JPEG, PNG, and WEBP images are supported.")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(image.filename or "product")[1] or ".jpg"
    fname = f"{uuid.uuid4()}{ext}"
    path = os.path.join(UPLOAD_DIR, fname)

    with open(path, "wb") as f:
        shutil.copyfileobj(image.file, f)

    project = Project(
        brand_name=brand_name,
        product_description=product_description,
        target_audience=target_audience,
        image_path=path,
    )
    session.add(project)
    session.commit()
    session.refresh(project)
    return {"id": project.id}


@router.get("/projects")
def list_projects(session: Session = Depends(get_session)):
    projects = session.exec(select(Project).order_by(Project.id.desc())).all()
    return [_serialize(p) for p in projects]


@router.get("/projects/{project_id}")
def get_project(project_id: int, session: Session = Depends(get_session)):
    p = session.get(Project, project_id)
    if not p:
        raise HTTPException(404, "Project not found")
    return _serialize(p)


@router.delete("/projects/{project_id}")
def delete_project(project_id: int, session: Session = Depends(get_session)):
    p = session.get(Project, project_id)
    if not p:
        raise HTTPException(404, "Project not found")
    if p.image_path and os.path.exists(p.image_path):
        os.remove(p.image_path)
    session.delete(p)
    session.commit()
    return {"ok": True}
