loggedUserEmail = '';

function createUser(){
    var form = document.forms[1];
    var data = {
        "email":form.elements["email"].value,
        "primeiroNome":form.elements["primeiroNome"].value,
        "ultimoNome":form.elements["ultimoNome"].value,
        "senha":form.elements["password"].value
    }
    
    var url = 'http://psoft-1152109412238.herokuapp.com/api/v1/usuarios/';

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
    var url = 'http://psoft-1152109412238.herokuapp.com/api/v1/auth/login/';
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

            //localStorage.setItem("loggedUser", res.data);
        }else{
            failed = true;
        }
        return res.json()
    })
    .then(response => {
        if (failed){
            alert(response.message);
        }else{
            localStorage.setItem("loggedEmail",form.elements["email"].value);
            localStorage.setItem("token", response.token);
            window.location.href = "/index.html"; 
        }
    }).catch(function(error){
		alert(error.message);
	});

}

function boasVindas(){

    console.log(localStorage.getItem("loggedUser"));
    window.location.href = "#";

    var greetings = document.getElementById("greetings");
    if(localStorage.getItem("token") == null ){
        greetings.innerHTML = "Você não está logado";
        document.getElementById('login').style.display = 'inline';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('createAccout').style.display = 'inline';
        
    }else{
        greetings.innerHTML = "Seja bem vindo";
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'inline';
        document.getElementById('createAccout').style.display = 'none';
        
    }
}

function logout(){
    localStorage.removeItem("token");
    console.log("fez logout");
    console.log(localStorage.getItem("token"));
    boasVindas();
    var x = document.getElementById("disciplinas");
    x.innerHTML = '';
}


function closeDisciplina(){
    vendoDisciplina = '';
}

function buscaDisciplina(){
    var myInit = { method: 'GET',
               mode: 'cors',
               cache: 'default' };

    console.log(myInit);

    var form = document.forms[0];
    disciplina = form.elements["paraPesquisar"].value;
    var url = "http://psoft-1152109412238.herokuapp.com/api/v1/disciplinas/"+disciplina;
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
            var verDisc;
            console.log(verDisc);
            var discData ={
                "nome":element.nome,
                "id":element.id
            }

            if (isLogged()){
                test = element.id;
                verDisc = ` <a href="#two" onclick="viewDiscipline(${test})">[++Mostrar profile]</a>`;
            }else{
                verDisc = '';
            }

            div.innerHTML = element.nome+" Id: "+element.id+verDisc;
            x.appendChild(div);
            console.log(x);
        });
    });
}
function isLogged(){
    if(localStorage.getItem("token") == null ){
        return false;
    }else{
        return true;
    }
}

function viewDiscipline(id){
    vendoDisciplina = id;
    //console.log(id);
    //armazenando o id da discplina
    //localStorage.setItem("dId", id);
    url = `http://psoft-1152109412238.herokuapp.com/api/v1/disciplina/${id}`
    var myToken = localStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer '+myToken);

    var myInit = { 
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        headers: myHeaders
    };

    fetch(url, myInit)
    .then(res => res.json())
    .then(function(response){
        /* Parte de alterar o documento*/   

        var disciTitle = document.getElementById("discTitle");
        disciTitle.innerHTML = response.nomeDisciplina;

        var viewLikes = '';
        var qtdLikes = 0;

        response.likes.forEach(element =>{
            viewLikes += element.nome + ', ';
            qtdLikes += 1;
        });

        var numLikes = document.getElementById("qtdLikes");

        numLikes.innerHTML = `<strong>${qtdLikes}</strong> pessoas gostaram dessa disciplina`;

        var disciLikes = document.getElementById("discLikes");
        disciLikes.innerHTML = viewLikes + "curtiram(iu) essa disciplina";

        });

}

function likeDiscipline(){

    var userEmail = localStorage.getItem("loggedEmail");

    console.log(userEmail);
    //console.log(vendoDisciplina);

    url = `http://psoft-1152109412238.herokuapp.com/api/v1/disciplina/${vendoDisciplina}/like/${userEmail}`;

    console.log(url);

    var myToken = localStorage.getItem("token");

    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer '+myToken);

    var init = {
        method: 'POST',
        headers: myHeaders
    };

    var loginFail = false;

    fetch(url, init)
    .then(function(res){
        if (res.ok){
            paraVer = vendoDisciplina;
            closeDisciplina()
            viewDiscipline(paraVer);
            alert(`Você acaba de curtir essa disciplina`);
        }else{
            loginFail = true;
        }
        return res;
    }).then(response => response.json())
    .then(function(response2){
        if (loginFail){
            alert("Erro: "+ response2.message);
        }
    });

    
    

}