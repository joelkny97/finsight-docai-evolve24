# FinSight-DocAI

**Personalized Financial News and Document Q&A Application**

## Overview

FinSight-DocAI is an innovative application that leverages OpenAI and HuggingFace models to provide personalized financial news summarization and document analysis. The application is designed to help users stay informed about the latest financial trends and to facilitate in-depth analysis of financial documents.

## Features

1. **Financial News Summarization**:
   - The `/mynews` portal retrieves finance-related news articles from various sources and summarizes them to provide essential financial insights.

2. **Document Q&A**:
   - The `/financeqa` portal allows users to upload PDF documents for analysis. Users can ask questions about the document and receive semantic answers, analysis, and specific details.

## Instructions to Run the Application

### Prerequisites

- Python 3.8 or higher
- Node.js (for React frontend)
- Virtual environment (recommended)
- Required dependencies (listed in `requirements.txt`)

### Setup

1. **Clone the Repository**:

   git clone https://github.com/joelkny97/finsight-docai-evolve24/tree/docai-deploy.git
   

2. **Set Up the Backend**:
   - Navigate to the backend directory:
   cd backend
   - Create and activate a virtual environment:
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   - Install the required Python packages:
   pip install -r requirements.txt

3. **Set Up the Frontend**:
   - Navigate to the frontend directory:
   cd ../frontend
   - Install the required Node.js packages:
   npm install frontend/package.json

4. **Environment Variables**:
   - Create a .env file in the backend directory and add the necessary environment variables (e.g., `DJANGO_SECRET_KEY`, `DATABASE_URL`).

5. **Run the Backend**:
   - Navigate back to the backend directory and run the server:
   cd ../backend
   python manage.py runserver

6. **Run the Frontend**:
   - In a new terminal window, navigate to the frontend directory and start the React application:
   cd frontend
   npm start

7. **Migrate Database**:
   - In a new terminal window, navigate to the backend directory and run:
   cd backend
   python manage.py migrate
   python manage.py createsuperuser (Follow the steps to create the superuser that would be needed for Admin purposes)

### Access the Application

- Open your browser and go to http://localhost:8000/mynews for the financial news portal.
- Additionally, 
- Go to http://localhost:8000/financeqa for the document Q&A application.

## Contributing

If you would like to contribute to this project, feel free to fork the repository and submit a pull request.


## Acknowledgements

- OpenAI
- Cloudera
- HuggingFace
- Django
- React