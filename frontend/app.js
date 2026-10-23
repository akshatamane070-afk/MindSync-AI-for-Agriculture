// ============================================================
// API CONNECTION
// ============================================================

const API = "http://localhost:8000";


// ============================================================
// FARMER PROFILE DATA
// ============================================================

const farmerProfiles = {
    'F001': {
        name: 'Rahul Patil',
        village: 'Khadki',
        district: 'Pune',
        field_id: 'F001',
        crop: 'Wheat',
        size: '2.5 acres',
        risk_score: '72%',
        status: 'Active',
        burning_incidents: 0,
        carbon_credits: 12,
        total_income: 54000,
        history: [
            { date: '2026-08-15', event: 'Collection Completed', amount: '3.2 tons', income: '₹14,400' },
            { date: '2026-08-10', event: 'Collection Completed', amount: '2.8 tons', income: '₹12,600' },
            { date: '2026-08-05', event: 'Collection Completed', amount: '4.0 tons', income: '₹18,000' },
            { date: '2026-07-28', event: 'High Risk Alert', amount: '-', income: '-' }
        ]
    },
    'F003': {
        name: 'Sneha Jadhav',
        village: 'Aundh',
        district: 'Pune',
        field_id: 'F003',
        crop: 'Rice',
        size: '3.0 acres',
        risk_score: '45%',
        status: 'Active',
        burning_incidents: 1,
        carbon_credits: 8,
        total_income: 36000,
        history: [
            { date: '2026-08-12', event: 'Collection Completed', amount: '2.0 tons', income: '₹9,000' },
            { date: '2026-08-08', event: 'Burning Detected', amount: '-', income: '-' },
            { date: '2026-08-01', event: 'Collection Completed', amount: '3.5 tons', income: '₹15,750' }
        ]
    },
    'F007': {
        name: 'Amit Shinde',
        village: 'Pashan',
        district: 'Pune',
        field_id: 'F007',
        crop: 'Soybean',
        size: '1.8 acres',
        risk_score: '23%',
        status: 'Active',
        burning_incidents: 0,
        carbon_credits: 20,
        total_income: 90000,
        history: [
            { date: '2026-08-18', event: 'Collection Completed', amount: '5.0 tons', income: '₹22,500' },
            { date: '2026-08-10', event: 'Collection Completed', amount: '4.5 tons', income: '₹20,250' },
            { date: '2026-08-02', event: 'Collection Completed', amount: '3.8 tons', income: '₹17,100' }
        ]
    },
    'F012': {
        name: 'Priya More',
        village: 'Yerawada',
        district: 'Pune',
        field_id: 'F012',
        crop: 'Sugarcane',
        size: '4.0 acres',
        risk_score: '88%',
        status: 'High Risk',
        burning_incidents: 0,
        carbon_credits: 5,
        total_income: 22500,
        history: [
            { date: '2026-08-20', event: 'High Risk Alert', amount: '-', income: '-' },
            { date: '2026-08-14', event: 'Collection Completed', amount: '2.5 tons', income: '₹11,250' }
        ]
    }
};

// ============================================================
// CHECK BACKEND CONNECTION
// ============================================================

async function checkBackend() {
    try {
        const response = await fetch(`${API}/api/health`);
        if (response.ok) {
            document.getElementById("statusDot").classList.add("online");
            document.getElementById("statusText").textContent = "✅ API Connected";
        } else {
            document.getElementById("statusText").textContent = "⚠️ API Error";
        }
    } catch (error) {
        document.getElementById("statusText").textContent = "❌ API Offline";
        document.getElementById("statusDot").classList.remove("online");
    }
}

// ============================================================
// LOAD DASHBOARD STATS
// ============================================================

async function loadDashboardStats() {
    try {
        const response = await fetch(`${API}/api/dashboard/stats`);
        const data = await response.json();
        
        document.getElementById("totalFields").textContent = data.total_fields || 0;
        document.getElementById("highRisk").textContent = data.high_risk_fields || 0;
        document.getElementById("activeAlerts").textContent = data.active_alerts || 0;
        document.getElementById("resourcesCount").textContent = data.available_resources || 0;
        document.getElementById("alertCount").textContent = data.unread_alerts || 0;
        
    } catch (error) {
        console.log("Unable to load dashboard statistics");
    }
}

// ============================================================
// LOAD ALERTS
// ============================================================

async function loadAlerts() {
    try {
        const response = await fetch(`${API}/api/alerts`);
        const alerts = await response.json();
        displayAlerts(alerts);
    } catch (error) {
        console.log("Unable to load alerts");
    }
}

