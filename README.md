# Field Service Assistant
**Field Service Assistant** is an **AI-powered** assistant designed to help Field Service Engineers with technical queries, troubleshooting, and maintenance procedures via the **LINE application**. As well as providing relevant general and statistical information about field service operations. The Sever is hosted on **Google Cloud Run**.

<p align="center"><img src="" width="300"/></p>
<p align="center"><i><b>Figure 1:</b> Demonstration </i></p><br>

<p align="center"><img src="" width="300"/></p>
<p align="center"><i><b>Figure 2:</b> LINE Application Interface </i></p><br>

## **Solution Overview**

### **How It Works**
1. Field engineers send queries through the LINE application.
2. The backend server processes the request via the LINE Messaging API webhook.  
3. The request is packaged into a script with a predefined prompt and forwarded to OpenAI.
4. The AI provides a structured response.
5. The response is returned to the LINE application for display.
  
  ### **System Components**
1. **LINE Application:** User interface for field engineers to interact with the system.
2. **Node.js Server:** Handles incoming messages and routes them to OpenAI.
3. **OpenAI API:** AI system to provide structured responses  
4. **Google Cloud Run** Web-Hosted server to host the Node.js Server

## **Setup & Deployment**
1. Clone this repository
    ```bash
    git clone https://github.com/your-repo/field-engineer-assistant.git
    cd field-engineer-assistant
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Configure environment variables in Google Cloud run environment variables:
    ```bash
    LINE_ACCESS_TOKEN=your_line_access_token
    OPENAI_API_KEY=your_openai_api_key
    ```
4. Start the server:
    ```bash
    npm start
    ```
5. Deploy to Google Cloud Run:
    ```bash
    gcloud run deploy field-engineer-assistant --source .
    ```
6. Optionally, to deploy the server locally, create .env:
    ```bash
    LINE_ACCESS_TOKEN=your_line_access_token
    OPENAI_API_KEY=your_openai_api_key
    PORT=8080
    ```
7. Start the Server Locally:
    ```bash
    npm start
    ```
5. Start ngrok for Public Access:
    ```bash
    ngrok http 8080
    ```
## **Technical Details**

### **Architecture Diagram**
<p align="center">
  <img src="" width="1000" alt="Architectural Diagram"/>
</p>
<p align="center"><i><b>Figure 3:</b> Architectural Diagram</i></p>

### **Data Flow Diagram**
<p align="center">
  <img src="" width="1000" alt="Architectural Diagram"/>
</p>
<p align="center"><i><b>Figure 4:</b> Data Flow Diagram</i></p>

<I>Note: Environment Variables such as API Keys and Token must be generated and retrieved </i> </br>
<I>Note: Webhook URL must be implemented in LINE messaging API by using Google Cloud Run's service URL or ngrok's generated public URL</i>
