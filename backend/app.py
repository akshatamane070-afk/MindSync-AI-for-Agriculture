from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# ============================================================
# ALERT STORAGE
# ============================================================

alerts = []
alert_counter = 0

# Pre-load sample alerts
sample_alerts = [
    {'field_id': 'F001', 'message': '🔥 High risk detected for Field F001', 'alert_type': 'high_risk'},
    {'field_id': 'F003', 'message': '✅ Collection scheduled for Field F003', 'alert_type': 'matched'},
    {'field_id': 'F007', 'message': '🚨 Burning detected at Field F007', 'alert_type': 'burning_detected'},
    {'field_id': 'F012', 'message': '📋 Field F012: Collection verified', 'alert_type': 'verified'},
]
for i, s in enumerate(sample_alerts, 1):
    alerts.append({
        'id': i,
        'field_id': s['field_id'],
        'message': s['message'],
        'alert_type': s['alert_type'],
        'timestamp': '2026-08-21T10:30:00',
        'read': False
    })
alert_counter = 4

# ============================================================
# ALERT STORAGE
# ============================================================

alerts = []
alert_counter = 0

# ============================================================
# FARMER STORAGE
# ============================================================

farmers_db = [
    {'id': 1, 'name': 'Rahul Patil', 'phone': '9876543210', 'village': 'Khadki', 'district': 'Pune', 'field_id': 'F001', 'field_size': 2.5, 'crop': 'Wheat', 'risk': 'high', 'lat': 18.5204, 'lng': 73.8567},
    {'id': 2, 'name': 'Sneha Jadhav', 'phone': '9876543211', 'village': 'Aundh', 'district': 'Pune', 'field_id': 'F003', 'field_size': 3.0, 'crop': 'Rice', 'risk': 'medium', 'lat': 18.5310, 'lng': 73.8500},
    {'id': 3, 'name': 'Amit Shinde', 'phone': '9876543212', 'village': 'Pashan', 'district': 'Pune', 'field_id': 'F007', 'field_size': 1.8, 'crop': 'Soybean', 'risk': 'low', 'lat': 18.5120, 'lng': 73.8700},
    {'id': 4, 'name': 'Priya More', 'phone': '9876543213', 'village': 'Yerawada', 'district': 'Pune', 'field_id': 'F012', 'field_size': 4.0, 'crop': 'Sugarcane', 'risk': 'high', 'lat': 18.5450, 'lng': 73.8800}
]
farmer_counter = 4

# ============================================================
# RESOURCE STORAGE
# ============================================================

resources_db = [
    {'id': 1, 'type': 'Tractor', 'icon': '🚜', 'available': 4, 'distance': '3.2 km', 'status': 'available'},
    {'id': 2, 'type': 'Water Tanker', 'icon': '🚰', 'available': 2, 'distance': '5.1 km', 'status': 'available'},
    {'id': 3, 'type': 'Seed Supply', 'icon': '🌱', 'available': 120, 'distance': '2.4 km', 'status': 'available'},
    {'id': 4, 'type': 'Fertilizer', 'icon': '🧪', 'available': 16, 'distance': '4.8 km', 'status': 'available'},
    {'id': 5, 'type': 'Harvest Machine', 'icon': '🌾', 'available': 3, 'distance': '7.2 km', 'status': 'available'},
    {'id': 6, 'type': 'Pesticide Sprayer', 'icon': '💨', 'available': 8, 'distance': '6.0 km', 'status': 'available'},
]

# ============================================================
# HOME ENDPOINT
# ============================================================

@app.route('/')
def home():
    return jsonify({'message': 'MindSync API is running!'})

# ============================================================
# HEALTH CHECK
# ============================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'alerts': len(alerts), 'farmers': len(farmers_db)})

# ============================================================
# ALERT ENDPOINTS
# ============================================================

@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    return jsonify(alerts)

@app.route('/api/alerts/sample', methods=['POST'])
def add_sample_alerts():
    global alert_counter
    samples = [
        {'field_id': 'F001', 'message': '🔥 High risk detected for Field F001', 'alert_type': 'high_risk'},
        {'field_id': 'F003', 'message': '✅ Collection scheduled for Field F003', 'alert_type': 'matched'},
        {'field_id': 'F007', 'message': '🚨 Burning detected at Field F007', 'alert_type': 'burning_detected'},
        {'field_id': 'F012', 'message': '📋 Field F012: Collection verified', 'alert_type': 'verified'},
    ]
    for s in samples:
        alert_counter += 1
        alerts.append({
            'id': alert_counter,
            'field_id': s['field_id'],
            'message': s['message'],
            'alert_type': s['alert_type'],
            'timestamp': '2026-08-21T10:30:00',
            'read': False
        })
    return jsonify({'message': f'Added {len(samples)} sample alerts'})

# ============================================================
# DASHBOARD STATS ENDPOINT
# ============================================================

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    total_alerts = len(alerts)
    high_risk = len([a for a in alerts if a.get('alert_type') == 'high_risk'])
    unread = len([a for a in alerts if not a.get('read', False)])
    
    return jsonify({
        'total_fields': len(farmers_db),
        'high_risk_fields': high_risk,
        'active_alerts': total_alerts,
        'available_resources': sum(r['available'] for r in resources_db),
        'unread_alerts': unread
    })

# ============================================================
# FARMER ENDPOINTS
# ============================================================