function displayAlerts(alerts) {
    const recent = document.getElementById("recentAlerts");
    const all = document.getElementById("allAlerts");

    if (!recent) return;

    if (alerts.length === 0) {
        recent.innerHTML = `<p style="padding:20px;color:#777">No alerts available.</p>`;
        if (all) all.innerHTML = `<p style="padding:20px;color:#777">No alerts available.</p>`;
        return;
    }

    const reversed = [...alerts].reverse();

    recent.innerHTML = reversed.slice(0, 5).map(createAlertHTML).join("");
    if (all) all.innerHTML = reversed.map(createAlertHTML).join("");
}

function createAlertHTML(alert) {
    return `
        <div class="alert-item">
            <div class="alert-icon">⚠️</div>
            <div class="alert-info">
                <strong>${alert.message}</strong>
                <small>Field: ${alert.field_id} • ${alert.timestamp}</small>
            </div>
            <span class="badge ${alert.alert_type}">${alert.alert_type}</span>
        </div>
    `;
}

// ============================================================
// SAMPLE ALERTS
// ============================================================

document.getElementById("sampleAlertBtn").addEventListener("click", async function() {
    try {
        await fetch(`${API}/api/alerts/sample`, { method: "POST" });
        showToast("✅ Sample alerts added!");
        await loadAlerts();
        await loadDashboardStats();
    } catch (error) {
        showToast("❌ Could not connect to Flask");
    }
});

// ============================================================
// FARMER REGISTRATION
// ============================================================

document.getElementById("farmerForm").addEventListener("submit", registerFarmer);

async function registerFarmer(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const farmer = {
        name: form.get("name"),
        phone: form.get("phone"),
        village: form.get("village"),
        district: form.get("district"),
        field_id: form.get("field_id"),
        field_size: Number(form.get("field_size")),
        crop: form.get("crop"),
        risk: form.get("risk"),
        lat: Number(form.get("lat")),
        lng: Number(form.get("lng"))
    };

    try {
        const response = await fetch(`${API}/api/farmers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(farmer)
        });
        const data = await response.json();
        if (response.ok) {
            showToast("✅ Farmer registered successfully!");
            event.target.reset();
            loadFarmers();
            loadDashboardStats();
        } else {
            showToast("❌ " + (data.error || "Registration failed"));
        }
    } catch (error) {
        showToast("❌ Could not connect to server");
    }
}

// ============================================================
// LOAD FARMERS
// ============================================================
async function loadFarmers() {
    try {
        const response = await fetch(`${API}/api/farmers`);
        const farmers = await response.json();
        const table = document.getElementById("farmerTable");
        const countEl = document.getElementById("farmerCount");
        
        if (countEl) countEl.textContent = farmers.length + " farmers";

        if (!table) return;

        if (farmers.length === 0) {
            table.innerHTML = `<p style="padding:20px;color:#777">No farmers registered yet.</p>`;
            return;
        }

        table.innerHTML = `
            <table style="width:100%;border-collapse:collapse;">
                <thead>
                    <tr style="border-bottom:2px solid rgba(255,255,255,0.1);">
                        <th style="text-align:left;padding:12px 15px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Name</th>
                        <th style="text-align:left;padding:12px 15px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Field ID</th>
                        <th style="text-align:left;padding:12px 15px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Crop</th>
                        <th style="text-align:center;padding:12px 15px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Risk</th>
                    </tr>
                </thead>
                <tbody>
                    ${farmers.map(function(f) {
                        var riskColor = f.risk === 'high' ? '#ef4444' : f.risk === 'medium' ? '#f59e0b' : '#10b981';
                        var riskBg = f.risk === 'high' ? 'rgba(239,68,68,0.15)' : f.risk === 'medium' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)';
                        return `
                            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                                <td style="padding:12px 15px;color:#ffffff;font-weight:500;">${f.name}</td>
                                <td style="padding:12px 15px;color:#9ca3af;">${f.field_id}</td>
                                <td style="padding:12px 15px;color:#9ca3af;">${f.crop}</td>
                                <td style="padding:12px 15px;text-align:center;">
                                    <span style="background:${riskBg};color:${riskColor};padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase;">
                                        ${f.risk}
                                    </span>
                                </td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.log("Unable to load farmers");
    }
}


// ============================================================
// LOAD RESOURCES
// ============================================================

async function loadResources() {
    try {
        const response = await fetch(`${API}/api/resources`);
        const resources = await response.json();
        displayResources(resources);
    } catch (error) {
        console.log("Unable to load resources");
    }
}

function displayResources(resources) {
    const container = document.getElementById("resourceGrid");
    if (!container) return;

    if (resources.length === 0) {
        container.innerHTML = `<div class="card" style="padding:30px">No resources available.</div>`;
        return;
    }

    container.innerHTML = resources.map(function(r) {
        return `
            <div class="resource-card">
                <div class="resource-top">
                    <div class="resource-icon">${r.icon}</div>
                    <span class="available">● ${r.status || "available"}</span>
                </div>
                <h3>${r.type}</h3>
                <p>${r.available} available<br>Distance: ${r.distance}</p>
                <button class="primary-btn" onclick="requestResource(${r.id})" ${r.available <= 0 ? "disabled" : ""}>
                    Request Resource
                </button>
            </div>
        `;
    }).join("");
}

async function requestResource(id) {
    try {
        const response = await fetch(`${API}/api/resources/${id}/request`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        if (response.ok) {
            showToast(data.message || "Resource requested successfully!");
            loadResources();
            loadDashboardStats();
        } else {
            showToast(data.error || "Resource unavailable");
        }
    } catch (error) {
        showToast("Could not connect to server");
    }
}

// ============================================================
// ADD RESOURCE
// ============================================================

document.getElementById("addResourceBtn").addEventListener("click", async function() {
    const newResource = {
        type: prompt("Enter resource type (e.g., Tractor):"),
        icon: prompt("Enter icon (e.g., 🚜):"),
        available: parseInt(prompt("Enter quantity available:")),
        distance: prompt("Enter distance (e.g., 3.2 km):")
    };
    
    if (!newResource.type) {
        showToast("Resource type is required");
        return;
    }
    
    try {
        const response = await fetch(`${API}/api/resources/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newResource)
        });
        const data = await response.json();
        if (response.ok) {
            showToast(data.message || "Resource added successfully!");
            loadResources();
            loadDashboardStats();
        } else {
            showToast(data.error || "Failed to add resource");
        }
    } catch (error) {
        showToast("Could not connect to server");
    }
});

