import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

from database import create_db_and_tables
from routers import projects, generation

load_dotenv(override=True)

# Create uploads dir before StaticFiles mount (it errors if dir is missing)
os.makedirs("uploads", exist_ok=True)

app = FastAPI(title="MARKET/AGENT API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


# Serve uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(projects.router, prefix="/api")
app.include_router(generation.router, prefix="/api")


@app.get("/api/health")
def health():
    key = os.getenv("GEMINI_API_KEY", "")
    return {"status": "ok", "gemini_configured": bool(key)}
