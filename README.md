<div align="center">

# 🌾 MindSync AI for Agriculture
### An AI-Powered Approach to Stubble-Burning Prevention

**Predict early. Coordinate collection. Turn crop residue into value.**

[![Team](https://img.shields.io/badge/Team-MindSync-2e7d32?style=for-the-badge)](https://github.com/akshatamane070-afk)
[![Project](https://img.shields.io/badge/Project-AI%20%7C%20Climate%20Tech-1565c0?style=for-the-badge)](https://github.com/akshatamane070-afk/MindSync-AI-Risk-Prediction)
[![Institute](https://img.shields.io/badge/Institute-VIT%20Pune-6a1b9a?style=for-the-badge)](https://github.com/akshatamane070-afk/MindSync-AI-Risk-Prediction)

[**View Repository**](https://github.com/akshatamane070-afk/MindSync-AI-Risk-Prediction)

</div>

---

## 🌍 The Challenge

After harvesting, farmers have a limited window to clear their fields before the next planting cycle. When balers, transporters, and biomass buyers are difficult to coordinate, burning crop residue can become a quick but harmful option. Stubble burning contributes to air pollution and can damage soil quality.

**AgriCycle AI** is the MindSync team's proposed solution to help prevent burning before it starts by connecting early risk prediction with crop-residue collection and reuse.

## 💡 Our Solution

The proposed workflow brings together data, AI, mapping, logistics, and a biomass marketplace:

| Stage | What it does |
|---|---|
| 🛰️ **1. Data acquisition** | Combines satellite, weather, field, crop, and harvest information. |
| 🤖 **2. AI risk prediction** | Estimates field-level stubble-burning risk and aims to provide alerts 3–5 days ahead. |
| 🗺️ **3. Risk heatmap** | Visualizes fields by low, medium, and high risk to help prioritize action. |
| 🚜 **4. Smart resource matching** | Matches high-risk fields with nearby balers and transport; route optimization is part of the proposed workflow. |
| 💰 **5. Biomass marketplace** | Connects farmers with buyers who can use collected residue. |
| 📷 **6. Verification and incentives** | Proposes collection verification and follow-up alerts to support accountability. |

## ✨ Key Features in the Project Vision

- **Early risk alerts** — support proactive intervention rather than relying only on detecting fires after they begin.
- **Satellite risk view** — a GIS-style view of field-level risk.
- **Smart baler and transport matching** — coordinate collection resources for fields that need attention.
- **Biomass marketplace** — help connect crop-residue suppliers and potential buyers.
- **Emission calculator** — estimate CO₂ savings, tree-equivalent impact, and potential farmer income.
- **What-if simulator** — compare a burning scenario with a collection scenario.
- **Accessible alerts** — the proposed solution includes IVR/voice and WhatsApp alerts.
- **Multilingual experience** — the presentation proposes support for 10+ Indian languages.
- **Dark mode** — a night-friendly dashboard option.

> **Prototype status:** This repository contains an early software prototype. The feature list above describes the broader solution presented by the team; it does not mean every integration or workflow is fully implemented or connected to live data.

## 🧰 Technology

The current repository structure and project presentation indicate the following tools and technical areas:

| Area | Technology / approach |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Python, Flask |
| Machine learning | Risk classification / ML-based risk scoring |
| Data inputs | CSV field and weather datasets in the prototype |
| Visualization | GIS / Leaflet.js proposed for map-based risk display |
| Optimization | Google OR-Tools proposed for routing and resource scheduling |
| Model evaluation | Confusion matrix, feature-importance plot, ROC curve |

Specific integrations and dependencies should be checked against the current source code before running the project.

## 📁 Repository Structure

```text
MindSync-AI-Risk-Prediction/
├── backend/
│   └── app.py
├── data/
│   ├── fields.csv
│   └── weather.csv
├── frontend/
│   ├── app.js
│   ├── app.py
│   ├── index.html
│   ├── README.txt
│   └── style.css
├── images/
│   ├── confusion_matrix.png
│   ├── feature_importance.png
│   └── roc_curve.png
├── model/
│   └── risk_model.pkl
└── .gitignore
```

- `backend/` — Flask backend code.
- `frontend/` — web interface files.
- `data/` — field and weather CSV files.
- `model/` — saved machine-learning model artifact.
- `images/` — model evaluation plots.

## ▶️ Run Locally

The repository currently has Python files in both `backend/` and `frontend/`. Check which file serves the API and which serves the interface before starting the application.

### 1. Clone the repository

```bash
git clone https://github.com/akshatamane070-afk/MindSync-AI-Risk-Prediction.git
cd MindSync-AI-Risk-Prediction
```

### 2. Create a virtual environment

**Windows PowerShell**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS / Linux**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

Install the Python packages imported by the application. If the team adds a `requirements.txt` file, use:

```bash
pip install -r requirements.txt
```

### 4. Start the application

Review `backend/app.py` and `frontend/app.py` to identify the correct entry point and required configuration. Start the relevant Flask application using its documented run command. Open `frontend/index.html` in a browser only if the frontend is designed to run directly without a local server.

> A `requirements.txt` file and verified run instructions are recommended next steps so that other developers can reproduce the setup reliably.

## 🌱 Expected Impact

AgriCycle AI aims to:

- Encourage early intervention in fields at risk of stubble burning.
- Improve coordination between farmers, machinery operators, transporters, and biomass buyers.
- Support alternative uses for crop residue.
- Help reduce open burning when collection and reuse are practical.
- Make risk and collection information easier to understand and act upon.

Environmental savings and farmer-income figures should be treated as estimates until they are calculated using validated data and clearly documented assumptions.

## 🚀 Future Improvements

- Document the model's inputs, outputs, training process, and evaluation metrics.
- Add a `requirements.txt` file and tested setup instructions.
- Integrate and validate satellite and weather feeds.
- Complete the interactive GIS risk map and alert workflow.
- Implement and test baler/transport matching and biomass marketplace flows.
- Validate emission estimates and the what-if simulator.
- Add screenshots or a demo link showing the working prototype.

## 📚 References & Research Areas

The project presentation identifies these relevant resources and research areas:

- NASA FIRMS — satellite fire information.
- Google OR-Tools — vehicle routing and optimization.
- ICAR — crop-residue management.
- Satellite remote sensing and crop-burning detection research.
- AI/ML, GIS, logistics optimization, and residue-to-biomass systems.

---

<div align="center">

### 🌾 MindSync · AgriCycle AI
**Prevent burning. Enable recovery. Create value from crop residue.**

An AI-powered approach to stubble-burning prevention.

</div>