// ============================================================
// REFRESH
// ============================================================

document.getElementById("refreshBtn").addEventListener("click", refreshDashboard);

async function refreshDashboard() {
    await checkBackend();
    await loadDashboardStats();
    await loadAlerts();
    await loadFarmers();
    await loadResources();
    showToast("Dashboard refreshed!");
}

// ============================================================
// TOAST
// ============================================================

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function() {
        toast.classList.remove("show");
    }, 3000);
}

// ============================================================
// PAGE NAVIGATION
// ============================================================

document.querySelectorAll(".nav-btn").forEach(function(button) {
    button.addEventListener("click", function() {
        openPage(button.dataset.page);
    });
});

function openPage(pageName) {
    document.querySelectorAll(".page").forEach(function(page) {
        page.classList.remove("active");
    });
    document.getElementById(pageName).classList.add("active");

    document.querySelectorAll(".nav-btn").forEach(function(button) {
        button.classList.remove("active");
        if (button.dataset.page === pageName) button.classList.add("active");
    });

    var titles = {
        dashboard: "Farm Risk Dashboard",
        map: "Interactive Risk Map",
        farmers: "Farmer Registration",
        resources: "Resource Matching",
        alerts: "Alert Center",
        wow: "AI Action Center"
    };
    document.getElementById("pageTitle").textContent = titles[pageName] || "Dashboard";

    setTimeout(function() {
        if (dashboardMap) dashboardMap.invalidateSize();
        if (mainMap) mainMap.invalidateSize();
    }, 100);
}

// ============================================================
// LEAFLET MAP
// ============================================================

var dashboardMap, mainMap;

