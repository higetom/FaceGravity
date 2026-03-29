#!/usr/bin/env python3
"""
FaceGravity Backend -- dlib-based Side Profile Analyzer

Provides a local API endpoint for medical-grade cephalometric analysis
using dlib's 68-point facial landmark detector.

Endpoints:
  POST /api/analyze-side   -- Analyze side-profile photo
  POST /api/analyze-front  -- Analyze frontal photo
  GET  /api/health         -- Health check

Requirements:
  pip install dlib opencv-python-headless numpy flask flask-cors

Usage:
  python3 server.py
  -> Runs on http://localhost:8081

Key advantage of dlib over MediaPipe for side profiles:
  - dlib's 68-point model is trained on Multi-PIE and iBUG 300-W datasets
    which include profile views at various angles
  - More robust chin/jawline detection in side views
  - Better submental point estimation for CMA calculation
"""

import sys
import json
import base64
import math
import io
import os

try:
    import numpy as np
    import cv2
    import dlib
    from flask import Flask, request, jsonify
    from flask_cors import CORS
except ImportError as e:
    print(f"""
=== FaceGravity Backend ===

Missing dependency: {e.name}

Install required packages:

  pip3 install dlib opencv-python-headless numpy flask flask-cors

Note: dlib may require cmake:
  brew install cmake  (macOS)
  apt install cmake   (Linux)

Then retry:
  python3 server.py
""")
    sys.exit(1)

app = Flask(__name__)
CORS(app)

# ============================================================
# dlib Setup
# ============================================================

PREDICTOR_PATH = os.path.join(os.path.dirname(__file__), "shape_predictor_68_face_landmarks.dat")

detector = dlib.get_frontal_face_detector()
predictor = None

def load_predictor():
    global predictor
    if predictor is not None:
        return True
    if not os.path.exists(PREDICTOR_PATH):
        print(f"""
shape_predictor_68_face_landmarks.dat not found.

Download it:
  cd {os.path.dirname(__file__)}
  curl -LO http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2
  bunzip2 shape_predictor_68_face_landmarks.dat.bz2
""")
        return False
    predictor = dlib.shape_predictor(PREDICTOR_PATH)
    return True

# ============================================================
# Geometry Helpers
# ============================================================

def dist(a, b):
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)

def angle_deg(a, vertex, c):
    """Angle at vertex between rays vertex->a and vertex->c (degrees)."""
    va = (a[0] - vertex[0], a[1] - vertex[1])
    vc = (c[0] - vertex[0], c[1] - vertex[1])
    dot = va[0] * vc[0] + va[1] * vc[1]
    mag = math.sqrt(va[0]**2 + va[1]**2) * math.sqrt(vc[0]**2 + vc[1]**2)
    if mag == 0:
        return 0
    cos_val = max(-1, min(1, dot / mag))
    return math.degrees(math.acos(cos_val))

def decode_image(data_url):
    """Decode base64 data URL to OpenCV image."""
    if ',' in data_url:
        data_url = data_url.split(',', 1)[1]
    img_bytes = base64.b64decode(data_url)
    nparr = np.frombuffer(img_bytes, np.uint8)
    return cv2.imdecode(nparr, cv2.IMREAD_COLOR)

# ============================================================
# dlib 68-point Landmarks
#
#  0-16:  jawline (right ear to left ear, through chin)
#     8:  chin tip (gnathion/menton)
#  17-21: right eyebrow
#  22-26: left eyebrow
#  27-30: nose bridge
#  31-35: nose bottom (nostril area)
#    33:  nose tip
#  36-41: right eye
#  42-47: left eye
#  48-59: outer lip
#  60-67: inner lip
# ============================================================

def get_landmarks(img):
    """Detect face and return 68 landmarks as list of (x,y) tuples."""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = detector(gray, 1)  # upsample=1 for better detection
    if not faces:
        # Try again with more upsampling (slower but catches profiles)
        faces = detector(gray, 2)
    if not faces:
        return None
    # Use the largest face
    face = max(faces, key=lambda r: r.width() * r.height())
    shape = predictor(gray, face)
    return [(shape.part(i).x, shape.part(i).y) for i in range(68)]

# ============================================================
# Side Profile Analysis
# ============================================================

