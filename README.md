
# Intro 
A Ticketing App with Microservice architecture Using Docker, Kubernetes and Skaffold. Built with Node.js, Express and React. Based on Software Architect Stephen Grider course. 

# 1. Architecture 
* **Infrastructure**: Hosted on Digital Ocean's Kubernetes service (DOKS).
* **DNS and Load Balancing**: User requests are resolved via Digital Ocean DNS and distributed by the Digital Ocean Load Balancer.
* **Ingress**: The NGINX Ingress Controller routes external HTTP traffic to internal services

* **Microservices**:
  *  _Auth Service_: Handles user authentication and token issuance.
  *  _Ticket Service:_ Manages ticket listings.
  *  _Orders Service_: Processes ticket purchases and locks.
  *  _Payment Service_: Conducts payment transactions.
  *  _Expiration Service_: Monitors time-sensitive ticket locks.
  *  _Data Stores:_ MongoDB for persistence, Redis for expiration tracking.
  *  _Messaging_: NATS Streaming Service for inter-service communication.
  *  _Shared Logic_: Reusable code managed by common library (Published NPM module: https://www.npmjs.com/package/@javachiphi-tix/common)

## System diagram 
This visualizes the architecture of the ticketing app's microservices as mentioned above. 
<img width="901" alt="System diagram" src="https://github.com/javachiphi/monorepo/assets/134835433/963ed10c-0889-4d7a-b4d4-24c7c6e37f96">


## Sequence diagram 
This outlines the flow of operations in the ticketing app from the user's perspective and interaction with the backend services. 

* **User Authentication:** User signs in, receiving a token from the Auth Service.
* **Ticket Listing:** User lists a ticket, which is broadcasted by the Ticket Service.
* **Ticket Purchase Process:**
  * A ticket purchase locks the ticket via the Orders Service.
  * The Expiration Service starts a 15-minute countdown.
  * Payment information is processed by the Payment Service.
* **Outcome**:
  * If payment is successful, the Orders Service confirms the purchase.
  * If payment fails or time expires, the ticket is unlocked for other buyers.
* **Messaging**:
  * NATS Streaming Service orchestrates event-driven communication between services.
  * 
<img width="955" alt="Sequence diagram" src="https://github.com/javachiphi/monorepo/assets/134835433/a0b6a810-cb59-4d80-ab29-a81f41909a9d">

# Get Started

### Prerequisites 
- **Git**: For cloning the repository.
- **Docker**: For building and running your containers.
- **Kubernetes**: You can use Minikube or enable Kubernetes in Docker Desktop.
- **Skaffold**: For automating your development workflow.
- **Node.js and npm**: For running the services locally and installing dependencies.

### 1. Clone the repository:
```
git clone https://github.com/javachiphi/monorepo.git
```
### 2. Install Dependencies:
Navigate to each service directory and install the required npm packages. 
```
cd auth
npm install
# Repeat for each service directory: tickets, orders, payments, expiration, client 
```

### 3. Configure Local DNS
Configure your local DNS to allow ticketing.dev to point to your local Kubernetes cluster. This step is crucial for routing traffic to your ingress controller correctly.
```
echo "127.0.0.1 ticketing.dev" | sudo tee -a /etc/hosts
```


### 4. Start Services: 
Use Skaffold to build and deploy the services to your Kubernetes cluster. 
```
skaffold dev
```

### 5. Access the Application 
Navigate to http://ticketing.dev in your browser to access the application's frontend.

## Environment Setup
### 1. Kubernetes Secrets 
Create a Kubernetes secret to store your Stripe API key and JWT secret. Get Stripe Secret Key after signing up for an account at Stripe. JWT secret is a random string.       
```
kubectl create secret generic stripe-secret --from-literal STRIPE_KEY=your_stripe_api_key_here
kubectl create secret generic jwt-secret --from-literal jwt=your_jwt_secret_here
```

### 2. Database set up
-No initial setup is required for the databases as they are managed by Kubernetes. They are automatically created when the services first attempt to connect.


## CI/CD with Github Actions 
Our CI/CD pipeline is managed by Github Action. It is designed to independently test each microservice. Once merged, deployments are made to the production environment.
Here’s how it is structured:

1. Feature Branch & Pull Request (PR):
   - Each microservice has its own set of automated test.
   - when PR is made to a service, Github Actions run only the tests relevant to that service
2. Merge & Automated Deployment: 
   - Merging to `main` triggers the deployment workflow in GitHub Actions.
   - The workflow builds the updated services and applies the changes to the Digital Ocean Kubernetes cluster.


# Acknowledgments 
- Thank you Stephen Grieder for the great course.
- Thank you Kenneth for suggesting to write readme & providing a starting point.
- Thank you ChatGPT for guiding & generating mermaid language for diagrams.



