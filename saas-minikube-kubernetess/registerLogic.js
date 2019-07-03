const fs = require('fs');

//[ 
 //   {username: 'user1', password: 'secret', email: 'user@gmail.com', namespaces:[]},
//    {...} 
//]



function registerLogic(){

    function save(usersObject){
        fs.writeFileSync('usersDB.json', JSON.stringify(usersObject));
    }

    function restore(){

        try{
        return JSON.parse(fs.readFileSync('usersDB.json'));  
        } catch(e){
            return [];
        }
    }

    function getServices(){
        try{
        return JSON.parse(fs.readFileSync('public/services/servicesDB.json'));
         } catch(e){
        return [];
     }
    }

    function signin(email, password){
        
        //save checking
        if(     typeof email !== 'string'    ||
                typeof password !== 'string' ||
                email.trim() === ''          ||
                password.trim() === ''
          ) 
        return false;

        let usersArray = restore();
        let filterdArray = usersArray.filter( user => user['email'] === email);
       
        if(filterdArray.length == 1){
            let searchResult = filterdArray[0];
            if( searchResult['email'] === email && 
                searchResult['password'] === password )
                return true;
        }

        return false;
    }

    function signup(inputEmail, inputPassword, inputUsername){

        //save checking
        if(     typeof inputEmail !== 'string'    ||
                typeof inputPassword !== 'string' ||
                typeof inputUsername !== 'string' ||
                inputEmail.trim() === ''          ||
                inputPassword.trim() === ''          ||
                inputUsername.trim() === ''
          ) 
        return false;

        let usersArray = restore();
        let filterdArray = usersArray.filter( user => user['email'] === inputEmail);
            filterdArray = filterdArray.filter( user => user['username'] === inputUsername );
        
        if(filterdArray.length == 0){
            usersArray.push({username: inputUsername, password: inputPassword,email: inputEmail, namespaces: []});
            save(usersArray);
            return true;
        }

        return false;
    }

    function addNamespace(email, inputNamespace){
        if(
            typeof email !== 'string'           ||
            typeof inputNamespace !== 'string'  ||
            email.trim() === ''                 ||
            inputNamespace.trim() === ''
        )
        return false;

        let namespace = inputNamespace.toLowerCase();
        let usersArray = restore();

        //find the email to add namespace to him/her
        let filterdArray = usersArray.filter( user => user['email'] === email);

        if(filterdArray.length == 1){
            let searchResult = filterdArray[0];

            //add the namespace
            let index = usersArray.indexOf(searchResult);
            if(index != -1){
                let allNamespaces = usersArray[index]['namespaces'];
               
                //already has this namespace
                if(allNamespaces.indexOf(namespace) == -1){
                    usersArray[index]['namespaces'].push(namespace);
                    save(usersArray);
                    return true;
                }
            }
        }
        
        return false;
    }



    function deleteNamespace(email, inputNamespace){
        if(
            typeof email !== 'string'           ||
            typeof inputNamespace !== 'string'  ||
            email.trim() === ''                 ||
            inputNamespace.trim() === ''
        )
        return false;

        let namespace = inputNamespace.toLowerCase();
        let usersArray = restore();

        console.log("remove"+email+inputNamespace);

        //find the email to add namespace to him/her
        let filterdArray = usersArray.filter( user => user['email'] === email);

        if(filterdArray.length == 1){
            let searchResult = filterdArray[0];

            //add the namespace
            let index = usersArray.indexOf(searchResult);
            if(index != -1){
                let allNamespaces = usersArray[index]['namespaces'];
               
                //already has this namespace
                if(allNamespaces.indexOf(namespace) != -1){
                    usersArray[index]['namespaces'].splice(allNamespaces.indexOf(namespace),1);
                    save(usersArray);
                    return true;
                }
            }
        }
        
        return false;
    }




    function getUsername(email){
        let usersArray = restore();
        let filterdArray = usersArray.filter(user => user['email'] === email);
        
        if(filterdArray.length == 1)
            return filterdArray[0]['username'];
        
        return undefined;
    }

    function getEmail(username){
        let usersArray = restore();
        let filterdArray = usersArray.filter(user => user['username'] === username);
        
        if(filterdArray.length == 1)
            return filterdArray[0]['email'];
        
        return undefined;       
    }
    
    function getNamepace(username){
        let usersArray = restore();
        let filterdArray = usersArray.filter(user => user['username'] === username);
        
        if(filterdArray.length == 1)
            return filterdArray[0]['namespaces'];
        
        return undefined;       
    }

    return {
        signin,
        signup,
        addNamespace,
        getUsername,
        getEmail,
        getNamepace,
        getServices,
        deleteNamespace,
    }
}

module.exports = registerLogic;