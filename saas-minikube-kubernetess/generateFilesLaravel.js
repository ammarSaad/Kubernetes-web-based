const fs = require('fs');
const registerLogic = require('./registerLogic');




function restore(){

  try{
  return JSON.parse(fs.readFileSync('usersDB.json'));  
  } catch(e){
      return [];
  }
}


function generateFilesLaravel(inputNamespace,userName,domainName){

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

// let nodePort = "30020";
const containerPort = "3306";
const mysql_service_port = "3306";

let volume_capacity_storage = "1Gi";

let mysql_password = "root";

let minReplicas = '2';
let maxReplicas = '4';

const targetAverageUtilization = 1;
const targetAverageValue = '70%';


    
let laravel_deployment_yaml=
`
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: laravel
  namespace: ${namespace}
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: laravel
    spec:
      containers:
        - name: laravel
          image: ammar95/laravel-autoscaling:latest
          imagePullPolicy: IfNotPresent
          env:
          - name: APP_KEY
            value: base64:cUPmwHx4LXa4Z25HhzFiWCf7TlQmSqnt98pnuiHmzgY=
          ports:
            - containerPort: 80
`;
    
let laravel_service_yaml =
`
apiVersion: v1
kind: Service
metadata:
  name: laravel
  namespace: ${namespace}
spec:
  ports:
    - nodePort: 314${userPort}
      port: 80
  selector:
    app: laravel
  type: NodePort

`;

let larave_ingress_yaml =
`
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: laravel-ingress
  namespace: ${namespace}
  annotations:
    ingress.kubernetes.io/rewrite-target: /
spec:
  backend:
    serviceName: default-http-server
    servicePort: 80
  rules:
  - host: ${domainName} 
  - http:
      paths:
      - path: /
        backend:
          serviceName: laravel
          servicePort: 80

`;



////////////////
//current directory

if (!fs.existsSync('namespaces'))
    fs.mkdirSync('namespaces');

if (!fs.existsSync('namespaces/'+namespace))
    fs.mkdirSync('namespaces/'+namespace);

fs.writeFileSync('./namespaces/'+namespace+'/laravel_deployment.yaml',laravel_deployment_yaml);

fs.writeFileSync('./namespaces/'+namespace+'/laravel_service.yaml',laravel_service_yaml);
 
fs.writeFileSync('./namespaces/'+namespace+'/laravel_ingress.yaml',larave_ingress_yaml);

}




module.exports = generateFilesLaravel;
