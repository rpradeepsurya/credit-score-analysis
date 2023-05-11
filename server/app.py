import warnings
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import pandas as pd
import joblib
import xgboost
import mpld3
import shap
import io
import base64
import matplotlib
matplotlib.use('Agg')
warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

# Load the saved XGBoost model and transformations
model = joblib.load('./app/xgb.joblib')
label_encoder = joblib.load('./app/label_encoder.joblib')
minmax_scaler = joblib.load('./app/minmax_scaler.joblib')

# Numerical features names
num_features = ['Month', 'Age', 'Monthly_Inhand_Salary', 'Num_Bank_Accounts', 'Num_Credit_Card', 'Interest_Rate',
                'Num_of_Loan', 'Num_of_Delayed_Payment', 'Delay_from_due_date', 'Outstanding_Debt']

# Column order for model input
col_order = ['Month', 'Age', 'Monthly_Inhand_Salary', 'Num_Bank_Accounts', 'Num_Credit_Card', 'Interest_Rate',
             'Num_of_Loan', 'Credit_Mix_Bad', 'Credit_Mix_Good', 'Credit_Mix_Standard', 'Credit_Mix_Unknown',
             'Num_of_Delayed_Payment', 'Delay_from_due_date', 'Outstanding_Debt', 'Payment_of_Min_Amount_NM',
             'Payment_of_Min_Amount_No', 'Payment_of_Min_Amount_Yes']

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
    input_df = pd.DataFrame(data, index=[0])
    processed_df = preprocess_data(input_df)

    # Make predictions
    predictions = model.predict(processed_df)
    probabilities = model.predict_proba(processed_df)

    # Get SHAP values
    shap_values = explainer.shap_values(
        pd.DataFrame(processed_df.iloc[0, :]).T)

    shap.initjs()
    summary_plot = shap.summary_plot(shap_values, pd.DataFrame(
        processed_df.iloc[0, :]).T, class_names=['Poor', 'Standard', 'Good'])
    summary_html = mpld3.fig_to_html(plt.gcf())

    # Get the current axes
    ax = plt.gca()

    # Iterate through the patches (bars) in the axes and add annotations
    for p in ax.patches:
        width = p.get_width()
        height = p.get_height()
        x = p.get_x()
        y = p.get_y()

        # Adjust the annotation alignment
        ax.annotate(
            f"{width:.2f}",
            (x + width / 2, y + height / 2),
            xytext=(0, 0),
            textcoords="offset points",
            ha="center",
            va="center",
            fontsize=8,
        )

    # Save the plot to a bytes buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)

    # Encode the bytes buffer as a base64 string
    summary_plot_base64 = base64.b64encode(buf.getvalue()).decode()

    # Close the plot to free up resources
    plt.close()
    plt.clf()

    # Create the force plot
    force_plot = shap.force_plot(explainer.expected_value[0], shap_values[0], pd.DataFrame(
        processed_df.iloc[0, :]).T, show=False)
    force_html = mpld3.fig_to_html(plt.gcf())

    # Get the current axes
    ax = plt.gca()

    # Iterate through the patches (bars) in the axes and add annotations
    for p in ax.patches:
        width = p.get_width()
        height = p.get_height()
        x = p.get_x()
        y = p.get_y()

        # Adjust the annotation alignment
        ax.annotate(
            f"{width:.2f}",
            (x + width / 2, y + height / 2),
            xytext=(0, 0),
            textcoords="offset points",
            ha="center",
            va="center",
            fontsize=8,
        )

    # Save the plot to a bytes buffer
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)

    # Encode the bytes buffer as a base64 string
    force_plot_base64 = base64.b64encode(buf.getvalue()).decode()

    # Close the plot to free up resources
    plt.close()
    plt.clf()

    # Extract data from the summary plot
    summary_data = {
        'base_value': explainer.expected_value[0].tolist(),
        # shap_values[0].tolist(),
        'shap_values': [shap_value.tolist() for shap_value in shap_values[0]],
        'feature_values': processed_df.iloc[0, :].values.tolist(),
        'feature_names': processed_df.columns.tolist(),
        'class_names': ['Poor', 'Standard', 'Good'],
    }

    # Extract data from the force plot
    force_data = {
        'base_value': explainer.expected_value[0].tolist(),
        # shap_values[0][0].tolist(),
        'shap_values': [shap_value.tolist() for shap_value in shap_values[0][0]],
        'feature_values': processed_df.iloc[0, :].values.tolist(),
        'feature_names': processed_df.columns.tolist(),
    }

    # Prepare the response
    response = {
        'predictions': predictions.tolist(),
        'probabilities': probabilities.tolist(),
        # 'shap_values': shap_values,
        'summary_data': summary_data,
        'force_data': force_data,
        'summary_base64': summary_plot_base64,
        'force_base64': force_plot_base64,
        'input_data': data
    }

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
    send_df = input_df.copy()

    input_df['Month'] = label_encoder.transform(input_df['Month'])
    input_df[num_features] = minmax_scaler.transform(input_df[num_features])

    # One-hot encoding
    input_df['Credit_Mix_Good'] = input_df['Credit_Mix'].apply(
        lambda x: 1 if x == 'Good' else 0)
    input_df['Credit_Mix_Bad'] = input_df['Credit_Mix'].apply(
        lambda x: 1 if x == 'Bad' else 0)
    input_df['Credit_Mix_Standard'] = input_df['Credit_Mix'].apply(
        lambda x: 1 if x == 'Standard' else 0)
    input_df['Credit_Mix_Unknown'] = input_df['Credit_Mix'].apply(
        lambda x: 1 if x == 'Unknown' else 0)

    input_df['Payment_of_Min_Amount_NM'] = input_df['Payment_of_Min_Amount'].apply(
        lambda x: 1 if x == 'NM' else 0)
    input_df['Payment_of_Min_Amount_No'] = input_df['Payment_of_Min_Amount'].apply(
        lambda x: 1 if x == 'No' else 0)
    input_df['Payment_of_Min_Amount_Yes'] = input_df['Payment_of_Min_Amount'].apply(
        lambda x: 1 if x == 'Yes' else 0)

    input_df.drop(['Credit_Mix', 'Payment_of_Min_Amount'],
                  axis=1, inplace=True)
    ordered_df = input_df[col_order]

    # Make predictions for each row in the DataFrame
    predictions = model.predict(ordered_df)

    send_df['Credit_Score'] = predictions
    send_df['Credit_Score'] = send_df['Credit_Score'].map(
        {2: 'Good', 1: 'Standard', 0: 'Poor'})

    # Save the updated DataFrame to a CSV file
    updated_file = 'updated_file.csv'
    send_df.to_csv(updated_file, index=False)

    with open(updated_file, 'r') as f:
        file_content = f.read()

    return Response(
        file_content,
        mimetype='text/csv',
        headers={
            'Content-Disposition': 'attachment; filename=updated_file.csv'
        }
    )


if __name__ == '__main__':
    app.run(debug=True)
