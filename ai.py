from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

openai.api_key = "YOUR_OPENAI_KEY"  # Replace with actual API key

# 🔹 **1. AI-Assisted Job Description Matching**
@app.route('/match-job', methods=['POST'])
def match_job():
    data = request.json
    prompt = f"Compare the following resume and job description. Suggest improvements:\n\nResume: {data['resumeText']}\n\nJob Description: {data['jobDescription']}"
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": prompt}]
    )

    return jsonify({"improvements": response.choices[0].message['content']})

# 🔹 **2. AI Resume Formatting & Optimization**
@app.route('/format-resume', methods=['POST'])
def format_resume():
    data = request.json
    prompt = f"Reformat the following resume based on career goal: {data['careerGoal']}\n\nResume:\n{data['resumeText']}"
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": prompt}]
    )

    return jsonify({"formatted_resume": response.choices[0].message['content']})

if __name__ == '__main__':
    app.run(port=5001, debug=True)
