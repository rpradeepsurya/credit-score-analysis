# Credit Score Analysis


<div style="position:relative;width:fit-content;height:fit-content;">
    <a style="position:absolute;top:20px;right:1rem;opacity:0.8;" href="https://clipchamp.com/watch/z0YbMAxJrOa?utm_source=embed&utm_medium=embed&utm_campaign=watch">
        <img style="height:22px;" src="https://clipchamp.com/e.svg" alt="Made with Clipchamp" />
    </a>
    <iframe allow="autoplay;" allowfullscreen style="border:none" src="https://clipchamp.com/watch/z0YbMAxJrOa/embed" width="640" height="360"></iframe>
</div>

This project work is part of UB CSE587 Data Intensive Computing coursework. A comprehensive analysis was performed on a large dataset of credit-related records, followed by the development and tuning of machine learning models, with XGBoost demonstrating superior performance. The model was then integrated into a web application developed with Angular and Flask, which not only predicts credit score brackets in real-time but also provides insightful Power BI visualizations and SHAP value interpretations for model prediction, enhancing the decision-making process.

## Problem Statement

Global finance companies usually use basic banking and credit-related information to determine customers' creditworthiness (also known as credit score brackets). Lenders use these score brackets to categorize borrowers into different risk levels and assess their likelihood of default. Credit scores depend on various factors such as annual income, credit utilization ratio, number of bank accounts, credit cards, etc. Calculating and classifying customers into different score brackets are complicated and challenging for financial companies to do manually. Inaccurate credit score classification can lead to potential financial loss. Therefore, accurate and efficient machine learning models to classify the credit score bracket are required to assist in making informed decisions. Thus, it is a significant problem in the financial and lending industries.
In this project, the objective is to analyze the dataset with banking and credit-related information to identify key features that impact credit score brackets and evaluate different machine learning algorithms to come up with a model that can accurately classify the scores without bias. Thus, developing accurate credit score classification models can help promote equality, fairness, and efficient lending practices.

## Dataset
[Source](https://www.kaggle.com/datasets/parisrohan/credit-score-classification?select=train.csv)

## Steps to run the application

You have to run `setup.sh` to start the application. Before that ensure the following prerequisites are met:

### Prerequisites

- **Python**: Ensure that you have Python installed on your system. You can check this by running `python --version` or `python3 --version` in your terminal. If you don't have Python installed, you can download it from [Python's official website](https://www.python.org/downloads/).

- **pip**: Make sure you have pip (Python package manager) installed. You can check this by running `pip --version` or `pip3 --version`. If you don't have pip, you can follow the [official pip installation guide](https://pip.pypa.io/en/stable/installation/).

- **Node.js and npm**: Ensure that you have Node.js and npm (Node.js package manager) installed. You can check this by running `node --version` and `npm --version` in your terminal. If you don't have Node.js and npm installed, you can download them from [Node.js' official website](https://nodejs.org/en/download/).

- **Angular CLI**: Make sure you have Angular CLI installed globally. You can check this by running `ng --version`. If you don't have Angular CLI, you can install it by running `npm install -g @angular/cli`.

- **Bash shell**: Ensure that you have a bash shell available on your system. On Linux and macOS, bash is usually preinstalled. On Windows, you can use Git Bash, Windows Subsystem for Linux (WSL), or another bash-compatible shell.
