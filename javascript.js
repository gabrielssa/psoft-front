
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

    //mudando cursor para progress
    var body = document.getElementById("body");
    body.style.cursor = 'progress';

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
                verDisc = ` <a href="#two" class="verPerfil" onclick="viewDiscipline(${test})">Ver Perfil</a>`;
            }else{
                verDisc = '';
            }

            div.innerHTML = `${element.id} - ${element.nome}<br>${verDisc}`;
            x.appendChild(div);
            console.log(x);
        });

        body.style.cursor = "auto";
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

    document.forms[1].elements["comentar"].value = '';
    
    //console.log(id);
    //armazenando o id da discplina
    //localStorage.setItem("dId", id);
    userEmail = localStorage.getItem("loggedEmail");

    url = `http://psoft-1152109412238.herokuapp.com/api/v1/disciplina/${id}/${userEmail}/`;

    console.log(url);

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

        console.log("Resposta do servidor",response);

        var likeStatus = document.getElementById("likeStatus");
        if (response.curtiu){
            likeStatus.innerHTML = "Retirar o Like";
            likeStatus.onclick = function(){
                removeLike(userEmail);
            };
        }else{
            likeStatus.innerHTML = "Dar Like";
            likeStatus.onclick = function(){
                likeDiscipline();
            }
        }

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

        //Comentando
        var commentsDiv = document.getElementById("comments");
        var commentButton = document.getElementById("enviaC");
        

        
        commentButton.onclick = function(){
            comentaDisciplina(vendoDisciplina, userEmail,myToken)
        };

        //Exibindo Comentários

        if (response.comentarios == 0){
            commentsDiv.innerHTML ="";
            div1 = document.createElement('div');
            div1.innerHTML = 'Ninguém comentou sobre essa disciplina';
            commentsDiv.appendChild(div1);

        }else{
            console.log(response.comentarios);
            commentsDiv.innerHTML = '';

            response.comentarios.reverse().forEach(element =>{
                console.log(element);

                div = document.createElement('div');
                div.setAttribute('class', 'comentario');
                div.setAttribute('id', `${element.id}`);
                widgetsDiv = document.createElement('div');
            

                divHour = document.createElement('div');
                divHour.setAttribute('class', 'horario');
                divHour.innerHTML = `Dia ${element.dataEHora.slice(0,10)}  às ${element.dataEHora.slice(11,16)}`;

                div.innerHTML = `<strong>${element.usuario}</strong> disse: ${element.comentario}`;

                //subdive de widgets em cada comentário

                widgetsDiv = document.createElement('div');
                widgetsDiv.setAttribute('class', 'widgetsDiv');


                if (element.emailUsuario == userEmail){
                    widgetsDiv.innerHTML = `<a href=#two id="removeComment" onclick="apagar(${element.id},${id})">Apagar</a>`;
                }

                widgetsDiv.innerHTML += '<a href=#two id="replyComment"> Responder</a>';
                widgetsDiv.innerHTML += `<a href=#two id="replyComment" onclick="verRespostas(${element.id})"> Ver Respostas</a>`;

                //Criando o formulario para resposta do comentário no próprio comentário
                divComenta = document.createElement('div');
                divComenta.setAttribute('class', 'responderComentario');
                var formComenta = `<form id=form${element.id}>

                <input type="text" class ="comment resp" name="paraResponder" autocomplete="off"  placeholder="sua resposta" />
				<input type="button" class="myButton" value="Responder" onclick="respondeComentario(${element.id})"/>
                </form>`;
                divComenta.innerHTML = formComenta;

                
                
                div.appendChild(divHour);
                div.appendChild(widgetsDiv);
                commentsDiv.appendChild(div);

                //Colocando o form de formulario no comentario

                div.appendChild(divComenta);

                console.log(document.getElementById(element.id));
            });
            //closeDisciplina();
            //viewDiscipline(id);
        }


        });

}

