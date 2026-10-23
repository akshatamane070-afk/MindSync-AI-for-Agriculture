from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ============================================================
# IN-MEMORY STORAGE
# ============================================================

alerts = []
farmers = []
resources = []

alert_counter = 0
farmer_counter = 0
resource_counter = 0


# ============================================================
# ALERT APIs - YOUR EXISTING APIs
# ============================================================

# Get all alerts
@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    return jsonify(alerts)


# Create new alert
@app.route('/api/alerts', methods=['POST'])
def create_alert():
    global alert_counter

    data = request.get_json()

    if not data:
        return jsonify({
            'error': 'Request body is required'
        }), 400

    required_fields = ['field_id', 'message', 'alert_type']

    for field in required_fields:
        if field not in data:
            return jsonify({
                'error': f'Missing required field: {field}'
            }), 400

    alert_counter += 1

    alert = {
        'id': alert_counter,
        'field_id': data['field_id'],
        'message': data['message'],
        'alert_type': data['alert_type'],
        'timestamp': datetime.now().isoformat(),
        'read': False
    }

    alerts.append(alert)

    return jsonify(alert), 201


# Get alert statistics
@app.route('/api/alerts/stats', methods=['GET'])
def get_stats():
    unread = len([
        alert for alert in alerts
        if not alert['read']
    ])

    return jsonify({
        'total': len(alerts),
        'unread': unread
    })


# Add sample alerts
@app.route('/api/alerts/sample', methods=['POST'])
def add_sample_alerts():
    global alert_counter

    samples = [
        {
            'field_id': 'F001',
            'message': '🔥 High risk detected for Field F001',
            'alert_type': 'high_risk'
        },
        {
            'field_id': 'F003',
            'message': '✅ Collection scheduled for Field F003',
            'alert_type': 'matched'
        },
        {
            'field_id': 'F007',
            'message': '🚨 Burning detected at Field F007',
            'alert_type': 'burning_detected'
        },
        {
            'field_id': 'F012',
            'message': '📋 Field F012: Collection verified',
            'alert_type': 'verified'
        }
    ]

    for sample in samples:
        alert_counter += 1

        alerts.append({
            'id': alert_counter,
            'field_id': sample['field_id'],
            'message': sample['message'],
            'alert_type': sample['alert_type'],
            'timestamp': datetime.now().isoformat(),
            'read': False
        })

    return jsonify({
        'message': f'Added {len(samples)} sample alerts',
        'alerts': alerts[-4:]
    }), 201


# Mark an alert as read
@app.route('/api/alerts/<int:alert_id>/read', methods=['PUT'])
def mark_alert_read(alert_id):

    for alert in alerts:
        if alert['id'] == alert_id:
            alert['read'] = True

            return jsonify({
                'message': 'Alert marked as read',
                'alert': alert
            })

    return jsonify({
        'error': 'Alert not found'
    }), 404


# Delete an alert
@app.route('/api/alerts/<int:alert_id>', methods=['DELETE'])
def delete_alert(alert_id):

    for alert in alerts:
        if alert['id'] == alert_id:
            alerts.remove(alert)

            return jsonify({
                'message': 'Alert deleted successfully'
            })

    return jsonify({
        'error': 'Alert not found'
    }), 404


# ============================================================
# FARMER APIs
# ============================================================

# Get all farmers
@app.route('/api/farmers', methods=['GET'])
def get_farmers():
    return jsonify(farmers)


# Register a new farmer
@app.route('/api/farmers', methods=['POST'])
def register_farmer():
    global farmer_counter

    data = request.get_json()

    if not data:
        return jsonify({
            'error': 'Request body is required'
        }), 400

    required_fields = [
        'name',
        'phone',
        'village',
        'district',
        'field_id',
        'field_size',
        'crop',
        'risk',
        'lat',
        'lng'
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                'error': f'Missing required field: {field}'
            }), 400

    farmer_counter += 1

    farmer = {
        'id': farmer_counter,
        'name': data['name'],
        'phone': data['phone'],
        'village': data['village'],
        'district': data['district'],
        'field_id': data['field_id'],
        'field_size': float(data['field_size']),
        'crop': data['crop'],
        'risk': data['risk'],
        'lat': float(data['lat']),
        'lng': float(data['lng']),
        'created_at': datetime.now().isoformat()
    }

    farmers.append(farmer)

    return jsonify({
        'message': 'Farmer registered successfully',
        'farmer': farmer
    }), 201


# Get one farmer
@app.route('/api/farmers/<int:farmer_id>', methods=['GET'])
def get_farmer(farmer_id):

    for farmer in farmers:
        if farmer['id'] == farmer_id:
            return jsonify(farmer)

    return jsonify({
        'error': 'Farmer not found'
    }), 404


