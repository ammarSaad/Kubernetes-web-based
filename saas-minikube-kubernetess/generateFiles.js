const fs = require('fs');
const registerLogic = require('./registerLogic');




function restore(){

  try{
  return JSON.parse(fs.readFileSync('usersDB.json'));  
  } catch(e){
      return [];
  }
}


function generateFiles(inputNamespace,userName){

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



////////////////////////
//files data

let _001_local_volumes_yaml=
`
apiVersion: v1
kind: PersistentVolume
metadata:
  name: local-volume-${namespace} 
spec:
  capacity:
    storage: ${volume_capacity_storage}
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /data/local-volume-${namespace} 
---
apiVersion: v1
kind: PersistentVolume
metadata:
  name: local-volume-${namespace} 
spec:
  capacity:
    storage: ${volume_capacity_storage}
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /data/local-volume-${namespace} 
`;



let _002_mysql_credentials_yaml=
`
apiVersion: v1
kind: Secret
metadata:
  name: mysql-credentials
  namespace: ${namespace}
type: Opaque
data:
   # password: demo
   password: ZGVtbw==
`;


let _podinfo_hpa_yaml=
`
apiVersion: autoscaling/v2beta1
kind: HorizontalPodAutoscaler
metadata:
  name: wordpress-${namespace}
  namespace: ${namespace}
  labels:
    app: wordpress
    tier: frontend
    env : development
spec:
  scaleTargetRef:
    apiVersion: extensions/v1beta1
    kind: Deployment
    name: wordpress-${namespace}
  minReplicas: ${minReplicas}
  maxReplicas: ${maxReplicas}
  metrics:
  - type: Resource
    resource:
      name: cpu
      targetAverageUtilization: ${targetAverageUtilization}
  - type: Resource
    resource:
      name: memory
      targetAverageValue: ${targetAverageValue}
`;


let _001_mysql_volume_yaml=
`
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-volume-${namespace}
  namespace: ${namespace}
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
`;
    
let _002_mysql_deployment_yaml=
`
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: mysql-${namespace}
  namespace: ${namespace}
  labels:
    app: mysql
    tier: backend
    env: development
spec:
  replicas: 1
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: mysql
        tier: backend
        env: development
    spec:
      containers:
      - name: mysql-${namespace}
        image: mysql:latest
        imagePullPolicy: IfNotPresent
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-credentials
              key: password
        ports:
        - containerPort: 3306
        volumeMounts:
        - mountPath: /var/lib/mysql
          name: mysql-volume-mount
      volumes:
      - name: mysql-volume-mount
        persistentVolumeClaim:
          claimName: mysql-volume-${namespace}

`;
    
let _003_mysql_service_yaml=
`
apiVersion: v1
kind: Service
metadata:
  name: mysql-${namespace}
  namespace: ${namespace}
  labels:
    app: mysql
    tier: backend
    env: development
spec:
  selector:
    app: mysql
    tier: backend
    env: development
  ports:
    - protocol: TCP
      port: 3306
  clusterIP: None

`;


let _001_wordpress_volume_yaml=
`
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wordpress-volume-${namespace}
  namespace: ${namespace}
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi

`;

let _002_wordpress_deployment_yaml = 
`
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: wordpress-${namespace}
  namespace: ${namespace}
  labels:
    app: wordpress
    tier: frontend
    env: development
spec:
  replicas: 2
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress
        tier: frontend
        env: development
    spec:
      containers:
      - name: wordpress-${namespace}
        image: wordpress:latest #wordpress:4.7.3-apache
        imagePullPolicy: IfNotPresent
        env:
        - name: WORDPRESS_DB_HOST
          value: mysql-${namespace}
        - name: WORDPRESS_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-credentials
              key: password
        ports:
        - containerPort: 80
        volumeMounts:
        - mountPath: /var/www/html
          name: wordpress-volume-mount
      volumes:
      - name: wordpress-volume-mount
        persistentVolumeClaim:
          claimName: wordpress-volume-${namespace}

`;


let _003_wordpress_service_yaml=
`
apiVersion: v1
kind: Service
metadata:
  name: wordpress-${namespace}
  namespace: ${namespace}
  labels:
    app: wordpress
    tier: frontend
    env: development
spec:
  type: NodePort
  selector:
    app: wordpress
    tier: frontend
    env: development
  ports:
    - protocol: TCP
      nodePort: 301${userPort}
      port: 80
`;

let _001_phpmyadmin_deployment_yaml =
`
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: phpmyadmin-${namespace}
  namespace: ${namespace}
  labels:
    app: phpmyadmin
    tier: frontend
    env: development
spec:
  replicas: 1
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: phpmyadmin
        tier: frontend
        env: development
    spec:
      containers:
      - name: phpmyadmin-${namespace}
        image: phpmyadmin/phpmyadmin:latest
        imagePullPolicy: IfNotPresent
        env:
        - name: PMA_HOST
          value: mysql-${namespace}
        ports:
        - containerPort: 80

`;

let _002_phpmyadmin_service_yaml = 
`
apiVersion: v1
kind: Service
metadata:
  name: phpmyadmin-${namespace}
  namespace: ${namespace}
  labels:
    app: phpmyadmin
    tier: frontend
    env: development
spec:
  selector:
    app: phpmyadmin
    tier: frontend
    env: development
  ports:
    - protocol: TCP
      nodePort: 302${userPort}
      port: 80
  type: NodePort
`;
////////////////
//current directory

if (!fs.existsSync('namespaces'))
    fs.mkdirSync('namespaces');

if (!fs.existsSync('namespaces/'+namespace))
    fs.mkdirSync('namespaces/'+namespace);

fs.writeFileSync('./namespaces/'+namespace+'/001-local-volumes.yaml',_001_local_volumes_yaml);

fs.writeFileSync('./namespaces/'+namespace+'/002-mysql-credentials.yaml',_002_mysql_credentials_yaml);

fs.writeFileSync('./namespaces/'+namespace+'/podinfo-hpa.yaml',_podinfo_hpa_yaml);


//////////////////
//003-mysql directory

let dir;

dir = './namespaces/'+namespace+"/003-mysql";

if (!fs.existsSync(dir))
    fs.mkdirSync(dir);

fs.writeFileSync('./'+dir+'/001-mysql-volume.yaml',_001_mysql_volume_yaml);
    
fs.writeFileSync('./'+dir+'/002-mysql-deployment.yaml',_002_mysql_deployment_yaml);
    
fs.writeFileSync('./'+dir+'/003-mysql-service.yaml',_003_mysql_service_yaml);


/////////////////
//004-wordpress directory

dir = './namespaces/'+namespace+'/004-wordpress';

if (!fs.existsSync(dir))
    fs.mkdirSync(dir);

fs.writeFileSync('./'+dir+'/001-wordpress-volume.yaml',_001_wordpress_volume_yaml);
    
fs.writeFileSync('./'+dir+'/002-wordpress-deployment.yaml',_002_wordpress_deployment_yaml);
    
fs.writeFileSync('./'+dir+'/003-wordpress-service.yaml',_003_wordpress_service_yaml);

//
dir = './namespaces/'+namespace+'/005-phpmyadmin';

if (!fs.existsSync(dir))
    fs.mkdirSync(dir);

fs.writeFileSync('./'+dir+'/001-phpmyadmin-deployment.yaml',_001_phpmyadmin_deployment_yaml);
    
fs.writeFileSync('./'+dir+'/002-phpmyadmin-service.yaml',_002_phpmyadmin_service_yaml);
    
}


function generateFilesPyUser(files,inputNamespace,userName){

  let userArray  = restore();
  let userNumber = userArray.length;
  let namespaceCount =  registerLogic().getNamepace(userName).length;
  
  
  let userPort = userNumber+``+namespaceCount;
  
  console.log("user port "+userPort);
  
  
  let namespace = inputNamespace.toLowerCase();
  
  
  
  if (!fs.existsSync('namespaces'))
      fs.mkdirSync('namespaces');
  
  if (!fs.existsSync('namespaces/'+namespace))
      fs.mkdirSync('namespaces/'+namespace);

  fs.writeFileSync('./namespaces/'+namespace+'/yaml_file.yaml',files);
  
  }

  module.exports = {
    generateFiles,
    generateFilesPyUser
 }
