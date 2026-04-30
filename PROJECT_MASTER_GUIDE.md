# 🧠 The Master Guide: AI Sentiment Analyzer

This document is designed to explain everything about this project from scratch, in simple, beginner-friendly terms. If you need to explain this project in an interview or teach it to a friend, this is your cheat sheet!

---

## 1. The Big Picture (What is this?)
Imagine you have a piece of text (like a tweet or a product review) and you want to know:
1. Is it positive, negative, or neutral? (**Sentiment**)
2. What specific emotion is the writer feeling? (**Emotion**)
3. Who or what are they talking about? (**Named Entity Recognition - NER**)

This web application does exactly that. A user types text into a beautiful web interface, clicks "Analyze", and within seconds, AI models read the text and return detailed statistics and highlights.

---

## 2. How the Pieces Fit Together (The Flow)
Every time a user clicks "Analyze Text", here is the exact journey of the data:
1. **Frontend (The User's Browser):** Grabs the text the user typed and sends it over the internet to the Backend.
2. **Backend (The Server):** Receives the text and hands it over to the AI Models.
3. **AI Models (The Brains):** Read the text, calculate the math, and figure out the sentiment, emotion, and entities. They give the results back to the Backend.
4. **Database (The Memory):** The Backend takes those results and saves them in a file so we can view them later in the "History" tab.
5. **Frontend (The Display):** The Backend sends the final results back to the user's browser, which draws the colorful charts and highlight bars.

---

## 3. The Frontend (React + Vite)
**What it is:** The visual part of the app that the user clicks and interacts with.
**Technologies used:** React (Javascript library), Vite (a super-fast builder), and pure CSS for styling.

**How it works:**
- **Components:** Instead of one giant HTML file, React lets us build small, reusable Lego blocks called "Components" (e.g., `SentimentCard.jsx`, `EmotionChart.jsx`).
- **Glassmorphism:** The sleek, frosted-glass look is achieved using CSS properties like `backdrop-filter: blur(12px)` and semi-transparent background colors.
- **State Management:** When you type in the box, React stores that text in its "state". When the API replies with data, React updates its state with the new data, and automatically redraws the screen to show the charts.

---

## 4. The Backend (FastAPI)
**What it is:** The server that runs 24/7 waiting for requests. It's the middleman between the web browser and the heavy AI models.
**Technologies used:** Python and FastAPI.

**How it works:**
- **Endpoints:** We created specific "URLs" (called endpoints) for the frontend to talk to:
  - `POST /analyze`: Expects text. Runs the AI models and returns the results.
  - `GET /history`: Looks into the database and returns a list of all past analyses.
  - `GET /stats`: Looks into the database, calculates averages (like total words, top emotions), and returns them for the Stats tab.

---

## 5. The AI Models (Hugging Face Transformers)
**What it is:** The actual "Artificial Intelligence". These are pre-trained mathematical models that understand human language (Natural Language Processing or NLP).
**Technologies used:** Hugging Face `transformers` library and PyTorch.

**The 3 Models:**
1. **RoBERTa (Sentiment):** Trained on 58 million tweets. It assigns a percentage score to Positive, Negative, and Neutral.
2. **DistilRoBERTa (Emotion):** Looks for 7 specific human emotions (Joy, Sadness, Anger, Fear, Surprise, Disgust, Neutral).
3. **BERT (NER - Named Entity Recognition):** Reads the text word-by-word and tags specific nouns as Organizations (e.g., "Apple"), Persons ("Tim Cook"), or Locations ("California").

*Note: We run these models locally on the CPU (or via Hugging Face Spaces in the cloud) using a "Pipeline", which is a shortcut that handles the complicated AI math for us.*

---

## 6. The Database (SQLite + SQLAlchemy)
**What it is:** The storage system that remembers past analyses.
**Technologies used:** SQLite (a lightweight database that saves everything into a single file) and SQLAlchemy (a translator that lets us talk to the database using Python instead of raw SQL code).

**How it works:**
- Every time an analysis finishes, SQLAlchemy creates a new "Record" containing the text, the top sentiment, the top emotion, and the date.
- It saves this record into our `sentiment_history.db` file.
- When the user clicks the "History" tab, SQLAlchemy fetches all these records and sends them to the frontend.

---

## 7. The API (Application Programming Interface)
**What it is:** The bridge that allows the Javascript Frontend to talk to the Python Backend.
**Technologies used:** Axios (a Javascript tool for making HTTP requests) and CORS (Cross-Origin Resource Sharing).

**How it works:**
- The frontend lives at `https://ai-sentiment-analyzer-tau.vercel.app`.
- The backend lives at `https://flamekaizerr-ai-sentiment-analyzer.hf.space`.
- Because they live at different addresses, browsers normally block them from talking to each other for security. We configured **CORS** in FastAPI to explicitly say: *"It's okay, allow the Vercel app to talk to me!"*
- The frontend uses `Axios` to send JSON data to the backend URL, waits for the response, and then updates the screen.

---

## 8. Deployment (The Cloud)
To get the app on the internet, we split it into two places:
1. **Hugging Face Spaces (Backend):** We gave them a `Dockerfile`. A Dockerfile is simply a recipe that says: *"Get a computer with Python, install FastAPI and PyTorch, download my code, and run it on port 7860."* Hugging Face reads this recipe and builds a server for us for free.
2. **Vercel (Frontend):** We connected Vercel to your GitHub repository. Vercel downloads your React code, builds it into plain HTML/Javascript, and hosts it on their global servers. We gave Vercel an "Environment Variable" (`VITE_API_URL`) so it knows exactly what the Hugging Face URL is.

---
*Created with ❤️ by you and the AI Squad.*
