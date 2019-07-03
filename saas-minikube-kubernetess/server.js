const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser')
const open = require('open');

const generateFiles = require('./generateFiles');
const registerLogic = require('./registerLogic');

const k8sAPI = require('./k8sAPI');
let API = k8sAPI('192.168.39.237','8443');


let app = express();
let appRegisterLogic = registerLogic();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

    app.use(allowCrossDomain);
    //some other code


//listening for connections
app.listen(3200, () => {
    console.log('server is runing...');
    (async () => {
        await open('http://localhost:3200', {wait: true});
    })();
})

//serve handle bars views
app.set('view engine', 'hbs');

//serve static scripts and assets
app.use(express.static(__dirname + '/public'));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//save server log
app.use((request, response, next) => {
    let log = `Get a reqest ${new Date().getHours()}:${new Date().getMinutes()} ${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()} ${request.method} ${request.url} ${request.body}`;
    console.log(log);

    let previous = fs.readFileSync('server-log.log');
    fs.writeFileSync('server-log.log', `${previous}\n${log}`);
    next();
})

//default Route
app.get('/', (request, response) => {
    response.render('index.hbs');
})

app.get('/signup', (request, response) => {
    if(request.query.email &&
       request.query.pass  &&
       request.query.username
      ){
        console.log(request.query);
        let userInfo = request.query;
        let result = appRegisterLogic.signup(userInfo.email, userInfo.pass, userInfo.username);
        if(result)
            response.render('dashboard.hbs',{
                username: request.query.username,
                services: getServicesHtml(),
            });
        else 
            response.render('signup.hbs');
    } else
            response.render('signup.hbs');
})

app.get('/login', (request, response) => {
    if(request.query.email &&
       request.query.pass 
     ){
        console.log(request.query);
        let userInfo = request.query;
        let result = appRegisterLogic.signin(userInfo.email, userInfo.pass);
        if(result)
            response.render('dashboard.hbs',{
                username: appRegisterLogic.getUsername(request.query.email),
                services: getServicesHtml(),
            });
        else
            response.render('login.hbs');
    } else
    response.render('login.hbs');
})

app.get('/dashboard', (request, response) => {
    response.render('dashboard.hbs',{
        username: request.query.username,
        services: getServicesHtml(),
    });
})


app.get('/flot', (request, response) => {

    let namespace = appRegisterLogic.getNamepace(request.query.username);
    API.getAutoscalerInfo(namespace)
    .then((res) => {

        response.render('flot.hbs',{
            username: request.query.username,
            autoScalerInfo: JSON.stringify(res, undefined, 2)
        });
    })
    .catch((e)=> console.log(e))


})

app.get('/content', (request, response) => {
    response.render('content.hbs',{
        username: request.query.username
    });
})

app.get('/panels-wells', (request, response) => {
    response.render('panels-wells.hbs',{
        username: request.query.username
    });
})

app.get('/tables', (request, response) => {

    let namespace = request.query.namespace;

    if (namespace == null)
    {
        namespace = appRegisterLogic.getNamepace(request.query.username)[0];
    }

    console.log(namespace);

    API.getContainerInfo(namespace)
    .then((res) => {

        let containerInfo =  eval(JSON.stringify(res, undefined, 2));
        console.log("containerInfo : "+containerInfo);
        let containerInfoHtml = "";

        for (i = 0; i < containerInfo.length; i++) { 
           let cInfo = containerInfo[i];
           containerInfoHtml +="<tr><td>"+ i +"</td><td>"+cInfo.containerName+"</td><td>"+cInfo.restarts+"</td><td>"+cInfo.status+"</td></tr>";
        }

        let namespacesInfo =  registerLogic().getNamepace(request.query.username);
        console.log(containerInfo);
        let namespacesInfoHtml = "";
        
        for (i = 0; i < namespacesInfo.length; i++) { 
           let sInfo = namespacesInfo[i];
           if (sInfo == namespace){
            namespacesInfoHtml +='<label class="namespace" onclick="getPods(\''+sInfo+'\')" style="border: 5px solid #83bcde; z-index:10;">'+
                                  sInfo+'</label> <label  onclick="deleteNameSpace(\''+sInfo+'\')" class="fa fa-trash"></label>';
           }else{
            namespacesInfoHtml +='<label class="namespace" onclick="getPods(\''+sInfo+'\')" >'+sInfo+'</label>'
                        +'</label> <label  onclick="deleteNameSpace(\''+sInfo+'\')" class="fa fa-trash"></label>';;
             }
            }


        response.render('tables.hbs',{
            username: request.query.username,
            containerInfoHtml : containerInfoHtml,
            namespaces : namespacesInfoHtml
        });

    })
    .catch((e)=> console.log(e))

})

