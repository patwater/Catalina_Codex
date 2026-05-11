# Agent Instructions: Catalina Codex Builder

## Project Overview
You are an expert full-stack developer and "vibe-coding" specialist. You are building a personalized, lightweight "Codex" microsite for an annual camping trip. The goal is to create a fun, communal space using a "pragmatic" stack: Google Sheets as a database, Cloudflare Pages for hosting, and Tailwind CSS for styling.

Have a password protected front with the words "Speak friend and enter" and have the password be "Little Harbor"

## The Stack
- **Frontend:** React (Vite) or simple HTML/JS.
- **Styling:** Tailwind CSS (for a "Scrapbook/Adventure" aesthetic).
- **Backend:** Google Sheets (CSV/JSON export).
- **Hosting:** Cloudflare Pages.
- **Infrastructure:** Cloudflare Workers (to proxy the Google Sheet data).

## Core Features to Code

### 1. Data Fetching Layer (The "Sheets Proxy")
Create a Cloudflare Worker script that:
- Fetches a public (or service-account protected) Google Sheet.
- Formats the rows into a clean JSON object.
- Includes a "birthday" endpoint and a "survey_results" endpoint.


### 2. Module: The Birthday Calendar
- **Logic:** Filter the "Birthdays" JSON for the current month.
- **UI:** A grid of cards. If a birthday is "Today," add a special animation (e.g., a "Golden Sun" glow or confetti effect).
- **Counter:** Include a "Days until the next birthday" countdown.

### 3. Module: The Annual Survey Dashboard
- **Visuals:** Pull responses from the "Survey" tab.
- **Components:** - Simple bar charts (using Chart.js or CSS-only bars) for "Favorite Camp Meal" or "MVP of last year."
    - A "Wall of Quotes" that randomly displays a text entry from the survey.

### 4. Module: The "Photo Reel"
- **Implementation:** Create a masonry grid.
- **Constraint:** Pull image URLs from the Google Sheet. Use `loading="lazy"` for performance.
- **Aesthetic:** Apply a slight rotation (`rotate-1` or `-rotate-1`) and a white border to images to make them look like physical polaroids.

### 5. Design Tokens (The "Catalina Vibe")
- **Palette:** - `Primary`: Ocean Blue (#0077be)
    - `Accent`: Sunset Orange (#ff8c00)
    - `Background`: Parchment/Paper (#fdf6e3)
- **Typography:** A mix of a clean Sans-Serif (Inter) for data and a "Handwritten" font for headers.

## Development Workflow (Vibe-Coding Instructions)
1. **Initialize:** Setup a Vite project with Tailwind.
2. **Mock Data:** Start with a local `data.json` that mimics the Google Sheet structure so we can build the UI immediately.
3. **Componentize:** Build the `Header`, `BirthdayCard`, `SurveyChart`, and `PhotoGrid`.
4. **Live Integration:** Replace the local JSON with the fetch call to the Cloudflare Worker.
5. **Polishing:** Add "Micro-interactions" (e.g., hovering over a photo scales it up slightly).

## Deployment
- Configure the GitHub Action to deploy to Cloudflare Pages on every push.


## Key links

Birthday links:
- Birthday form: https://docs.google.com/spreadsheets/d/1tCzlHN3dYyesQmR7IW8WGAIfa5jXlRS-YUIYjPknek8/edit?usp=sharing
- Form to add birthdays: https://docs.google.com/spreadsheets/d/1tCzlHN3dYyesQmR7IW8WGAIfa5jXlRS-YUIYjPknek8/edit?usp=sharing
- Rich's 70th birthday book: https://www.dropbox.com/scl/fi/efrvxlrev9to51e5ws6fx/Dad-70th-8-10-in-PRINT-QUALITY-3-8-22.pdf?rlkey=ky1yh0xf3j025x17z0ygcmdbq&st=3exs1jhb&dl=0


Photo links:

- 2025: https://photos.google.com/share/AF1QipM8BtwqXVfgfuLhjb3ljplgkcfr7hriwDHfx9hdUE6ZDZLlMNNc2ARA32ASozc10A?key=UHJkX1hDS056VVlUSHVTdFl1OUlpT1FEY3V6RlBB
- 2024: https://photos.google.com/share/AF1QipPoA2I2IeUCTRv468RfJSjmkoj4tXZsSx5eNRKNTDjmpOMgGwMv3797IbUcUKbMXw?key=VHZLa0xBQUFkcEdJSHlTbFoybnJwOG0tWGhLNW1B
- 2023: https://photos.google.com/share/AF1QipMgLXqhcwXA0sgaXddnB9ZrOiQpiRHYPjLEbaTtnIQCntyxT-b0hTIJrm6Dthb0yA?key=SmJGNXh6WjNCeTFiRzdoeUdkOENDR1N5a294VjJ3
- 2022: https://drive.google.com/drive/folders/1MoQ60Elo3W6yndTMyT9xlYXEToIf1IU4?usp=sharing
- 2021: https://photos.google.com/share/AF1QipNEjnwZXC13Fzv0vxMlfqPR1wyyxcO7YZWOXqChqGvNUQpw-71iqycdryxEMjVyRw?pli=1&key=S1NvaXN4UlNXZVJLS1lGeXdLdi13LTZYZjhBRHFn
- 2019: 
https://photos.app.goo.gl/h8YW3o4sfwSiREBi8
- 2018: 
https://photos.app.goo.gl/5HcUpCyS1Q5EJoUa8
- 2013: https://drive.google.com/drive/folders/0BxXlPjHg1R6iWS1IaC1BRWtOcFU?resourcekey=0-lcKeCDyTe3gKYNcytPIsNg&usp=sharing