# Delete farmer
@app.route('/api/farmers/<int:farmer_id>', methods=['DELETE'])
def delete_farmer(farmer_id):

    for farmer in farmers:
        if farmer['id'] == farmer_id:
            farmers.remove(farmer)

            return jsonify({
                'message': 'Farmer deleted successfully'
            })

    return jsonify({
        'error': 'Farmer not found'
    }), 404


# ============================================================
# RESOURCE APIs
# ============================================================

# Get all resources
@app.route('/api/resources', methods=['GET'])
def get_resources():
    return jsonify(resources)


# Add a new resource
@app.route('/api/resources', methods=['POST'])
def add_resource():
    global resource_counter

    data = request.get_json()

    if not data:
        return jsonify({
            'error': 'Request body is required'
        }), 400

    required_fields = [
        'type',
        'available',
        'distance'
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({
                'error': f'Missing required field: {field}'
            }), 400

    resource_counter += 1

    resource = {
        'id': resource_counter,
        'type': data['type'],
        'icon': data.get('icon', '🚜'),
        'available': int(data['available']),
        'distance': data['distance'],
        'status': data.get('status', 'Available'),
        'created_at': datetime.now().isoformat()
    }

    resources.append(resource)

    return jsonify({
        'message': 'Resource added successfully',
        'resource': resource
    }), 201


# Request a resource
@app.route('/api/resources/<int:resource_id>/request', methods=['POST'])
def request_resource(resource_id):

    for resource in resources:

        if resource['id'] == resource_id:

            if resource['available'] <= 0:
                return jsonify({
                    'error': 'Resource is currently unavailable'
                }), 400

            resource['available'] -= 1

            # Automatically change status when nothing remains
            if resource['available'] == 0:
                resource['status'] = 'Unavailable'

            return jsonify({
                'message': 'Resource requested successfully',
                'resource': resource
            })

    return jsonify({
        'error': 'Resource not found'
    }), 404


# Add sample resources
@app.route('/api/resources/sample', methods=['POST'])
def add_sample_resources():
    global resource_counter

    samples = [
        {
            'type': 'Tractor',
            'icon': '🚜',
            'available': 5,
            'distance': '3.2 km'
        },
        {
            'type': 'Water Tanker',
            'icon': '💧',
            'available': 2,
            'distance': '5.1 km'
        },
        {
            'type': 'Seed Supply',
            'icon': '🌱',
            'available': 120,
            'distance': '2.4 km'
        },
        {
            'type': 'Fertilizer',
            'icon': '🧪',
            'available': 18,
            'distance': '4.8 km'
        },
        {
            'type': 'Harvest Machine',
            'icon': '🌾',
            'available': 3,
            'distance': '7.2 km'
        },
        {
            'type': 'Pesticide Sprayer',
            'icon': '🪣',
            'available': 8,
            'distance': '6.0 km'
        }
    ]

    added_resources = []

    for sample in samples:
        resource_counter += 1

        resource = {
            'id': resource_counter,
            'type': sample['type'],
            'icon': sample['icon'],
            'available': sample['available'],
            'distance': sample['distance'],
            'status': 'Available',
            'created_at': datetime.now().isoformat()
        }

        resources.append(resource)
        added_resources.append(resource)

    return jsonify({
        'message': f'Added {len(added_resources)} sample resources',
        'resources': added_resources
    }), 201


# ============================================================
# DASHBOARD API
# ============================================================

@app.route('/api/dashboard/stats', methods=['GET'])
def dashboard_stats():

    high_risk_farmers = len([
        farmer for farmer in farmers
        if farmer['risk'].lower() == 'high'
    ])

    total_resources = sum(
        resource['available']
        for resource in resources
    )

    unread_alerts = len([
        alert for alert in alerts
        if not alert['read']
    ])

    return jsonify({
        'total_farmers': len(farmers),
        'total_fields': len(farmers),
        'high_risk_fields': high_risk_farmers,
        'active_alerts': len(alerts),
        'unread_alerts': unread_alerts,
        'available_resources': total_resources
    })


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'AgriRisk Flask API is running',
        'status': 'online',
        'version': '1.0'
    })


@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'backend': 'Flask',
        'port': 8000
    })


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == '__main__':
    print("=" * 60)
    print("🌾 AgriRisk Smart Agriculture API")
    print("=" * 60)
    print("Server: http://127.0.0.1:8000")
    print("Alerts:    /api/alerts")
    print("Farmers:   /api/farmers")
    print("Resources: /api/resources")
    print("Dashboard: /api/dashboard/stats")
    print("=" * 60)

    app.run(
        host='127.0.0.1',
        port=8000,
        debug=True
    )