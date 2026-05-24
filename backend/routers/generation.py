import json

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from database import get_session
from models import Project
from services.gemini import run_vision_analysis, run_content_generation, run_creative_generation

router = APIRouter()


def _get_or_404(project_id: int, session: Session) -> Project:
    p = session.get(Project, project_id)
    if not p:
        raise HTTPException(404, "Project not found")
    return p


@router.post("/projects/{project_id}/analyze")
def analyze(project_id: int, session: Session = Depends(get_session)):
    p = _get_or_404(project_id, session)
    try:
        result = run_vision_analysis(
            p.image_path, p.brand_name, p.product_description, p.target_audience
        )
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, f"Gemini error: {e}")

    p.analysis_json = json.dumps(result)
    session.add(p)
    session.commit()
    return {"analysis": result}


@router.post("/projects/{project_id}/content")
def content(project_id: int, session: Session = Depends(get_session)):
    p = _get_or_404(project_id, session)
    if not p.analysis_json:
        raise HTTPException(400, "Run analysis first before generating content.")
    analysis = json.loads(p.analysis_json)

    try:
        result = run_content_generation(
            analysis, p.brand_name, p.product_description, p.target_audience
        )
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, f"Gemini error: {e}")

    p.content_json = json.dumps(result)
    session.add(p)
    session.commit()
    return {"content": result}


@router.post("/projects/{project_id}/creatives")
def creatives(project_id: int, session: Session = Depends(get_session)):
    p = _get_or_404(project_id, session)
    if not p.content_json:
        raise HTTPException(400, "Run content generation first.")
    analysis = json.loads(p.analysis_json) if p.analysis_json else {}
    content = json.loads(p.content_json)

    try:
        result = run_creative_generation(analysis, content, p.brand_name)
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, f"Gemini error: {e}")

    p.creatives_json = json.dumps(result)
    session.add(p)
    session.commit()
    return {"creatives": result}