function initializeMaps() {
    var dashEl = document.getElementById("dashboardMap");
    var mainEl = document.getElementById("mainMap");
    
    if (dashEl) {
        dashboardMap = L.map("dashboardMap").setView([18.5204, 73.8567], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(dashboardMap);
    }
    
    if (mainEl) {
        mainMap = L.map("mainMap").setView([18.5204, 73.8567], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mainMap);
    }

    addFieldMarkers();
}

function addFieldMarkers() {
    var fields = [
        { id: "F001", farmer: "Rahul Patil", crop: "Wheat", risk: "high", lat: 18.5204, lng: 73.8567 },
        { id: "F003", farmer: "Sneha Jadhav", crop: "Rice", risk: "medium", lat: 18.5310, lng: 73.8500 },
        { id: "F007", farmer: "Amit Shinde", crop: "Soybean", risk: "low", lat: 18.5120, lng: 73.8700 },
        { id: "F012", farmer: "Priya More", crop: "Sugarcane", risk: "high", lat: 18.5450, lng: 73.8800 }
    ];

    fields.forEach(function(field) {
        var color = field.risk === "high" ? "#e34848" : field.risk === "medium" ? "#e5a426" : "#168149";
        var markerIcon = L.divIcon({
            className: "",
            html: '<div style="width:18px;height:18px;border-radius:50%;background:' + color + ';border:3px solid white;box-shadow:0 2px 8px #555;"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
        });
        var popup = '<div><h3>' + field.id + '</h3><p><strong>Farmer:</strong> ' + field.farmer + '</p><p><strong>Crop:</strong> ' + field.crop + '</p><p><strong>Risk:</strong> ' + field.risk.toUpperCase() + '</p></div>';
        
        if (dashboardMap) L.marker([field.lat, field.lng], { icon: markerIcon }).addTo(dashboardMap).bindPopup(popup);
        if (mainMap) L.marker([field.lat, field.lng], { icon: markerIcon }).addTo(mainMap).bindPopup(popup);
    });
}

// ============================================================
// AI ACTION CENTER FUNCTIONS
// ============================================================

function startPrevention() {
    var btn = document.getElementById("preventBtn");
    var timeline = document.getElementById("preventionTimeline");
    var badge = document.getElementById("verificationBadge");

    if (!btn) return;

    btn.disabled = true;
    btn.textContent = "⏳ Dispatching...";
    if (timeline) timeline.classList.remove("hidden");

    var steps = [
        "✅ AI Prediction: 92% risk confirmed",
        "🚜 Baler B02 dispatched",
        "📦 Collection in progress",
        "✅ Field clear!",
        "💰 ₹3,500 Incentive Released!"
    ];

    steps.forEach(function(step, index) {
        setTimeout(function() {
            if (timeline) {
                var div = document.createElement("div");
                div.className = "timeline-step";
                div.textContent = step;
                timeline.appendChild(div);
            }
            if (index === steps.length - 1) {
                btn.textContent = "✅ Prevention Complete!";
                if (badge) {
                    badge.textContent = "✅ VERIFIED";
                    badge.className = "verified-badge";
                }
                showToast("🎉 Field cleared! Reward released!");
            }
        }, index * 3000);
    });
}
async function loadWowData() {
    try {
        var response = await fetch(API + "/api/alerts");
        var alerts = await response.json();

        var highRiskFields = alerts.filter(function(a) {
            return a.alert_type === "high_risk";
        });
        var highRiskCount = highRiskFields.length;

        // Update subtitle
        var subtitle = document.getElementById("selectedFieldSubtitle");
        if (subtitle) {
            subtitle.textContent = highRiskCount + " high-risk field(s) detected";
        }
        
        // Update risk score - SHOW 92% IF HIGH RISK FOUND
        var scoreEl = document.getElementById("wowRiskScore");
        if (scoreEl) {
            scoreEl.textContent = highRiskCount > 0 ? "92%" : "0%";
        }

        // Update field name
        var nameEl = document.getElementById("wowFieldName");
        if (nameEl) {
            if (highRiskCount > 0) {
                nameEl.textContent = "Field " + highRiskFields[0].field_id;
            } else {
                nameEl.textContent = "No High-Risk Fields";
            }
        }

        // Update explain factors
        var factors = document.getElementById("explainFactors");
        if (factors) {
            if (highRiskCount > 0) {
                factors.innerHTML = `
                    <span class="factor-tag">🔥 Temperature 38°C</span>
                    <span class="factor-tag">🌾 12.4 tons biomass</span>
                    <span class="factor-tag">⏳ 18 hrs window</span>
                `;
            } else {
                factors.innerHTML = '<span class="factor-tag">✅ All fields are currently safe</span>';
            }
        }

        // Update baler list
        var balerList = document.getElementById("balerList");
        if (balerList) {
            var balers = [
                { id: "B01", status: "✅ Available", distance: "1.2 km" },
                { id: "B02", status: "🚀 Dispatched", distance: "2.8 km" },
                { id: "B03", status: "⏳ In use", distance: "4.5 km" }
            ];
            balerList.innerHTML = balers.map(function(b) {
                return '<div class="baler-item"><span>🚜 ' + b.id + '</span><span>' + b.status + '</span><span>' + b.distance + '</span></div>';
            }).join("");
        }

    } catch (error) {
        console.log("Unable to load WOW data");
    }
}


// ============================================================
// DARK MODE TOGGLE
// ============================================================

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    const btn = document.getElementById('darkToggle');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

// ============================================================
// CARBON CREDIT CALCULATOR
// ============================================================

async function calculateCredits() {
    const tons = document.getElementById('residueTons').value;
    if (!tons || tons <= 0) {
        alert('Please enter a valid number of tons');
        return;
    }
    
    try {
        const response = await fetch(`${API}/api/carbon-credits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ residue_tons: parseFloat(tons) })
        });
        
        const data = await response.json();
        const resultDiv = document.getElementById('creditResult');
        
        if (!resultDiv) return;
        
        resultDiv.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;margin-top:10px;">
                <div><span style="color:#9ca3af;font-size:11px;">CO₂ Saved</span><br><span style="color:#10b981;font-size:18px;font-weight:bold;">${data.co2_saved} tons</span></div>
                <div><span style="color:#9ca3af;font-size:11px;">Carbon Credits</span><br><span style="color:#3b82f6;font-size:18px;font-weight:bold;">${data.carbon_credits}</span></div>
                <div><span style="color:#9ca3af;font-size:11px;">Potential Earnings</span><br><span style="color:#f59e0b;font-size:18px;font-weight:bold;">₹${data.potential_earnings.toLocaleString()}</span></div>
            </div>
            <div style="text-align:center;margin-top:8px;color:#10b981;">${data.message}</div>
        `;
        resultDiv.style.display = 'block';
        
    } catch (error) {
        alert('Could not calculate credits. Make sure backend is running.');
    }
}

// ============================================================
// 7-DAY FORECAST
// ============================================================

async function fetchForecast() {
    const fieldId = document.getElementById('forecastFieldId').value.trim();
    if (!fieldId) {
        alert('Please enter a Field ID');
        return;
    }
    
    try {
        const response = await fetch(`${API}/api/forecast/${fieldId}`);
        const data = await response.json();
        
        if (data.error) {
            alert(data.error);
            return;
        }
        
        displayForecast(data);
        
    } catch (error) {
        alert('Could not fetch forecast. Make sure backend is running.');
    }
}

function displayForecast(data) {
    const container = document.getElementById('forecastContainer');
    const timeline = document.getElementById('forecastTimeline');
    const advice = document.getElementById('forecastAdvice');
    
    if (!container) return;
    container.style.display = 'block';
    
    const colors = { 'High': '#ef4444', 'Medium': '#f59e0b', 'Low': '#10b981' };
    
    let html = '';
    data.forecast.forEach(function(day) {
        html += `
            <div style="background:#1f2937;border-radius:8px;padding:12px;text-align:center;">
                <div style="font-size:12px;color:#9ca3af;">${day.day_name}</div>
                <div style="height:80px;display:flex;align-items:flex-end;justify-content:center;margin:5px 0;">
                    <div style="width:30px;height:${day.risk_score * 100}%;background:${colors[day.risk_level]};border-radius:4px;min-height:10px;"></div>
                </div>
                <div style="font-size:11px;font-weight:bold;color:${colors[day.risk_level]};">${day.risk_level}</div>
                <div style="font-size:10px;color:#6b7280;">${day.risk_score}</div>
                <div style="font-size:10px;color:#6b7280;">🌡️${day.temperature}°C 💧${day.humidity}%</div>
            </div>
        `;
    });
    
    if (timeline) timeline.innerHTML = html;
    
    if (advice) {
        advice.innerHTML = `💡 <strong>Best time to collect:</strong> Day ${data.best_collection_day} (${data.best_collection_day_name})<br>Risk Score: <strong style="color:#10b981;">${data.best_risk_score}</strong>`;
    }
}

// ============================================================
// ON-DEVICE AI VERIFICATION
// ============================================================

let mobilenetModel = null;

async function loadModel() {
    const resultDiv = document.getElementById('verificationResult');
    if (!resultDiv) return;
    
    try {
        resultDiv.innerHTML = '⏳ Loading AI model...';
        resultDiv.style.display = 'block';
        
        mobilenetModel = await mobilenet.load();
        
        resultDiv.innerHTML = '✅ AI model loaded! Upload a photo to verify.';
        resultDiv.style.background = 'rgba(16, 185, 129, 0.1)';
        resultDiv.style.border = '1px solid #10b981';
        
    } catch (error) {
        resultDiv.innerHTML = '⚠️ Could not load AI model. Check internet.';
        resultDiv.style.background = 'rgba(239, 68, 68, 0.1)';
        resultDiv.style.border = '1px solid #ef4444';
    }
}

async function verifyImage() {
    const fileInput = document.getElementById('verifyImage');
    const resultDiv = document.getElementById('verificationResult');
    
    if (!resultDiv) return;
    
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
        alert('Please select an image first');
        return;
    }
    
    if (!mobilenetModel) {
        resultDiv.innerHTML = '⏳ Loading AI model... Please wait.';
        resultDiv.style.display = 'block';
        await loadModel();
        if (!mobilenetModel) return;
    }
    
    try {
        resultDiv.innerHTML = '⏳ Analyzing image...';
        resultDiv.style.display = 'block';
        
        const img = new Image();
        img.src = URL.createObjectURL(fileInput.files[0]);
        await new Promise(function(resolve) { img.onload = resolve; });
        
        const predictions = await mobilenetModel.classify(img);
        
        const keywords = ['field', 'crop', 'wheat', 'rice', 'corn', 'stubble', 'hay', 'farm', 'agriculture'];
        const isStubble = predictions.some(function(p) {
            return keywords.some(function(k) { return p.className.toLowerCase().includes(k); });
        });
        
        if (isStubble) {
            resultDiv.innerHTML = '✅ <strong>Field Residue Detected!</strong><br>Confidence: ' + predictions[0].probability.toFixed(2);
            resultDiv.style.background = 'rgba(16, 185, 129, 0.1)';
            resultDiv.style.border = '2px solid #10b981';
        } else {
            resultDiv.innerHTML = '⚠️ <strong>No Field Residue Detected</strong><br>Please upload a field photo.';
            resultDiv.style.background = 'rgba(239, 68, 68, 0.1)';
            resultDiv.style.border = '2px solid #ef4444';
        }
        
    } catch (error) {
        resultDiv.innerHTML = '❌ Error analyzing image.';
        resultDiv.style.background = 'rgba(239, 68, 68, 0.1)';
    }
}

// ============================================================
// GPS COLLECTION ROUTES
// ============================================================

function showRoute() {
    const container = document.getElementById('routeContainer');
    const mapContainer = document.getElementById('routeMap');
    const details = document.getElementById('routeDetails');
    
    if (!container) return;
    container.style.display = 'block';
    
    const distance = (Math.random() * 20 + 5).toFixed(1);
    const time = (distance / 8).toFixed(1);
    const fuel = (distance * 0.15).toFixed(2);
    
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="font-size:48px;margin-bottom:10px;">🗺️</div>
            <div style="color:#9ca3af;">Route: 🏠 Farm → 🚜 Baler → 🏭 Buyer</div>
            <div style="color:#10b981;font-weight:bold;">Distance: ${distance} km | Time: ${time} hrs</div>
            <div style="width:80%;height:4px;background:linear-gradient(to right,#10b981,#3b82f6,#f59e0b);border-radius:2px;margin-top:10px;"></div>
        `;
    }
    
    if (details) {
        details.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center;">
                <div><span style="color:#9ca3af;font-size:12px;">Distance</span><br><span style="color:#3b82f6;font-size:18px;font-weight:bold;">${distance} km</span></div>
                <div><span style="color:#9ca3af;font-size:12px;">Time</span><br><span style="color:#f59e0b;font-size:18px;font-weight:bold;">${time} hrs</span></div>
                <div><span style="color:#9ca3af;font-size:12px;">Fuel Saved</span><br><span style="color:#10b981;font-size:18px;font-weight:bold;">${fuel} L</span></div>
            </div>
        `;
    }
}

