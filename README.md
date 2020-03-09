# psoft191-front
Frontend do projeto de psoft 2019.1 na UFCG

O frontend foi feito completamente em js, html e css. Os arquivos existentes no projeto são: create_accout.html que possui um formulário para a criação de contas, nesse formulário o usuário pode colocar primeiro nome, último nome, e-mail e senha. A partir dessa página o usuário pode também acessar um link para logar, caso já tenha uma conta.

login.html - Após criar a conta o usuário é automaticamente redirecionado para essa página de login, onde pode entrar com e-mail e senha para ser autenticado, caso não tenha uma senha, pode clicar no link para criar uma conta.

index.html - Página principal, possui um link para o login, outro link para criar conta. Aqui o usuário quando não está logado vê uma mensagem que diz "VOcê não está logado", mas ainda pode pesquisar as disciplinas sem ter acesso ao perfil delas. Não consegue vizualizar o ranking das disciplinas.

Na página principal, ao logar o botão de login e criar conta somem, ficando apenas o botão de logout. O botão de logout também desaparece se o usuário não estiver logado.

Ao logar, o usuário pode pesquisar uma disciplina na barra de pesquisa, e dessa vez um botão com o nome 'VER PERFIL' é adicionado a cada nome de disciplina que aparece nos resultados. 

Ao abrir um perfil de uma disciplina (ainda no index, esse processo é feito a partir de uma div que muda seu style de display de none para block e passa a ser vizível, um position: absolute também foi adicionado para a <div> de profile parecer uma janela de um programa que pode ser fechada).

O profile da disciplina - Como já dito, é feito a partir de uma div. Ao abrir essa 'janela' o usuário pode fecha-la clicando no widget fechar, no lado superior direito. Além disso, o usuário pode DAR LIKE na disciplina, clicando em um widget que fica ao lado do botão de fechar.

Nesse profile o usuário pode ver quantas pessoas deram like na disciplina, além disso também pode saber quem foi que deu estes likes a partir do primeiro nome e ultimo nome de todas as pessoas que deram like. O nome da disciplina aparece no topo da página.

Os comentários - Existe uma barra de comentários que permite adicionar comentários diretos a disciplina, esses comentários serão exibidos em ordem do mais recente para o menos recente.

Cada comentário também possui o seu formulário para que o usuário possa responder a outro comentário específico. Diferente dos comentários diretos a disciplina, os comentários de comentários só são vizualizados caso o usuário clique em VER RESPOSTAS, um widget que todos os comentários possuem. Os comentários só podem ser apagados pelas pessoas que fizeram os mesmos. Além disso, o dia e a hora que o comentário foi feito são exibidos em cada comentário.

O botão de like - Esse botão tem a função de adicionar um like a disciplina ou de retirar. É feita a verificação de que se o usuário logado já curtiu ou não a disciplina, sempre que se vizualiza uma disciplina, caso já curta, o botão de DAR LIKE, se transforma em RETIRAR LIKE.

A página de ranking - Também feita a partir do processo de uma div que se torna vizível a partir de uma mudança no style de display, que sai de none e passa para block quando a target está no id da div ranking (CSS). 

Ao clicar no link que diz "Ranking das disciplinas" caso logado, o usuário recebe um alert() dizendo mostrando ranking, a div aparece em cima do conteúdo da página, e o ranking através do número de likes aparece em uma lista.

Caso não esteja logado, o usuário recebe uma mensagem dizendo "você precisa estar logado para ver o ranking" a tela de ranking abre, mas a lista não é carregada então.

javascript.js - Possui todo o código javascript do projeto, incluindo os da página html login, create_accout.
login-style.css - Página de estilo usado pelo create_accout e o login.
style.css página de estilo usada pelo index.html



