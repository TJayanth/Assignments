# Risk of Patient Readmission - Flow of execution
- Data prepreocessing is done in datapreprocessing.ipynb file.
- EDA is done in eda.ipynb file. 
- goal1.ipynb is where the patient risk assesment is done
- Pickle file for all model is already present in the repo. 
- Gradient boosting model is picked based on the analysis done in goal1.ipynb file. 

# Run the python back-end api

Use the below code to run the backend

`python -m uvicorn main:app --reload --port 8000`

Ensure that it is up and running by browsing

`http://127.0.0.1:8000/`

# Run the front-end application which is a react to give the below screen

Use the below codes to run the react. 

`cd .\domain1\code\front-end\ `
`npm install `

If policy warning is coming, use the below code to remove the policy warning

`Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned`

To run the app

`npm run dev`

![alt text](image.png)


## How to use the app
- App captures all the fields that are required that ranges from Demographies, Chronic Conditions, Hospitalization details, Lab Results, Medications, Discharge & Follow ups, Insurance and Cost
- Feed the patient details
- Click Evaluate to know the Patient risk of readmission.

### Behind the scenes
- React App connects to fast api server
- Fast API gets the payload from React and checks with the model pickle file
- Computes the Risk score and sends it back to the UI