function respondeComentario(id){
    //{id}/comentario_resposta/{email}/{comentario}
    var loggedEmail = localStorage.getItem("loggedEmail");
    var oform = document.getElementById(`form${id}`);

    var meuComentario = oform.paraResponder.value;

    url = `http://psoft-1152109412238.herokuapp.com/api/v1/disciplina/${id}/comentario_resposta/${loggedEmail}/${meuComentario}`;

    console.log("respondendo o comentário " +id);
    console.log(url);
}

function verRespostas(id){
    console.log("mostrando respostas do comentario com id: "+id);
    //{id}/comentario_resposta
    url = `http://psoft-1152109412238.herokuapp.com/api/v1/disciplina/${id}/comentario_resposta`;

    mainComment = document.getElementById(id);
    replyComment = document.createElement('div');
    replyComment.setAttribute('class', 'comentarioResposta');

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
        response.forEach(element =>{
            div = document.createElement('div');
            div.innerHTML = '';
            div.setAttribute('class', 'comentarioResposta');
            div.setAttribute('id', `${element.id}`);
            widgetsDiv = document.createElement('div');
        

            divHour = document.createElement('div');
            divHour.setAttribute('class', 'horario');
            divHour.innerHTML = `Dia ${element.dataEHora.slice(0,10)}  às ${element.dataEHora.slice(11,16)}`;

            div.innerHTML = `<strong>${element.usuario}</strong> Respondeu: ${element.comentario}`;

            //subdive de widgets em cada comentário

            widgetsDiv = document.createElement('div');
            widgetsDiv.setAttribute('class', 'widgetsDiv');


            if (element.emailUsuario == userEmail){
                widgetsDiv.innerHTML = `<a href=#two id="removeComment" onclick="apagar(${element.id},${vendoDisciplina})">Apagar</a>`;
            }

            widgetsDiv.innerHTML += '<a href=#two id="replyComment"> Responder</a>';
            widgetsDiv.innerHTML += `<a href=#two id="replyComment" onclick="verRespostas(${element.id})"> Ver Respostas</a>`;
            

            div.appendChild(divHour);
            div.appendChild(widgetsDiv);
            mainComment.appendChild(div);
        });
    });


}

function removeLike(userEmail){
    //{id}/like/{email}
    url = `http://psoft-1152109412238.herokuapp.com/api/v1/disciplina/${vendoDisciplina}/like/${userEmail}`;

    var myToken = localStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer '+myToken);

    var myInit = { 
        method: 'DELETE',
        mode: 'cors',
        cache: 'default',
        headers: myHeaders
    };

    fetch(url, myInit)
    .then(response => console.log(response))
    .then(function(res){
        var paraVer = vendoDisciplina;
        closeDisciplina();
        viewDiscipline(paraVer);
        alert('Você retirou o like dessa disciplina');
    });

}

//Apaga comentário
function apagar(id,idDisciplina){

    url = `http://psoft-1152109412238.herokuapp.com/api/v1/disciplina/${idDisciplina}/comentario/${id}`;

    console.log(id,idDisciplina);
    //"/{id}/comentario/apagar/{idComentario}")

    var myToken = localStorage.getItem("token");
    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer '+myToken);

    var myInit = { 
        method: 'DELETE',
        mode: 'cors',
        cache: 'default',
        headers: myHeaders
    };

    fetch(url, myInit)
    .then(res => res.json)
    .then(function(response){
        closeDisciplina();
        viewDiscipline(idDisciplina);
    });


}

function comentaDisciplina(id,userEmail,myToken){
    var form = document.forms[1];
    comentario = form.elements["comentar"].value;
    ///{id}/comentario/{email}/{comentario}

    url = `http://psoft-1152109412238.herokuapp.com/api/v1/disciplina/${id}/comentario/${userEmail}/${comentario}`;

    console.log(`tentando comentar usando as seguintes configurações: id: ${id}, userEmail: ${userEmail}, comentario: ${comentario}`)

    const myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer '+myToken);

    var myInit = { 
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        headers: myHeaders
    };

    fetch(url, myInit)
    .then(res => res.json())
    .then(function(response){
        console.log(response);
        closeDisciplina();
        viewDiscipline(id);
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
            console.log(res);
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