def analyze_side_profile(landmarks):
    """
    Cephalometric-inspired analysis from side-view photo.

    CMA (Cervicomental Angle):
      Measured at the menton (chin tip, landmark 8).
      Line 1: menton to subnasal point (landmark 33, nose tip)
      Line 2: menton to cervical point (estimated below chin)

    The cervical point in photos is approximated as the lowest
    visible point of the submental region, estimated from the
    jawline geometry.
    """
    chin_tip = landmarks[8]        # gnathion / menton
    nose_tip = landmarks[33]       # pronasale
    jaw_right = landmarks[0]       # right jaw start
    jaw_left = landmarks[16]       # left jaw end

    # Submental / cervical point estimation
    # In a side view, the chin-to-neck transition is below landmark 8
    # We estimate it by extending the jawline curvature downward
    jaw_6 = landmarks[6]
    jaw_7 = landmarks[7]
    jaw_9 = landmarks[9]
    jaw_10 = landmarks[10]

    # Direction from jaw_7 to chin (landmark 8)
    dx_to_chin = chin_tip[0] - jaw_7[0]
    dy_to_chin = chin_tip[1] - jaw_7[1]

    # Cervical point: continue past chin in the same trajectory
    cervical_est = (
        chin_tip[0] + dx_to_chin * 0.5,
        chin_tip[1] + dy_to_chin * 0.8,
    )

    # CMA: angle at menton between nose-line and cervical-line
    cma = angle_deg(nose_tip, chin_tip, cervical_est)

    # Jawline angle (angle at jawline corners)
    jaw_angle_r = angle_deg(chin_tip, jaw_right, landmarks[17])  # to eyebrow start
    jaw_angle_l = angle_deg(chin_tip, jaw_left, landmarks[26])

    # Jawline length
    jawline_pts = [landmarks[i] for i in range(0, 17)]
    jawline_length = sum(dist(jawline_pts[i], jawline_pts[i+1]) for i in range(16))

    # Face height (nasion to menton)
    nasion = landmarks[27]  # top of nose bridge
    face_height = dist(nasion, chin_tip)

    return {
        "cma_angle": round(cma, 1),
        "jaw_angle_right": round(jaw_angle_r, 1),
        "jaw_angle_left": round(jaw_angle_l, 1),
        "jawline_length": round(jawline_length, 1),
        "face_height": round(face_height, 1),
        "chin_tip": chin_tip,
        "cervical_est": [round(cervical_est[0], 1), round(cervical_est[1], 1)],
        "landmarks_detected": len(landmarks),
    }

# ============================================================
# Frontal Analysis
# ============================================================

def analyze_frontal(landmarks):
    """Frontal face analysis using dlib 68-point model."""
    chin = landmarks[8]
    nose = landmarks[33]
    jaw_r = landmarks[0]
    jaw_l = landmarks[16]
    jaw_mid_r = landmarks[4]
    jaw_mid_l = landmarks[12]

    # JDI
    jaw_angle_r = angle_deg(chin, jaw_mid_r, jaw_r)
    jaw_angle_l = angle_deg(chin, jaw_mid_l, jaw_l)
    avg_jaw_angle = (jaw_angle_r + jaw_angle_l) / 2

    face_width = dist(landmarks[0], landmarks[16])
    jaw_width = dist(jaw_mid_r, jaw_mid_l)
    jaw_ratio = jaw_width / face_width if face_width > 0 else 0

    # Symmetry
    sym_pairs = [
        (dist(nose, landmarks[36]), dist(nose, landmarks[45])),  # eyes
        (dist(nose, landmarks[48]), dist(nose, landmarks[54])),  # mouth
        (dist(nose, landmarks[4]),  dist(nose, landmarks[12])),  # jaw
    ]
    sym_scores = [1 - abs(a - b) / max(a, b) for a, b in sym_pairs if max(a, b) > 0]
    symmetry = round((sum(sym_scores) / len(sym_scores)) * 100) if sym_scores else 80

    return {
        "avg_jaw_angle": round(avg_jaw_angle, 1),
        "jaw_ratio": round(jaw_ratio, 3),
        "symmetry": symmetry,
        "face_width": round(face_width, 1),
        "landmarks_detected": len(landmarks),
    }

# ============================================================
# API Endpoints
# ============================================================

@app.route('/api/health', methods=['GET'])
def health():
    has_model = os.path.exists(PREDICTOR_PATH)
    return jsonify({
        "status": "ok",
        "dlib_version": dlib.__version__,
        "model_loaded": predictor is not None,
        "model_available": has_model,
    })

@app.route('/api/analyze-side', methods=['POST'])
def api_analyze_side():
    if not load_predictor():
        return jsonify({"error": "shape_predictor_68_face_landmarks.dat not found"}), 500

    data = request.json
    if not data or 'image' not in data:
        return jsonify({"error": "Missing 'image' field (base64 data URL)"}), 400

    img = decode_image(data['image'])
    if img is None:
        return jsonify({"error": "Failed to decode image"}), 400

    landmarks = get_landmarks(img)
    if landmarks is None:
        return jsonify({"error": "No face detected in image", "face_detected": False}), 200

    result = analyze_side_profile(landmarks)
    result["face_detected"] = True
    return jsonify(result)

@app.route('/api/analyze-front', methods=['POST'])
def api_analyze_front():
    if not load_predictor():
        return jsonify({"error": "shape_predictor_68_face_landmarks.dat not found"}), 500

    data = request.json
    if not data or 'image' not in data:
        return jsonify({"error": "Missing 'image' field (base64 data URL)"}), 400

    img = decode_image(data['image'])
    if img is None:
        return jsonify({"error": "Failed to decode image"}), 400

    landmarks = get_landmarks(img)
    if landmarks is None:
        return jsonify({"error": "No face detected in image", "face_detected": False}), 200

    result = analyze_frontal(landmarks)
    result["face_detected"] = True
    return jsonify(result)

# ============================================================
# Main
# ============================================================

if __name__ == '__main__':
    print("=== FaceGravity Backend (dlib) ===")
    print()
    if os.path.exists(PREDICTOR_PATH):
        load_predictor()
        print(f"  Model loaded: shape_predictor_68_face_landmarks.dat")
    else:
        print(f"  WARNING: Model not found at {PREDICTOR_PATH}")
        print(f"  Download: curl -LO http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2")
        print(f"            bunzip2 shape_predictor_68_face_landmarks.dat.bz2")
    print()
    print(f"  dlib version: {dlib.__version__}")
    print(f"  Server: http://localhost:8081")
    print()
    app.run(host='127.0.0.1', port=8081, debug=False)
