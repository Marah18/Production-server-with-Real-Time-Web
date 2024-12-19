
# B3 Production

## To run the application:

1. Clone it using GitHub link.

2. Run "npm install"

3. Configure Environment Variables

In `.env` file in the root of the project you: 
- configure the following environment variables:

GITLAB_API_TOKEN= "add your personal access token to gitlab"

PORT=5001

GITLAB_PROJECT_ID=  "this is my maintainer group id, you should change it to yours"

GITLAB_SECRET_TOKEN= "add your webhook secret token"

4. Run "npm start" and then the application will be running on "localhost:5001"


## Notes:
### *Environment Variables* `.env` file:
stores sensitive information, including API keys and secrets to ensure they are not exposed, that enhancing security and preventing unauthorized access.

### *GITLAB_SECRET_TOKEN* :
I used it for webhook authentication to help ensure that the webhooks received by the application come from GitLab tp prevent unauthorized access, and enhances the overall security of your webhook handling process.


## In the cscloud server: 
### *Nginx* :
Nginx used as a reversed proxy that handles incoming requests and forwards them to the appropriate backend service.

### *HTTPS and HTTP* :
 In configuration listens on port 80 for HTTP and port 443 for HTTPS
HTTPS ensures that all communications are encrypted.

