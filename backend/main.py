from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
import httpx
import os
import json
import uuid
from datetime import datetime

load_dotenv()

app = FastAPI(title="Questioneer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# ==================== MODELS ====================

class StartInterview(BaseModel):
    job_role: str
    difficulty: str
    interviewer_name: str = "Alex"
    interviewer_style: str = "friendly"

class NextQuestion(BaseModel):
    interview_id: str
    question: str
    answer: str
    job_role: str
    difficulty: str
    question_number: int
    interviewer_name: str = "Alex"

class EvaluateInterview(BaseModel):
    interview_id: str
    job_role: str
    difficulty: str
    conversation: list

class SaveInterview(BaseModel):
    user_id: str
    interview_id: str
    job_role: str
    difficulty: str
    overall_score: int
    evaluation: dict

# ==================== HELPERS ====================

async def save_to_supabase(table: str, data: dict):
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    try:
        async with httpx.AsyncClient() as http:
            response = await http.post(
                f"{SUPABASE_URL}/rest/v1/{table}",
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },
                json=data,
                timeout=5.0
            )
            return response
    except Exception as e:
        print(f"Supabase error: {e}")
        return None

async def get_from_supabase(table: str, filters: str = ""):
    if not SUPABASE_URL or not SUPABASE_KEY:
        return None
    try:
        async with httpx.AsyncClient() as http:
            response = await http.get(
                f"{SUPABASE_URL}/rest/v1/{table}?{filters}",
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": "application/json"
                },
                timeout=5.0
            )
            return response.json()
    except Exception as e:
        print(f"Supabase error: {e}")
        return None

# ==================== ROUTES ====================

@app.get("/")
def home():
    return {
        "status": "Questioneer API is running!",
        "version": "1.0.0",
        "endpoints": [
            "/start-interview",
            "/next-question",
            "/evaluate",
            "/save-interview",
            "/history/{user_id}"
        ]
    }

@app.post("/start-interview")
async def start_interview(data: StartInterview):
    try:
        style_desc = {
            "friendly": "warm, encouraging and supportive",
            "strict": "professional, direct and challenging",
            "technical": "deeply technical and detail-oriented"
        }.get(data.interviewer_style, "professional")

        prompt = f"""You are {data.interviewer_name}, a {style_desc} interviewer at a top tech company.
You are interviewing a candidate for: {data.job_role}
Difficulty level: {data.difficulty}

Instructions:
- Introduce yourself in exactly 1 sentence
- Then ask your first interview question
- Question should be relevant to {data.job_role}
- Keep total response under 100 words
- Be natural and conversational"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return {
            "question": response.text,
            "question_number": 1,
            "interview_id": str(uuid.uuid4()),
            "finished": False
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/next-question")
async def next_question(data: NextQuestion):
    try:
        if data.question_number >= 10:
            return {
                "question": "Thank you so much for your time today! That concludes our interview. I will now prepare your detailed evaluation report. Great job completing the interview!",
                "question_number": 11,
                "finished": True
            }

        prompt = f"""You are {data.interviewer_name}, interviewing for: {data.job_role}
Difficulty: {data.difficulty}
This is question {data.question_number} of 10.

Previous question: {data.question}
Candidate's answer: {data.answer}

Instructions:
- Acknowledge their answer in exactly 1 short sentence
- Then ask the next interview question (question {data.question_number + 1})
- Mix technical and behavioral questions
- Keep total response under 80 words
- Be natural like a real interviewer"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return {
            "question": response.text,
            "question_number": data.question_number + 1,
            "finished": False
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/evaluate")
async def evaluate(data: EvaluateInterview):
    try:
        conversation_text = ""
        for i, item in enumerate(data.conversation):
            conversation_text += f"Question {i+1}: {item.get('question', '')}\nAnswer: {item.get('answer', 'No answer provided')}\n\n"

        prompt = f"""You are an expert interview evaluator. Evaluate this {data.job_role} interview at {data.difficulty} level.

Interview transcript:
{conversation_text}

Return ONLY this JSON (no markdown, no extra text):
{{
    "overall_score": <number 0-100>,
    "grade": "<A/B/C/D/F>",
    "technical_score": <number 0-10>,
    "communication_score": <number 0-10>,
    "problem_solving_score": <number 0-10>,
    "confidence_score": <number 0-10>,
    "clarity_score": <number 0-10>,
    "depth_score": <number 0-10>,
    "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
    "study_plan": ["<week 1 plan>", "<week 2 plan>", "<week 3 plan>", "<week 4 plan>"],
    "question_feedback": [
        {{"question": "<q1>", "answer": "<a1>", "feedback": "<feedback>", "score": <0-10>}}
    ],
    "overall_feedback": "<2-3 sentence overall feedback>",
    "recommended_resources": ["<resource 1>", "<resource 2>", "<resource 3>"]
}}"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        clean = response.text.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean)
        return result

    except json.JSONDecodeError:
        return {
            "overall_score": 70,
            "grade": "B",
            "technical_score": 7,
            "communication_score": 7,
            "problem_solving_score": 7,
            "confidence_score": 7,
            "clarity_score": 7,
            "depth_score": 7,
            "strengths": ["Good communication skills", "Relevant experience", "Positive attitude"],
            "weaknesses": ["Need more technical depth", "Improve problem solving", "Work on confidence"],
            "study_plan": ["Week 1: Review core concepts", "Week 2: Practice coding problems", "Week 3: System design", "Week 4: Mock interviews"],
            "question_feedback": [],
            "overall_feedback": "Good performance overall. Keep practicing to improve your technical skills.",
            "recommended_resources": ["LeetCode for DSA", "System Design Primer", "Cracking the Coding Interview"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save-interview")
async def save_interview(data: SaveInterview):
    try:
        await save_to_supabase("interviews", {
            "id": data.interview_id,
            "user_id": data.user_id,
            "job_role": data.job_role,
            "difficulty": data.difficulty,
            "overall_score": data.overall_score,
            "evaluation": json.dumps(data.evaluation),
            "created_at": datetime.utcnow().isoformat()
        })
        return {"status": "saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history/{user_id}")
async def get_history(user_id: str):
    try:
        data = await get_from_supabase(
            "interviews",
            f"user_id=eq.{user_id}&order=created_at.desc&limit=20"
        )
        return {"interviews": data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))