from flask import Flask, request, jsonify, Response
# from flask_talisman import Talisman
from flask_cors import CORS
import pandas as pd
import joblib
import xgboost
import shap

app = Flask(__name__)
CORS(app)
# csp = {
#     'default-src': [
#         '\'self\'',
#         '\'unsafe-inline\'',
#         '\'unsafe-eval\'',
#         'http://localhost:5000',
#         'http://gc.kis.v2.scr.kaspersky-labs.com',
#         'ws://gc.kis.v2.scr.kaspersky-labs.com',
#         'https:'
#     ],
#     'connect-src': [
#         '\'self\'',
#         '\'unsafe-inline\'',
#         '\'unsafe-eval\'',
#         'http://localhost:5000',
#         'http://gc.kis.v2.scr.kaspersky-labs.com',
#         'ws://gc.kis.v2.scr.kaspersky-labs.com',
#         'https:'
#     ]
# }

# Talisman(app, content_security_policy=csp)


# Load the saved XGBoost model and transformations
model = joblib.load('./app/xgb.joblib')
label_encoder = joblib.load('./app/label_encoder.joblib')
minmax_scaler = joblib.load('./app/minmax_scaler.joblib')

# Numerical features names
num_features = ['Month', 'Age', 'Monthly_Inhand_Salary', 'Num_Bank_Accounts', 'Num_Credit_Card', 'Interest_Rate',
            'Num_of_Loan', 'Num_of_Delayed_Payment', 'Delay_from_due_date', 'Outstanding_Debt']

# Initialize SHAP explainer
explainer = shap.TreeExplainer(model)

def custom_response(data, status_code=200):
    response = Response(data, status_code)
    response.headers['Content-Security-Policy'] = "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://stackpath.bootstrapcdn.com https://code.jquery.com https://cdnjs.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' 'unsafe-eval' fonts.gstatic.com fonts.googleapis.com https://stackpath.bootstrapcdn.com https://use.fontawesome.com; object-src 'none'; img-src 'self' data: blob:; font-src 'self' data: https://use.fontawesome.com fonts.gstatic.com fonts.googleapis.com; connect-src 'self' http://127.0.0.1:5000;"
    return response

def preprocess_data(data):
    data['Month'] = label_encoder.transform(data['Month'])
    data[num_features] = minmax_scaler.transform(data[num_features])

    return data

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json(force=True)
    print(data)
    input_df = pd.DataFrame(data, index=[0])
    processed_df = preprocess_data(input_df)
    print("="*30)
    print(processed_df)
    # Make predictions
    predictions = model.predict(processed_df)
    probabilities = model.predict_proba(processed_df)

    # Get SHAP values
    shap_values = explainer(processed_df)

    # Prepare the response
    response = {
        'predictions': predictions.tolist(),
        'probabilities': probabilities.tolist(),
        'shap_values': shap_values.values.tolist(),
        'input_data': data
    }
    print("="*30)
    print("Response ready.")
    return jsonify(response)

@app.route('/predict_batch', methods=['POST'])
def predict_csv():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file provided'}), 400

    if not file.filename.endswith('.csv'):
        return jsonify({'error': 'Invalid file type'}), 400

    input_df = pd.read_csv(file)
    input_df['Month'] = label_encoder.transform(input_df['Month'])
    input_df[num_features] = minmax_scaler.transform(input_df[num_features])

    if (input_df['Credit_Mix'] == "Good"):
        input_df["Credit_Mix_Good"] = 1
        input_df["Credit_Mix_Bad"] = 0
        input_df["Credit_Mix_Unknown"] = 0
    elif (input_df['Credit_Mix'] == "Bad"):
        input_df["Credit_Mix_Good"] = 0
        input_df["Credit_Mix_Bad"] = 1
        input_df["Credit_Mix_Unknown"] = 0
    else:
        input_df["Credit_Mix_Good"] = 0
        input_df["Credit_Mix_Bad"] = 0
        input_df["Credit_Mix_Unknown"] = 1

    if (input_df['Payment_of_Min_Amount'] == "Yes"):
        input_df["Payment_of_Min_Amount_Yes"] = 1
        input_df["Payment_of_Min_Amount_No"] = 0
        input_df["Payment_of_Min_Amount_NM"] = 0
    elif (input_df['Payment_of_Min_Amount'] == "No"):
        input_df["Payment_of_Min_Amount_Yes"] = 0
        input_df["Payment_of_Min_Amount_No"] = 1
        input_df["Payment_of_Min_Amount_NM"] = 0
    else:
        input_df["Payment_of_Min_Amount_Yes"] = 0
        input_df["Payment_of_Min_Amount_No"] = 0
        input_df["Payment_of_Min_Amount_NM"] = 1


    input_df.drop(['Payment_of_Min_Amount', 'Credit_Mix'], axis=1, inplace=True)
    print(input_df)

    # Make predictions
    predictions = model.predict(input_df)
    probabilities = model.predict_proba(input_df)

    # Prepare the response
    response = {
        'predictions': predictions.tolist(),
        'probabilities': probabilities.tolist()
    }

    return custom_response(jsonify(response), 200)

if __name__ == '__main__':
    app.run(debug=True)
