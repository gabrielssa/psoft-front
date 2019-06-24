function createUser(){
    var form = document.forms[1];
    var data = {
        "email":form.elements["email"].value,
        "primeiroNome":form.elements["primeiroNome"].value,
        "ultimoNome":form.elements["ultimoNome"].value,
        "senha":form.elements["password"].value
    }
    
    var url = 'http://localhost:8080/api/v1/usuarios/';

    var configuration = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    };

    fetch(url, configuration)
    .then(response => response.json())
    .then(function(response){
        if (response.status != "404"){
            alert('Conta '+response.email+" criada!");
            window.location.href = "/login.html";
        }else{
            alert(response.message);
        }
    })

}


function authenticate(email, senha){
    var url = 'http://localhost:8080/api/v1/auth/login/';
    var form = document.forms[1];

    var data2 = {
       "email":form.elements["email"].value,
        "senha":form.elements["senha"].value
        //"email":"diegosantiago@gmail.com",
       // "senha":"ax1v09p2"
    }
    console.log(data2);
    var init = {
        method: 'POST',
        body: JSON.stringify(data2),
        headers:{
            'Content-Type': 'application/json'
        }
    };

    var failed = false;
    fetch(url, init)
    .then(function(res){
        
        if (res.ok){
            alert('Login Efetuado Com Sucesso');
        }else{
            failed = true;
        }
        return res.json()
    })
    .then(response => {
        if (failed){
            alert(response.message);
        }else{
            localStorage.setItem("token", response.token);
            window.location.href = "/index.html"; 
        }
    }).catch(function(error){
		alert(error.message);
	});

}

function boasVindas(){
    var greetings = document.getElementById("greetings");
    if(localStorage.getItem("token") == null ){
        greetings.innerHTML = "Você não está logado";
        document.getElementById('login').style.visibility = 'visible';
        document.getElementById('logout').style.visibility = 'hidden';
        document.getElementById('createAccout').style.visibility = 'visible';
    }else{
        greetings.innerHTML = "Seja bem vindo";
        document.getElementById('login').style.visibility = 'hidden';
        document.getElementById('logout').style.visibility = 'visible';
        document.getElementById('createAccout').style.visibility = 'hidden';
    }
}

function logout(){
    localStorage.removeItem("token");
    console.log("fez logout");
    console.log(localStorage.getItem("token"));
    boasVindas();
}

function buscaDisciplina(){
    var myInit = { method: 'GET',
               mode: 'cors',
               cache: 'default' };

    console.log(myInit);

    var form = document.forms[0];
    disciplina = form.elements["paraPesquisar"].value;
    var url = "http://localhost:8080/api/v1/disciplinas/"+disciplina;
    console.log(url);

    fetch(url, myInit)
    .then(res => res.json())
    .then(function(res){
        var x = document.getElementById("disciplinas");
        x.innerHTML="";
        console.log("res: "+res);
        res.forEach(element => {
            console.log(element);
            var div = document.createElement('div');
            div.setAttribute('class', 'disciplina');
            div.innerHTML = element.nome+" Id: "+element.id;
            x.appendChild(div);
            console.log(x);
        });
    });
}