// ============================================================
// PREDICTIVE ANALYTICS
// ============================================================

function updateAnalytics() {
    const totalFires = Math.floor(Math.random() * 30 + 40);
    const highRisk = Math.floor(Math.random() * 3 + 1);
    const resources = Math.floor(Math.random() * 40 + 40);
    const co2 = Math.floor(Math.random() * 80 + 80);
    
    if (document.getElementById('totalFires')) {
        document.getElementById('totalFires').textContent = totalFires;
        document.getElementById('highRiskZones').textContent = highRisk;
        document.getElementById('resourcesAvailable').textContent = resources;
        document.getElementById('co2SavedMonth').textContent = co2;
    }
}

// ============================================================
// AI CHATBOT ASSISTANT
// ============================================================

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    const message = input.value.trim();
    
    if (!message) return;
    
    addChatMessage('user', message);
    input.value = '';
    
    setTimeout(function() {
        const response = getBotResponse(message);
        addChatMessage('bot', response);
        const container = document.getElementById('chatContainer');
        if (container) container.scrollTop = container.scrollHeight;
    }, 500);
}

function addChatMessage(type, message) {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    
    const div = document.createElement('div');
    div.className = 'chat-message ' + type;
    
    const name = type === 'bot' ? '🤖 MindSync Bot:' : '👤 You:';
    
    div.innerHTML = '<strong>' + name + '</strong><span>' + message + '</span>';
    container.appendChild(div);
    
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
}

