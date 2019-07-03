let createDomain = document.querySelector('#createDomain');
let username = document.getElementById('usernameid').text;

createDomain.onclick = function(){

    let data = {};
    data.domainName = $('#domainName').val();
    data.domainFiles = $('#domainFiles').val();
    data.username = username;

    console.log(data);

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/createnamespacepyuser',						
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
