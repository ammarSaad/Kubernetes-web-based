let k8sAPI = require('./k8sAPI');

let MinikubeIP = '192.168.39.237';
let MinikubePORT = '8443';

let API = k8sAPI(MinikubeIP,MinikubePORT);


let namespace = 'audi';

API.createNamespace(namespace)
.then((res) => {

    API.getUserIP(namespace)
    .then((res) => console.log(res))
    .catch((e)=> console.log(e))

    API.getServiceNames(namespace)
    .then((res) => console.log(res))
    .catch((e)=> console.log(e))

    API.getContainerInfo(namespace)
    .then((res) => console.log(res))
    .catch((e)=> console.log(e))

    API.getAutoscalerInfo(namespace)
    .then((res) => console.log(res))
    .catch((e)=> console.log(e))

})
.catch((e)=> console.log(e))

