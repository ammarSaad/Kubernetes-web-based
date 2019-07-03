const fs = require('fs');
const registerLogic = require('./registerLogic');




function restore(){

  try{
  return JSON.parse(fs.readFileSync('usersDB.json'));  
  } catch(e){
      return [];
  }
}


function generateFilesMaria(inputNamespace,userName){

let userArray  = restore();
let userNumber = userArray.length;
let namespaceCount =  registerLogic().getNamepace(userName).length;


let userPort = userNumber+``+namespaceCount;

console.log("user port "+userPort);


let namespace = inputNamespace.toLowerCase();

let deployment_request_cpu_wordpress = '250m';
let deployment_limit_cpu_wordpress = '350m';
let deployment_request_memory_wordpress = '128Mi';
let deployment_limit_memory_wordpress = '256Mi';

let deployment_request_cpu_sql = '250m';
let deployment_limit_cpu_sql = '350m';
let deployment_request_memory_sql = '128Mi';
let deployment_limit_memory_sql = '256Mi';

const containerPort = "3306";
const mysql_service_port = "3306";

let volume_capacity_storage = "1Gi";

let mysql_password = "root";

let minReplicas = '2';
let maxReplicas = '4';

const targetAverageUtilization = 1;
const targetAverageValue = '70%';


let hpay_aml=
`
apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: spring-boot-hpa
  namespace: ${namespace}
spec:
  scaleTargetRef:
    apiVersion: extensions/v1beta1
    kind: Deployment
    name: backend
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Pods
    pods:
      metricName: messages
      targetAverageValue: 10
`;

    
let backend_deployment_yaml=
`
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: backend
  namespace: ${namespace}
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: backend
      annotations:
        prometheus.io/scrape: 'true'
    spec:
      containers:
        - name: backend
          image: ammar95/aqm-spring:firsttry
          imagePullPolicy: IfNotPresent
          env:
            - name: ACTIVEMQ_BROKER_URL
              value: 'tcp://queue:61616'
            - name: STORE_ENABLED
              value: 'false'
            - name: WORKER_ENABLED
              value: 'true'
          ports:
            - containerPort: 8080
          livenessProbe:
            initialDelaySeconds: 5
            periodSeconds: 5
            httpGet:
              path: /health
              port: 8080
          resources:
            limits:
              memory: 512Mi

`;
    
let backend_ervice_yaml =
`
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: ${namespace}
spec:
  ports:
    - nodePort: 31004
      port: 80
      targetPort: 8080
  selector:
    app: backend
  type: NodePort

`;



let activemq_deployment_yaml = 
`
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: queue
  namespace: ${namespace}
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: queue
    spec:
      containers:
        - name: web
          image: webcenter/activemq:5.14.3
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 61616
          resources:
            limits:
              memory: 512Mi 

`;


let activemq_service_yaml =
`
apiVersion: v1
kind: Service
metadata:
  name: queue
  namespace: ${namespace}
spec:
  ports:
    - port: 61616
      targetPort: 61616
  selector:
    app: queue
`;

let fe_deployment_yaml =
`
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: frontend
  namespace: ${namespace}
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: ammar95/aqm-spring:firsttry
          imagePullPolicy: IfNotPresent
          env:
            - name: ACTIVEMQ_BROKER_URL
              value: 'tcp://queue:61616'
            - name: STORE_ENABLED
              value: 'true'
            - name: WORKER_ENABLED
              value: 'false'
          ports:
            - containerPort: 8080
          livenessProbe:
            initialDelaySeconds: 5
            periodSeconds: 5
            httpGet:
              path: /health
              port: 8080
          resources:
            limits:
              memory: 512Mi

`;

let fe_service_yaml = 
`
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: ${namespace}
spec:
  ports:
    - nodePort: 32004
      port: 80
      targetPort: 8080
  selector:
    app: frontend
  type: NodePort
`;
////////////////
//current directory

if (!fs.existsSync('namespaces'))
    fs.mkdirSync('namespaces');

if (!fs.existsSync('namespaces/'+namespace))
    fs.mkdirSync('namespaces/'+namespace);

fs.writeFileSync('./namespaces/'+namespace+'/podinfo-hpa.yaml',hpay_aml);


//////////////////
//003-mysql directory

let dir;

dir = './namespaces/'+namespace+"/backEnd";

if (!fs.existsSync(dir))
    fs.mkdirSync(dir);
    
fs.writeFileSync('./'+dir+'/backend_deployment.yaml',backend_deployment_yaml);
    
fs.writeFileSync('./'+dir+'/backend_ervice.yaml',backend_ervice_yaml);


/////////////////
//004-wordpress directory

dir = './namespaces/'+namespace+'/activemq';

if (!fs.existsSync(dir))
    fs.mkdirSync(dir);
    
fs.writeFileSync('./'+dir+'/activemq_deployment.yaml',activemq_deployment_yaml);
    
fs.writeFileSync('./'+dir+'/activemq_service.yaml',activemq_service_yaml);

//
dir = './namespaces/'+namespace+'/frontEnd';

if (!fs.existsSync(dir))
    fs.mkdirSync(dir);

fs.writeFileSync('./'+dir+'/fe_deployment.yaml',fe_deployment_yaml);
    
fs.writeFileSync('./'+dir+'/fe_service.yaml', fe_service_yaml);
    



}


module.exports = generateFilesMaria;
