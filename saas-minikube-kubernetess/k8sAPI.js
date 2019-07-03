let generateFiles = require('./generateFiles');
let generateFilesMaria = require('./generateFilesMaria');
let generateFilesLaravel = require('./generateFilesLaravel');

const registerLogic = require('./registerLogic');
var hostile = require('hostile');

let k8s = require('k8s');

let MinikubeIP = '192.168.39.237';
let MinikubePORT = '8443';

function k8sAPI(IP,PORT){
   

    IP = MinikubeIP;
    PORT = MinikubePORT;

    if
    (
        typeof IP !== 'string'  ||
        typeof PORT !== 'string'||
        IP.trim() === ''        ||
        PORT.trim() === ''
    )
    {
        console.error('please provide IP and PORT as strings');
        return undefined;
    }

    let kubectl = k8s.kubectl({
        endpoint:  `https://${IP}:${PORT}`,
        binary: '/usr/local/bin/kubectl'
    });

    let API = {};
    let successCount = 0;


    API.createNamespace = function createNamespace(namespace,userName){

        if(!kubectl){
            console.error('pleas call API.init first');
            return false;
        }



            function successPromise(data){
                console.log('Success! creating...');
                successCount++;
                if(successCount == 9){
                    console.log('Finish creating Files');
                    console.log('your namespace is ready');
                    return new Promise(function(resolve,reject){
                        resolve(true);
                    })
                }
            }
            
            function failerPromise(error){
                console.log('Failed!... maybe the namespace is already created');
                console.log('Error:');
                console.error(error);
                console.log('-------------------');
            }
            
            generateFiles.generateFiles(namespace,userName);
            let basePath = `${__dirname}/namespaces/${namespace}/`;
    

            ///


            let order = function(){ 
            
                return new Promise(function(resolve, reject){
                    console.log(0);
                    resolve(true);
                })
            }

            return order()
            .then(()=>{
                console.log('hello1')
                return kubectl
                .command(`create namespace ${namespace}`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}laravel.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}003-mysql/001-mysql-volume.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}003-mysql/002-mysql-deployment.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}003-mysql/003-mysql-service.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}004-wordpress/001-wordpress-volume.yaml`)
                .then(successPromise, failerPromise);
            })
    
            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}004-wordpress/002-wordpress-deployment.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}004-wordpress/003-wordpress-service.yaml`)
                .then(successPromise, failerPromise)
            })
              
            // .then(()=>{   
            //      return kubectl
            //     .command(`apply --record -f ${basePath}podinfo-hpa.yaml`)
            //     .then(successPromise, failerPromise);
            // })

            .then(()=>{   
                return kubectl
               .command(`create -f ${basePath}005-phpmyadmin/001-phpmyadmin-deployment.yaml`)
               .then(successPromise, failerPromise);
           })

            .then(()=>{   
                 return kubectl
                .command(`create -f ${basePath}005-phpmyadmin/002-phpmyadmin-service.yaml`)
                .then(successPromise, failerPromise);
            })
            .then(successPromise, failerPromise);
                  
            
    }


    API.createNamespaceMaria = function createNamespaceMaria(namespace,userName){

        if(!kubectl){
            console.error('pleas call API.init first');
            return false;
        }



            function successPromise(data){
                console.log('Success! creating...');
                successCount++;
                if(successCount == 9){
                    console.log('Finish creating Files');
                    console.log('your namespace is ready');
                    return new Promise(function(resolve,reject){
                        resolve(true);
                    })
                }
            }
            
            function failerPromise(error){
                console.log('Failed!... maybe the namespace is already created');
                console.log('Error:');
                console.error(error);
                console.log('-------------------');
            }
            
            generateFilesMaria(namespace,userName);
            let basePath = `${__dirname}/namespaces/${namespace}/`;
    

            ///


            let order = function(){ 
            
                return new Promise(function(resolve, reject){
                    console.log(0);
                    resolve(true);
                })
            }

            return order()
            .then(()=>{
                console.log('hello1')
                return kubectl
                .command(`create namespace ${namespace}`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}activemq/activemq_deployment.yaml`)
                .then(successPromise, failerPromise);
            })
    
            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}activemq/activemq_service.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{   
                return kubectl
               .command(`create -f ${basePath}frontEnd/fe_deployment.yaml`)
               .then(successPromise, failerPromise);
           })

            .then(()=>{   
                 return kubectl
                .command(`create -f ${basePath}frontEnd/fe_service.yaml`)
                .then(successPromise, failerPromise);
            })    
            
            
            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}backEnd/backend_deployment.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}backEnd/backend_ervice.yaml`)
                .then(successPromise, failerPromise);
            })


            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}podinfo-hpa.yaml`)
                .then(successPromise, failerPromise);
            }) 
            .then(successPromise, failerPromise);

    }










    API.createNamespaceLaravel = function createNamespaceLaravel(namespace,userName,domainName){

        if(!kubectl){
            console.error('pleas call API.init first');
            return false;
        }



            function successPromise(data){
                console.log('Success! creating...');
                successCount++;
                if(successCount == 9){
                    console.log('Finish creating Files');
                    console.log('your namespace is ready');
                    return new Promise(function(resolve,reject){
                        resolve(true);
                    })
                }
            }
            
            function failerPromise(error){
                console.log('Failed!... maybe the namespace is already created');
                console.log('Error:');
                console.error(error);
                console.log('-------------------');
            }
            
            generateFilesLaravel(namespace,userName,domainName);
            let basePath = `${__dirname}/namespaces/${namespace}/`;
    

            ///


            let order = function(){ 
            
                return new Promise(function(resolve, reject){
                    console.log(0);
                    resolve(true);
                })
            }

            return order()
            .then(()=>{
                console.log('hello1')
                return kubectl
                .command(`create namespace ${namespace}`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}laravel_deployment.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}laravel_service.yaml`)
                .then(successPromise, failerPromise);
            })            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}laravel_ingress.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{



  hostile.set( IP, domainName , function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('added: ' + domainName +' for :'+IP);
    }
  });
            })

            .then(successPromise, failerPromise);

    }





    

    API.createNamespacePyUser = function createNamespacePyUser(files,namespace,userName){

        if(!kubectl){
            console.error('pleas call API.init first');
            return false;
        }



            function successPromise(data){
                console.log('Success! creating...');
                successCount++;
                if(successCount == 9){
                    console.log('Finish creating Files');
                    console.log('your namespace is ready');
                    return new Promise(function(resolve,reject){
                        resolve(true);
                    })
                }
            }
            
            function failerPromise(error){
                console.log('Failed!... maybe the namespace is already created');
                console.log('Error:');
                console.error(error);
                console.log('-------------------');
            }
            
            generateFiles.generateFilesPyUser(files,namespace,userName);

            let basePath = `${__dirname}/namespaces/${namespace}/`;
    

            ///


            let order = function(){ 
            
                return new Promise(function(resolve, reject){
                    console.log(0);
                    resolve(true);
                })
            }

            return order()
            .then(()=>{
                console.log('hello1')
                return kubectl
                .command(`create namespace ${namespace}`)
                .then(successPromise, failerPromise);
            })

            .then(()=>{
                return kubectl
                .command(`create -f ${basePath}yaml_file.yaml`)
                .then(successPromise, failerPromise);
            })

            .then(successPromise, failerPromise);

    }







    API.deleteNamespace = function deleteNamespace(namespace){

        if(!kubectl){
            console.error('pleas call API.init first');
            return false;
        }



            function successPromise(data){
                console.log('Success! deleteNamespace...');
                successCount++;
                if(successCount == 9){
                    console.log('Finish deleteing Files');
                    console.log('your namespace is ready');
                    return new Promise(function(resolve,reject){
                        resolve(true);
                    })
                }
            }
            
            function failerPromise(error){
                console.log('Failed!... maybe the namespace is already deleted');
                console.log('Error:');
                console.error(error);
                console.log('-------------------');
            }
            
          //  generateFiles(namespace);
           // let basePath = `${__dirname}/namespaces/${namespace}/`;
    

            ///


            let order = function(){ 
            
                return new Promise(function(resolve, reject){
                    console.log(0);
                    resolve(true);
                })
            }

            return order()
            .then(()=>{
                console.log('hello1')
                return kubectl
                .command(`delete namespace ${namespace}`)
                .then(successPromise, failerPromise);
            })
            
        //     .then(()=>{
        //         return kubectl
        //         .command(`delete -f ${basePath}002-mysql-credentials.yaml`)
        //         .then(successPromise, failerPromise);
        //     })

        //     .then(()=>{
        //         return kubectl
        //         .command(`delete -f ${basePath}003-mysql/001-mysql-volume.yaml`)
        //         .then(successPromise, failerPromise);
        //     })

        //     .then(()=>{
        //         return kubectl
        //         .command(`delete -f ${basePath}003-mysql/002-mysql-deployment.yaml`)
        //         .then(successPromise, failerPromise);
        //     })

        //     .then(()=>{
        //         return kubectl
        //         .command(`delete -f ${basePath}003-mysql/003-mysql-service.yaml`)
        //         .then(successPromise, failerPromise);
        //     })

        //     .then(()=>{
        //         return kubectl
        //         .command(`delete -f ${basePath}004-wordpress/001-wordpress-volume.yaml`)
        //         .then(successPromise, failerPromise);
        //     })
    
        //     .then(()=>{
        //         return kubectl
        //         .command(`delete -f ${basePath}004-wordpress/002-wordpress-deployment.yaml`)
        //         .then(successPromise, failerPromise);
        //     })

        //     .then(()=>{
        //         return kubectl
        //         .command(`delete -f ${basePath}004-wordpress/003-wordpress-service.yaml`)
        //         .then(successPromise, failerPromise)
        //     })
              
        //     .then(()=>{   
        //          return kubectl
        //         .command(`delete -f ${basePath}podinfo-hpa.yaml`)
        //         .then(successPromise, failerPromise);
        //     })

        //     .then(()=>{   
        //         return kubectl
        //        .command(`delete -f ${basePath}005-phpmyadmin/001-phpmyadmin-deployment.yaml`)
        //        .then(successPromise, failerPromise);
        //    })

        //     .then(()=>{   
        //          return kubectl
        //         .command(`delete -f ${basePath}005-phpmyadmin/002-phpmyadmin-service.yaml`)
        //         .then(successPromise, failerPromise);
        //     })
            .then(successPromise, failerPromise);

        }


    API.getUserIP = function getUserIPPromise(namespace){
        
       //namespace = [namespace[0]];
        console.log("namespace for get userIp"+namespace);

        return new Promise(function(resolve, reject){
            
            let userKubectl = k8s.kubectl({
                endpoint:  `https://${IP}:${PORT}`,
                namespace: `${namespace}`,
                binary: '/usr/local/bin/kubectl'
            });
    
            
            userKubectl.service.list(function(error, serviceInfo){
                if(error){
                    console.error('failed getting user IP');
                    reject('cannot get user IP');
                }
    
                console.log("serviceInfo : "+serviceInfo.length);

                //return the Service ip for the user
                let userIP = IP;

                let serviceInfoHtml = "";

                for (i = 0; i < serviceInfo.length; i++) { 
                    let sInfo = serviceInfo[i];

                    serviceInfoHtml +=`<tr><td>${i}</td><td> </td><td>${sInfo.metadata.name} </td><td><a traget="blank"  href="http://${userIP}:${sInfo.spec.ports[0].nodePort}">http://${userIP}:${sInfo.spec.ports[0].nodePort}</a> </td></tr>`;
                     
                    console.log(serviceInfoHtml)
                }

                console.log(serviceInfoHtml);

                resolve({ 
                    serviceInfoHtml: serviceInfoHtml
                });
            });
        })
    }


    API.getServiceNames = function getServiceNamesPromise(namespace){
       
        //namespace = [namespace[0]];
        console.log("namespace for services : "+namespace);

        return new Promise(function(resolve,reject){

            let userKubectl = k8s.kubectl({
                endpoint:  `https://${IP}:${PORT}`,
                namespace: `${namespace}`,
                binary: '/usr/local/bin/kubectl'
            });

            let serviceInfoHtml = "";
    
            userKubectl.service.list(function(error, serviceInfo){
                if(error){
                    console.error('failed getting services names');
                   // reject('cannot get services names');
                    resolve(serviceInfoHtml);

                }
    
                let userIP = IP;

                if (serviceInfo != null){


                for (i = 0; i < serviceInfo.items.length; i++) { 
                    let sInfo = serviceInfo.items[i];

                    serviceInfoHtml +=`<tr><td>${i}</td><td>${sInfo.metadata.name} </td><td><a target="blank" href="http://${userIP}:${sInfo.spec.ports[0].nodePort}">http://${userIP}:${sInfo.spec.ports[0].nodePort}</a>  </td></tr>`;
                     
                }

                console.log(serviceInfoHtml);
            }
                resolve(serviceInfoHtml);
            });
        })
    }


    API.getContainerInfo = function getContainerInfoPromise(namespace){
        return new Promise(function(resolve, reject){
                
            let userKubectl = k8s.kubectl({
                endpoint:  `https://${IP}:${PORT}`,
                namespace: `${namespace}`,
                binary: '/usr/local/bin/kubectl'
            });

            // //print pods containers names and their restart counts
            userKubectl.pod.list(function(error, podsInfo){
                
                let resultArray = [];

                if(error){
                    console.error('failed getting container info');
                  //  reject('failed getting container info');
                    resolve(resultArray);
                }

                if (podsInfo != null){

                for(let i=0; i < podsInfo.items.length; i++){
                    
                    let containerName = podsInfo.items[i].metadata.generateName;
                    let restarts = podsInfo.items[i].status.containerStatuses[0].restartCount;
                    let status = podsInfo.items[i].status.phase;
                    
                    let resultObject = {
                        containerName,
                        restarts,
                        status
                    }
                    resultArray.push(resultObject);

                    console.log(`container name:  ${containerName} 
                                restarts:        ${restarts}
                                status:          ${status}
                                `)
                }
             }
                resolve(resultArray);
            }) 
        })
    }


    API.getAutoscalerInfo = function getAutoscalerInfo(namespace){
        
        let userKubectl = k8s.kubectl({
            endpoint:  `https://${IP}:${PORT}`,
            namespace: `${namespace}`,
            binary: '/usr/local/bin/kubectl'
        });

        return userKubectl
        .command('get hpa')
        .then(function(data){

            let extractedData = data.split('\n')[1].split(' ').filter((item) => item.length > 0);

            let hpaInfo = {
                name: extractedData[0],
                refernce: extractedData[1],
                load: extractedData[5],
                targets: `${extractedData[2]} ${extractedData[3]} ${extractedData[4]} ${extractedData[5]} ${extractedData[6]} ${extractedData[7]}`,
                minpods: extractedData[8],
                maxpods: extractedData[9],
                replicas: extractedData[10],
                age: extractedData[11]
            }

            console.log(`
                        replicas: ${hpaInfo.replicas}
                        loads:    ${hpaInfo.load}
                        targets:  ${hpaInfo.targets}
                        `);

            return hpaInfo;
        })
        .catch((error)=>{
            console.error('Failed to get HPA info!');
            console.error(error);
            return('Failed to get HPA info!');
        });
    }


    API.scale = function scale(namespace,count){


        let userKubectl = k8s.kubectl({
            endpoint:  `https://${IP}:${PORT}`,
            namespace: `${namespace}`,
            binary: '/usr/local/bin/kubectl'
        });

        return userKubectl
        .command(`scale --replicas=${count} deployment/laravel --namespace=${namespace}`)
        .then(function(data){

            console.log(data);

            return data;
        })
        .catch((error)=>{
            console.error('Failed to get HPA info!');
            console.error(error);
            return('Failed to get HPA info!');
        });

    }
    
    return API;
}

module.exports = k8sAPI;