function clearChat() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    container.innerHTML = `
        <div class="chat-message bot">
            <strong>🤖 MindSync Bot:</strong>
            <span>Chat cleared. Ask me anything about crop burning prevention!</span>
        </div>
    `;
}

function getBotResponse(message) {
    const msg = message.toLowerCase();
    const isHindi = /[अ-ह]/.test(msg);
    
    const responses = [
        {
            keywords: ['risk', 'high risk', 'danger', 'जोखिम', 'खतरा'],
            en: '⚠️ If your field is high risk, take immediate action:\n1. Request collection through the platform\n2. Contact nearby baler services\n3. The system will dispatch resources within hours',
            hi: '⚠️ अगर आपके खेत में जोखिम ज्यादा है:\n1. प्लेटफॉर्म पर संग्रह का अनुरोध करें\n2. नजदीकी बेलर सेवाओं से संपर्क करें\n3. सिस्टम घंटों में संसाधन भेजेगा'
        },
        {
            keywords: ['register', 'registration', 'कैसे रजिस्टर', 'रजिस्ट्रेशन'],
            en: '📝 To register:\n1. Go to the "Farmers" page\n2. Fill in your name, phone, village, field details\n3. Add GPS coordinates\n4. Click "Register Farmer"',
            hi: '📝 रजिस्टर करने के लिए:\n1. "Farmers" पेज पर जाएं\n2. अपना नाम, फोन, गांव, खेत का विवरण भरें\n3. जीपीएस निर्देशांक डालें\n4. "Register Farmer" पर क्लिक करें'
        },
        {
            keywords: ['earn', 'income', 'money', 'कमाई', 'पैसा'],
            en: '💰 You can earn ₹4,500-5,000 per ton of residue collected. Plus, you get carbon credits! Use the "Carbon Credit Estimator" to calculate your earnings.',
            hi: '💰 आप ₹4,500-5,000 प्रति टन अवशेष से कमा सकते हैं। इसके अलावा कार्बन क्रेडिट भी मिलते हैं! "Carbon Credit Estimator" से अपनी कमाई कैलकुलेट करें।'
        },
        {
            keywords: ['biomass', 'sell', 'बायोमास', 'बेचना'],
            en: '🌾 You can sell biomass to buyers listed in the "Resources" page. The Biomass Marketplace shows current buyers and prices.',
            hi: '🌾 आप "Resources" पेज पर सूचीबद्ध खरीदारों को बायोमास बेच सकते हैं। Biomass Marketplace वर्तमान खरीदार और कीमतें दिखाता है।'
        },
        {
            keywords: ['verification', 'verify', 'सत्यापन'],
            en: '📷 After collection, upload a photo of your field. Our AI verifies the image and releases your incentive.',
            hi: '📷 संग्रह के बाद, अपने खेत की फोटो अपलोड करें। हमारा AI इमेज को वेरिफाई करता है और आपका इंसेंटिव रिलीज करता है।'
        },
        {
            keywords: ['help', 'मदद'],
            en: '🤖 I can help you with:\n• Risk prediction and prevention\n• Farmer registration\n• Resource matching\n• Carbon credit estimation\n• Collection verification\n• 7-Day forecast',
            hi: '🤖 मैं आपकी इन चीजों में मदद कर सकता हूं:\n• जोखिम भविष्यवाणी और रोकथाम\n• किसान पंजीकरण\n• संसाधन मिलान\n• कार्बन क्रेडिट अनुमान\n• संग्रह सत्यापन\n• 7-दिन का पूर्वानुमान'
        },
        {
            keywords: ['hello', 'hi', 'hey', 'नमस्ते', 'हाय'],
            en: '👋 Hello! I\'m MindSync Bot. Ask me about risk prediction, registration, earnings, or any farming questions!',
            hi: '👋 नमस्ते! मैं MindSync बॉट हूं। मुझसे जोखिम भविष्यवाणी, पंजीकरण, कमाई या कृषि संबंधी कोई भी सवाल पूछें!'
        }
    ];
    
    for (var i = 0; i < responses.length; i++) {
        for (var j = 0; j < responses[i].keywords.length; j++) {
            if (msg.includes(responses[i].keywords[j])) {
                return isHindi ? responses[i].hi : responses[i].en;
            }
        }
    }
    
    return isHindi 
        ? '🤖 मुझे समझ नहीं आया। कृपया दोबारा पूछें।'
        : '🤖 I didn\'t understand that. Please ask about risk, registration, earnings, or verification.';
}

