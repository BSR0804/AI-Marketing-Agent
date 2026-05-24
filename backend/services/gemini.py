import json
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

load_dotenv(override=True)


def _client() -> genai.Client:
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
    load_dotenv(dotenv_path=env_path, override=True)
    key = os.getenv("GEMINI_API_KEY", "")
    if not key or key == "your_gemini_api_key_here":
        raise ValueError("GEMINI_API_KEY not set — edit backend/.env and add your key.")
    return genai.Client(api_key=key)


MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


def _parse_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        parts = text.split("```")
        text = parts[1] if len(parts) > 1 else text
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


VISION_PROMPT = """You are a senior brand strategist analyzing a product image for a marketing campaign.

Using the product image and the brand context below, return ONLY a valid JSON object with exactly these keys:

{
  "product_category": "string (e.g. Skincare, Fashion, Food & Beverage, Tech, Fitness)",
  "brand_tone": "string (e.g. Minimalist & Premium, Playful & Gen-Z, Bold & Energetic)",
  "positioning": "string — 1-2 sentence market positioning statement",
  "audience_insights": {
    "primary_age": "string (e.g. 25-35)",
    "lifestyle": "string (e.g. Urban professional, Health-conscious millennial)",
    "pain_points": ["string", "string", "string"],
    "motivations": ["string", "string", "string"]
  },
  "platform_priorities": [
    {"platform": "Instagram", "rationale": "string", "content_format": "string"},
    {"platform": "TikTok", "rationale": "string", "content_format": "string"},
    {"platform": "LinkedIn", "rationale": "string", "content_format": "string"}
  ],
  "visual_attributes": ["string", "string", "string", "string"],
  "competitive_angle": "string — what makes this stand out vs. competitors"
}

Return ONLY valid JSON. No markdown fences, no extra text."""


CONTENT_PROMPT = """You are a top-tier social media copywriter. Generate ready-to-post marketing content.

Brand Analysis:
{analysis}

Brand: {brand_name}
Product: {product_description}
Target Audience: {target_audience}

Return ONLY a valid JSON object with exactly these keys:

{
  "instagram_captions": [
    {"caption": "string (with emojis, 1-3 sentences)", "tone": "string"},
    {"caption": "string", "tone": "string"},
    {"caption": "string", "tone": "string"}
  ],
  "ad_copy": [
    {"headline": "string (max 8 words)", "body": "string (2-3 sentences)", "platform": "Instagram"},
    {"headline": "string", "body": "string", "platform": "Google"},
    {"headline": "string", "body": "string", "platform": "Meta"}
  ],
  "hooks": ["string", "string", "string", "string", "string"],
  "ctas": ["string", "string", "string", "string", "string"],
  "hashtags": {
    "primary": ["#string", "#string", "#string", "#string", "#string"],
    "niche": ["#string", "#string", "#string", "#string", "#string"],
    "trending": ["#string", "#string", "#string", "#string", "#string"]
  }
}

Return ONLY valid JSON. No markdown fences, no extra text."""


CREATIVE_PROMPT = """You are a Creative Director at a top digital agency. Develop creative campaign concepts.

Brand Analysis:
{analysis}

Content Generated:
{content}

Brand: {brand_name}

Return ONLY a valid JSON object with exactly these keys:

{
  "reel_ideas": [
    {
      "title": "string",
      "concept": "string (2-3 sentence description)",
      "shot_list": ["string", "string", "string", "string", "string"],
      "music_vibe": "string",
      "duration": "string (e.g. 15s, 30s, 60s)",
      "hook_line": "string"
    },
    {
      "title": "string",
      "concept": "string",
      "shot_list": ["string", "string", "string", "string", "string"],
      "music_vibe": "string",
      "duration": "string",
      "hook_line": "string"
    }
  ],
  "carousel_ideas": [
    {
      "title": "string",
      "slide_count": 6,
      "slide_breakdown": ["Slide 1: string", "Slide 2: string", "Slide 3: string", "Slide 4: string", "Slide 5: string", "Slide 6: string"],
      "cta_slide": "string"
    },
    {
      "title": "string",
      "slide_count": 5,
      "slide_breakdown": ["Slide 1: string", "Slide 2: string", "Slide 3: string", "Slide 4: string", "Slide 5: string"],
      "cta_slide": "string"
    }
  ],
  "campaigns": [
    {
      "name": "string",
      "concept": "string (2-3 sentences)",
      "channels": ["string", "string", "string"],
      "kpis": ["string", "string", "string"],
      "duration": "string (e.g. 4 weeks)",
      "hero_message": "string (the central campaign tagline)"
    },
    {
      "name": "string",
      "concept": "string",
      "channels": ["string", "string", "string"],
      "kpis": ["string", "string", "string"],
      "duration": "string",
      "hero_message": "string"
    }
  ]
}

Return ONLY valid JSON. No markdown fences, no extra text."""


def run_vision_analysis(image_path: str, brand_name: str, product_description: str, target_audience: str) -> dict:
    client = _client()
    img = Image.open(image_path)
    prompt = (
        f"{VISION_PROMPT}\n\n"
        f"Brand Name: {brand_name}\n"
        f"Product Description: {product_description}\n"
        f"Target Audience: {target_audience}"
    )
    response = client.models.generate_content(
        model=MODEL,
        contents=[prompt, img],
    )
    return _parse_json(response.text)


def _fill(template: str, **vars) -> str:
    # str.format would choke on the literal { } in the JSON schema inside prompts.
    out = template
    for k, v in vars.items():
        out = out.replace("{" + k + "}", str(v))
    return out


def run_content_generation(analysis: dict, brand_name: str, product_description: str, target_audience: str) -> dict:
    client = _client()
    prompt = _fill(
        CONTENT_PROMPT,
        analysis=json.dumps(analysis, indent=2),
        brand_name=brand_name,
        product_description=product_description,
        target_audience=target_audience,
    )
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )
    return _parse_json(response.text)


def run_creative_generation(analysis: dict, content: dict, brand_name: str) -> dict:
    client = _client()
    prompt = _fill(
        CREATIVE_PROMPT,
        analysis=json.dumps(analysis, indent=2),
        content=json.dumps(content, indent=2),
        brand_name=brand_name,
    )
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
    )
    return _parse_json(response.text)