@app.route('/api/farmers', methods=['GET'])
def get_farmers():
    return jsonify(farmers_db)

@app.route('/api/farmers', methods=['POST'])
def register_farmer():
    global farmer_counter
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    farmer_counter += 1
    farmer = {
        'id': farmer_counter,
        'name': data.get('name', 'Unknown'),
        'phone': data.get('phone', ''),
        'village': data.get('village', ''),
        'district': data.get('district', ''),
        'field_id': data.get('field_id', 'F' + str(farmer_counter).zfill(3)),
        'field_size': data.get('field_size', 0),
        'crop': data.get('crop', 'Wheat'),
        'risk': data.get('risk', 'low'),
        'lat': data.get('lat', 18.5204),
        'lng': data.get('lng', 73.8567)
    }
    farmers_db.append(farmer)
    
    return jsonify({'message': 'Farmer registered successfully!', 'farmer': farmer})

# ============================================================
# RESOURCE ENDPOINTS
# ============================================================

@app.route('/api/resources', methods=['GET'])
def get_resources():
    return jsonify(resources_db)

@app.route('/api/resources/sample', methods=['POST'])
def add_sample_resources():
    return jsonify({'message': 'Sample resources already available', 'count': len(resources_db)})

@app.route('/api/resources/<int:resource_id>/request', methods=['POST'])
def request_resource(resource_id):
    global alert_counter
    for r in resources_db:
        if r['id'] == resource_id:
            if r['available'] > 0:
                r['available'] -= 1
                alert_counter += 1
                alerts.append({
                    'id': alert_counter,
                    'field_id': 'RESOURCE',
                    'message': f'📦 Resource requested: {r["type"]} ({r["available"]} remaining)',
                    'alert_type': 'matched',
                    'timestamp': '2026-08-21T10:30:00',
                    'read': False
                })
                return jsonify({'message': f'Resource {r["type"]} requested successfully'})
            else:
                return jsonify({'error': 'Resource unavailable'}), 400
    return jsonify({'error': 'Resource not found'}), 404

@app.route('/api/resources/add', methods=['POST'])
def add_resource():
    data = request.json
    new_resource = {
        'id': len(resources_db) + 1,
        'type': data.get('type', 'New Resource'),
        'icon': data.get('icon', '🔧'),
        'available': data.get('available', 10),
        'distance': data.get('distance', '5.0 km'),
        'status': 'available'
    }
    resources_db.append(new_resource)
    return jsonify({'message': 'Resource added successfully!', 'resource': new_resource})

# ============================================================
# IMPACT ENDPOINT
# ============================================================

@app.route('/api/impact/all', methods=['GET'])
def get_impact():
    total_fields = len(farmers_db)
    total_residue = total_fields * 2.0
    total_co2 = total_residue * 1.6
    total_income = total_residue * 4500
    
    return jsonify({
        'total_fields': total_fields,
        'total_residue': round(total_residue, 2),
        'total_co2_saved': round(total_co2, 2),
        'total_income_generated': round(total_income, 2),
        'trees_equivalent': round(total_co2 / 0.020, 0)
    })

# ============================================================
# CARBON CREDIT ENDPOINT
# ============================================================

@app.route('/api/carbon-credits', methods=['POST'])
def calculate_carbon_credits():
    data = request.json
    residue_tons = float(data.get('residue_tons', 0))
    
    CO2_PER_TON = 1.6
    CREDITS_PER_TON_CO2 = 0.5
    PRICE_PER_CREDIT = 800
    
    co2_saved = residue_tons * CO2_PER_TON
    carbon_credits = co2_saved * CREDITS_PER_TON_CO2
    earnings = carbon_credits * PRICE_PER_CREDIT
    
    return jsonify({
        'residue_tons': residue_tons,
        'co2_saved': round(co2_saved, 2),
        'carbon_credits': round(carbon_credits, 2),
        'potential_earnings': round(earnings, 2),
        'message': f'🌿 You can earn ₹{round(earnings, 2)} from carbon credits!'
    })

# ============================================================
# 7-DAY FORECAST ENDPOINT
# ============================================================

@app.route('/api/forecast/<field_id>', methods=['GET'])
def get_forecast(field_id):
    import random
    days = ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
    forecast = []
    
    for i in range(7):
        temp = 32 + random.uniform(-3, 3)
        humidity = 45 + random.uniform(-10, 10)
        risk_score = round(min(1.0, max(0.1, 0.8 - (i * 0.08) + random.uniform(-0.1, 0.1))), 2)
        level = 'High' if risk_score > 0.7 else 'Medium' if risk_score > 0.4 else 'Low'
        
        forecast.append({
            'day': i + 1,
            'day_name': days[i],
            'risk_score': risk_score,
            'risk_level': level,
            'temperature': round(temp, 1),
            'humidity': round(humidity, 1)
        })
    
    best_day = min(forecast, key=lambda x: x['risk_score'])
    
    return jsonify({
        'field_id': field_id,
        'forecast': forecast,
        'best_collection_day': best_day['day'],
        'best_collection_day_name': best_day['day_name'],
        'best_risk_score': best_day['risk_score']
    })

# ============================================================
# RUN SERVER
# ============================================================

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 MindSync API Server")
    print("📡 http://localhost:8000")
    print("=" * 50)
    print(f"✅ {len(farmers_db)} farmers loaded")
    print(f"✅ {len(resources_db)} resources loaded")
    print("=" * 50)
    app.run(port=8000, debug=True)