// ============================================================
// FARMER PROFILE & HISTORY
// ============================================================

function loadFarmerProfile() {
    const select = document.getElementById('farmerSelect');
    if (!select) return;
    const fieldId = select.value;
    
    if (!fieldId) {
        alert('Please select a farmer');
        return;
    }
    
    const profile = farmerProfiles[fieldId];
    if (!profile) {
        alert('Farmer data not found');
        return;
    }
    
    const container = document.getElementById('farmerProfileContainer');
    if (!container) return;
    container.style.display = 'block';
    
    if (document.getElementById('profileName')) {
        document.getElementById('profileName').textContent = profile.name;
        document.getElementById('profileLocation').textContent = 'Village: ' + profile.village + ' • ' + profile.district;
        document.getElementById('profileField').textContent = 'Field: ' + profile.field_id + ' • ' + profile.crop + ' • ' + profile.size;
    }
    
    const statusEl = document.getElementById('profileStatus');
    if (statusEl) {
        if (profile.status === 'High Risk') {
            statusEl.style.background = 'rgba(239, 68, 68, 0.2)';
            statusEl.style.color = '#ef4444';
            statusEl.textContent = '🔴 High Risk';
        } else {
            statusEl.style.background = 'rgba(16, 185, 129, 0.2)';
            statusEl.style.color = '#10b981';
            statusEl.textContent = '🟢 Active';
        }
    }
    
    if (document.getElementById('profileRiskScore')) {
        document.getElementById('profileRiskScore').textContent = profile.risk_score;
        document.getElementById('profileBurningIncidents').textContent = profile.burning_incidents;
        document.getElementById('profileCarbonCredits').textContent = profile.carbon_credits;
        document.getElementById('profileIncome').textContent = '₹' + profile.total_income.toLocaleString();
    }
    
    const historyDiv = document.getElementById('profileHistory');
    if (historyDiv) {
        if (profile.history && profile.history.length > 0) {
            historyDiv.innerHTML = profile.history.map(function(h) {
                return `
                    <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.1);font-size:13px;">
                        <span style="color:#9ca3af;">${h.date}</span>
                        <span style="color:#fff;">${h.event}</span>
                        <span style="color:#9ca3af;">${h.amount}</span>
                        <span style="color:#10b981;font-weight:bold;">${h.income}</span>
                    </div>
                `;
            }).join('');
        } else {
            historyDiv.innerHTML = '<p style="color:#9ca3af;font-size:13px;">No history available</p>';
        }
    }
}

function populateFarmerDropdown() {
    const select = document.getElementById('farmerSelect');
    if (!select) return;
    select.innerHTML = '<option value="">Select a farmer...</option>';
    
    for (var id in farmerProfiles) {
        if (farmerProfiles.hasOwnProperty(id)) {
            var profile = farmerProfiles[id];
            var option = document.createElement('option');
            option.value = id;
            option.textContent = profile.name + ' (' + id + ') - ' + profile.village;
            select.appendChild(option);
        }
    }
}

// ============================================================
// PAGE LOAD - INITIALIZE EVERYTHING
// ============================================================

document.addEventListener("DOMContentLoaded", async function() {
    // First add sample alerts so AI Action Center works
    try {
        await fetch(`${API}/api/alerts/sample`, { method: "POST" });
    } catch(e) {
        console.log("Sample alerts already loaded");
    }
    
    initializeMaps();
    checkBackend();
    await refreshDashboard();
    await loadWowData();
    populateFarmerDropdown();
    updateAnalytics();
    setInterval(updateAnalytics, 10000);
    
    setTimeout(loadModel, 2000);
    
    var chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        var darkToggle = document.getElementById('darkToggle');
        if (darkToggle) darkToggle.textContent = '☀️';
    }
});
