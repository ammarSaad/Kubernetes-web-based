let createDomain = document.querySelector('#createDomain');
let scaleButton = document.querySelector('#scaleLaravel');
let username = document.getElementById('usernameid').text;

createDomain.onclick = function(){

   

    let data = {};
    data.domainName = $('#domainName').val();
    data.username = username;

    console.log(data);

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/createnamespace',						
        success: function(data) {
            console.log('success!!!!!');
            console.log('data: ',JSON.stringify(data));
            console.log()
            alert("NameSpace "+data.result+" Created Successfuly");
            window.location.href = 'http://localhost:3200/tables?username='+username+'&namespace='+data.result;
            
            //$('#resultid')[0].textContent=  `${data.result}`;
        }
    });
    
}

let createDomainMaria = document.querySelector('#createDomainMaria')

createDomainMaria.onclick = function(){

    let data = {};
    data.domainName = $('#domainNameMaria').val();
    data.username = username;

    console.log(data);

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/createnamespaceMaria',						
        success: function(data) {
            console.log('success!!!!!');
            console.log('data: ',JSON.stringify(data));
            console.log()
            alert("NameSpace "+data.result+" Created Successfuly");
            window.location.href = 'http://localhost:3200/tables?username='+username+'&namespace='+data.result;

        }
    });
    
}



createDomainLaravel.onclick = function(){

    let data = {};
    data.domainName = $('#domainNameLaravel').val();
    data.domainNameName =  $('#domainNameLaravelName').val();
    data.username = username;

    console.log(data);

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/createnamespaceLaravel',						
        success: function(data) {
            console.log('success!!!!!');
            console.log('data: ',JSON.stringify(data));
            console.log()
            alert("NameSpace "+data.result+" Created Successfuly");
            window.location.href = 'http://localhost:3200/tables?username='+username+'&namespace='+data.result;

        }
    });
    
}




let deleteNameSpace = function(namespace){
    if(confirm("Are You Sure Delete NameSpace "+namespace))
    {
        let data = {};
        data.domainName = namespace;
        data.username = document.getElementById('usernameid').text;

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/deletenamespace',						
        success: function(data) {
            console.log('success!!!!!');
            console.log('data: ',JSON.stringify(data));
            console.log()
            alert("NameSpace "+data.result+" Deleted Successfuly");
            window.location.href = 'http://localhost:3200/tables?username='+username;
            
        }
    });
}
}

let getPods = function(namespace){
    window.location.href = 'http://localhost:3200/tables?username='+username+"&namespace="+namespace;
}
 

scaleButton.onclick = function(){

    console.log('HI MAN !');

    let data = {};
    data.scaleCount = $('#scaleCountLaravel').val();
    data.username   = username;
    console.log(data.scaleCount);
    console.log(data);

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/scale',						
        success: function(data) {
            console.log('success!!!!!');
            console.log('data: ',JSON.stringify(data));
            console.log()
            
           window.location.href = 'http://localhost:3200/tables?username='+username+'&namespace='+data.result;

        }
    });
}