app.get('/forms', (request, response) => {

    let namespace = request.query.namespace;

    if (namespace == null)
    {
        namespace = appRegisterLogic.getNamepace(request.query.username)[0];
    }

    let namespacesInfo =  registerLogic().getNamepace(request.query.username);
    let namespacesInfoHtml = "";
    
    for (i = 0; i < namespacesInfo.length; i++) { 
       let sInfo = namespacesInfo[i];
       if (sInfo == namespace){
        namespacesInfoHtml +='<label class="namespace" onclick="getPodsMaria(\''+sInfo+'\')" style="border: 5px solid #83bcde; z-index:10;">'+
                              sInfo+'</label> <label  onclick="deleteNameSpace(\''+sInfo+'\')" class="fa fa-trash"></label>';
       }else{
        namespacesInfoHtml +='<label class="namespace" onclick="getPodsMaria(\''+sInfo+'\')" >'+sInfo+'</label>'
                    +'</label> <label  onclick="deleteNameSpace(\''+sInfo+'\')" class="fa fa-trash"></label>';;
         }
        }


    console.log(namespace);


        API.getServiceNames(namespace)
        .then((res) => {

            console.log("services : "+res);
            response.render('forms.hbs',{
                username: request.query.username,
                namespacesInfoHtml : namespacesInfoHtml,
                servicesInfoHtml : res
            });
        
    })
    .catch((e)=> console.log(e))

})


app.post('/createnamespace',(request, response) => {
    console.log(request.body);

    let email = appRegisterLogic.getEmail(request.body.username);
    appRegisterLogic.addNamespace(email, request.body.domainName);


    API.createNamespace(request.body.domainName,request.body.username)
    .then((res) => {
        console.log(res);
        response.send({result:request.body.domainName});
    })
    .catch((e)=>{
        console.error(e);
    })

})


app.post('/createnamespacepyuser',(request, response) => {

    console.log(request.body);

    let email = appRegisterLogic.getEmail(request.body.username);
    appRegisterLogic.addNamespace(email, request.body.domainName);


    API.createNamespacePyUser(request.body.domainFiles,request.body.domainName,request.body.username)
    .then((res) => {
        console.log(res);
        response.send({result:request.body.domainName});
    })
    .catch((e)=>{
        console.error(e);
    })

})



app.post('/createnamespaceMaria',(request, response) => {
    console.log(request.body);

    let email = appRegisterLogic.getEmail(request.body.username);
    appRegisterLogic.addNamespace(email, request.body.domainName);


    API.createNamespaceMaria(request.body.domainName,request.body.username)
    .then((res) => {
        console.log(res);
        response.send({result:request.body.domainName});
    })
    .catch((e)=>{
        console.error(e);
    })

})


app.post('/createnamespaceLaravel',(request, response) => {
    console.log(request.body);

    let email = appRegisterLogic.getEmail(request.body.username);
    appRegisterLogic.addNamespace(email, request.body.domainName);


    API.createNamespaceLaravel(request.body.domainName,request.body.username,request.body.domainNameName)
    .then((res) => {
        console.log(res);
        response.send({result:request.body.domainName});
    })
    .catch((e)=>{
        console.error(e);
    })

})

app.post('/deletenamespace',(request, response) => {
    console.log(request.body);

    let email = appRegisterLogic.getEmail(request.body.username);
    appRegisterLogic.deleteNamespace(email, request.body.domainName);


    API.deleteNamespace(request.body.domainName)
    .then((res) => {
        console.log(res);
        response.send({result:request.body.domainName});
    })
    .catch((e)=>{
        console.error(e);
    })

})

app.post('/scale',(request, response) => {

    console.log('scale on server');

    let scaleCount = request.body.scaleCount;

    let namespace = appRegisterLogic.getNamepace(request.body.username)[0];

    console.log('namespace for scaling : '+ namespace+' scaleCount : '+scaleCount);

    API.scale(namespace,scaleCount)
    .then((res) => {
        console.log(res);
        response.send({result:namespace});
    })
    .catch((e)=>{
        console.error(e);
    })

})


app.get('/deploypyuser', (request, response) => {
    response.render('deploypyuser.hbs',{
        username: request.query.username,
        services: getServicesHtml(),
    });
})


//Route not available
app.use((request, response, next) => {
    response.render('notavailable.hbs');
})



function getServicesHtml(){
    
 let servicesInfo =  registerLogic().getServices();
 console.log(servicesInfo);
 let servicesInfoHtml = "";

 for (i = 0; i < servicesInfo.length; i++) { 
    let sInfo = servicesInfo[i];
    servicesInfoHtml +=
    '    <div class="col-lg-3 col-md-6">'+
    '    <div class="panel panel-primary">'+
    '        <div class="panel-heading">'+
    '            <div class="row">'+
    '                <div class="col-xs-3">'+
    '                    <img src="'+sInfo.image+'">'+
    '                </div>'+
    '                <div class="col-xs-9 text-right">'+
    '                    <label>'+sInfo.name+'</label>'+
    '                </div>'+
    '            </div>'+
    '        </div>'+
    '        <a href="#">'+
    '            <div class="panel-footer">'+
    '                <span class="pull-left">View Details</span>'+
    '                <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>'+
    '                <div class="clearfix"></div>'+
    '            </div>'+
    '        </a>'+
    '    </div>'+
    '</div>';;
 }

 return servicesInfoHtml;

}




