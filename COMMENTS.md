# Decisões

## Criar dataset para autocomplete sinteticamente com o LLama-3 e Groq, e ir agregando a cada pesquisa. 

**Motivação:** procurei por algum tempo por datasets abertos de queries de search, todos os resultados que encontrei foram em inglês. A ideia é que o dataset seja populado à medida que as buscas são feitas, mas para não começar com uma base vazia vou popular algumas buscas iniciais com LLM's. 

Ao pesquisar sobre as ferramentas de autocomplete também verifiquei que a chance de uma pessoa fazer uma pesquisa que já fez recentemente é alta, então toda sugestão agregada é agregada com maior 'prioridade'.

Exemplo de incorporação de sugestão:

![Antes da sugestao](https://prnt.sc/R2ica9Q018nv)

Ao clicar no botão "BUSCAR" a sugestão é registrada.

![Depois da sugestao](https://prnt.sc/lniZ6LTYr6sU)


## Usar material-ui para os inputs do front-end

**Motivação:** além de serem bonitas as animações de seus componentes, o material-ui contém a opção de autocomplete com negrito para o input de texto, o que é pedido no desafio.
Embora o autocomplete não tenha funcionado sem a alteração personalizada dos botões, as animações e estilos foram pontos positivos de seu uso.

## Usar Python e strawberry no backend

**Motivação:** Como Python é minha linguagem de preferência, optei por utilizá-la no desenvolvimento do backend. Busquei realizar a comunicação com o GraphQL pelo graphene primeiro, mas por porblemas de incompatiblidade troquei para a bilbioteca strawberry.

## Remoção de case-sensitivity e acentuação das sugestões

**Motivação:** Muitas vezes o usuário pode digitar a query com alguma letra maiúscula por engano, ou não utilizar acentuação. Para minimizar as inconveniências que isso poderia trazer ao resultado do autocomplete, na hora das sugestões ele faz os tratamentos adequados para ignorar isso.

## Usar useLazyQuery Hook do Apollo no front-end.

**Motivação:** O hook utilizado por padrão em useQuery faz inúmeras requisições ao backend, salvo as que têm em cache. Como nosso sistema só deve fazer requisições à medida que o usuário interage com a página (digita a query ou seleciona uma sugestão) o hook mais adequado é o useLazyQuery. 

Além disso, sempre que uma sugestão é adicionada (como pode ser verificado à seguir) é limpado o cache, pois o resultado para queries anteriores pode ter mudado em relação ao resultado salvo em cache.

## Usar mutação para adicionar sugestão.

Se um usuário buscar por algo que ainda não foi definido como uma possível sugestão, o front-end envia uma mutação por graphQL ao backend para adicionar essa sugestão na lista. 

**Motivação:** Atualizar as possíveis buscas à medida que o público utiliza o sistema, e para editar a base geralmente é utilizada a mutação em GraphQL. Basta verificar o primeiro parágrafo sobre mutações no [site do GraphQL](https://graphql.org/graphql-js/mutations-and-input-types/)

**Problema com implementação atual:** A implementação atual foi apenas para teste da funcionalidade, em uma situação real é válido utilizar outra estrutura de dados para esse caso, que utilize a frequência da pesquisa em consideração. Ela pode também armazenar as pesquisas feitas pelos próprios usuários, uma vez que procurar novamente pela mesma query é um comportamento esperado.

## Substituição de lista para Trie

**Motivação:** Devemos garantir a escalabilidade de várias buscas sendo armazenadas.

Vamos utilizar a estrutura de dados Trie, que é uma árvore onde cada nó é representado por um caractere e um valor, que determina se o nó é final de alguma busca já realizada ou não. Isso garante melhor escalabilidade (em termos de velocidade e armazenamento) das sugestões.

Além disso, adicionando novos nós no início da lista de filhos proporciona com que buscas antigas tenham alta prioridade, mas não sejam necessariamente a primeira, evitando a influência de "ataques" a esse algoritmo, onde um usuário mal intencionado faz várias buscas com strings sem sentido.

# Log

Aqui descreverei etapa por etapa do que está sendo desenvolvido no projeto, à medida que cada etapa ocorre. 

## Esboço da solução

Front-end em React com caixa de input text, envia requisição para o GraphQL (ainda não sei como funciona) a cada mudança no input (sempre que o usuário digita algum caractere).

GraphQL manda requisição com texto até então escrito pelo usuário para o backend. Este usa o texto até então escrito para criar as sugestões e as devolve pelo GraphQL ao front-end. 

## Entender como fazer o autocomplete

Procurei por algumas fontes de como fazer o autocomplete. No início me deparei com algumas fontes pagas, depois encontrei um vídeo da Google mostrando que eles usam as buscas já executadas por outros usuários no Google Search para realizar essa recomendação. Portanto, fui em busca de datasets de dados sobre as buscas realizadas. 

Não encontrei nenhum dataset pronto, acho que gastarei muito tempo procurando por um, tenho a ideia de gerar um sinteticamente com o llama3 pelo Groq, e a ideia será popular à medida com que cada busca é feita.

## Criar o frontend com ReactJs

Criando o frontend com ReactJs tentei ser fiel ao esboço enviado no prompt do desafio. Criei o projeto com npx create e as entradas de texto e o botão com material-ui. Optei por utilizar material-ui porque além de serem bonitas as animações de seus componentes, ele contém a opção de autocomplete com negrito para o input de texto, o que é exatamente o que é pedido. 

Dessa forma ele pode ajudar bastante com a conclusão do projeto. Ja optei por utilizar logo de início as medidas relativas para os conteineres do css, com o intuito de já ter uma página responsiva logo de início. O próximo passo agora é entender como o GraphQL funciona e entender como fazer requisições à ele pelo React.

## Entender como funciona o GraphQL

Em primeiro momento, optei por procurar um vídeo que explicasse como funciona o graphQL, mas achei um tutorial muito básico. Procurei então um tutorial mais direto ao ponto, em como utilizar o GraphQL em React e encontrei o seguinte [vídeo](https://www.youtube.com/watch?v=YyUWW04HwKY), que é um pouco lento, e não mostra exatamente como utilizá-lo, mas mostra um pouco de como utilizar o GraphQL em React com o Apollo. Com isso, idealizei que para a solução funcionar, deveria ser feita uma query ao backend com o campo de input mudando, indicando os caracteres já digitados pelo usuário. Parti então para o backend.

## Entender como comunicar com o backend pelo GraphQL

Essa parte foi muito reveladora para mim, pois até então não tive a oportunidade de criar uma solução com backend e front-end se comunicando. 

No enunciado do desafio, é citado que o sistema deve pode ter o backend usando a linguagem de programação de minha preferência. Como no meu caso, a linguagem de programação que mais domino é o Python, busquei por ferramentas para realizar a comunicação entre o backend em Python e o GraphQL que receberia a query do Frontend em React. 

Em primeira instância, tentei utilizar o graphene com o flask, mas estava tendo muitos problemas com a incompatibilidade das versões das dependências dessas bibliotecas. Com isso, optei por utilizar a biblioteca strawberry com Flask, o que foi suficiente para subir o backend e receber a query no frontend. 

Em primeiro momento para comunicar o frontend com o backend defini um hook useQuery `getMatches` que deve usar a query como input de texto para o backend devolver no máximo 

## Implementação front-end das sugestões

Utilizou-se a propriedade do `y-overflow` no css para utilizar o scroll, e definiu-se uma div do tamanho de 10 sugestões para seguir o que foi pedido no enunciado. Para negritar as partes, utiliza-se o tamanho da query até então, e se separam as sugestões em 2 partes: A parte já escrita e a que não foi. Com formatação condicional é possível destacar a parte já escrita, que foi inspirada pelo código fonte do material-ui, mas não foi capaz de implementá-lo diretamente. 

## Usar useLazyQuery Hook do Apollo no front-end.

O hook utilizado por padrão em useQuery faz inúmeras requisições ao backend, salvo as que têm em cache. Como nosso sistema só deve fazer requisições à medida que o usuário interage com a página (digita a query ou seleciona uma sugestão) o hook mais adequado é o useLazyQuery. 

## Adição da base inicial de sugestões

Para criar a base de início utilizei o modelo LLama3-70b pelo Groq com o Google Colab para criar 100 possíveis sugestões. Isso foi possível utilizando um prompt few-shot, cujos exemplos consegui de sugestões que verifiquei na ferramenta de busca do site Jusbrasil. Com as 100 sugestões criadas sinteticamente, utilizei Regex para salvá-las em um json por um dicionário com uma lista de 'buscas'.

Além disso, repeti o processo para os "100 termos mais comuns da área do direito", adicionando cada um desses termos e criando 3 novas sugestões relacionadas a cada um deles. Com isso, totalizamos 500 sugestões iniciais.

## Mutação para adicionar sugestões

Foi criado um Hook de mutação em GraphQL, por sugestão do próprio site, para poder adicionar sugestões à base de dados. Essas sugestões são o texto que está digitado no campo de busca antes de o usuário clicar no botão "BUSCAR". Essa sugestão é adicionada ao início da lista, o que configura maior prioridade de recomendação para sugestões mais recentes. 

Quando se adiciona a sugestão também é limpo o cache do Apollo. Isso é feito pois o cache tem o resultado para queries anteriores armazenado, mas como alguns desses resultados podem ter sido alterados ao introduzir uma nova sugestão à lista, a requisição deve ser feita novamente, e não só utilizada a que já está salva (por estar desatualizada).

## Dockerização do projeto

A dockerização foi feita utilizando dois Dockerfiles: um para o backend e um para o frontend, e com o docker-compose foi possível gerar um container com as dependências do proejeto. 

Como pelo enunciado o código deve poder ser executado em Ubuntu ou MAC OS X, e não utilizo nenhum deles em meu computador, optei por instalar o Ubuntu 20 pela ferramenta WSL do windows, que permite utilizar um subsistema Linux no Windows. Como não tive problemas para rodar `docker-compose up --build` em nenhum dos dois sistemas, acredito que não devam haver problemas na execução.

## Substituição de lista para Trie

Armazenar uma lista com todas as strings já procuradas no Jusbrasil não é uma ideia escalável. Para tanto devemos:

1 - Garantir que a estrutura de dados se comporte melhor que uma lista de strings para armazenar os dados

2 - O algoritmo de busca de sugestões seja mais rápido que percorrer uma lista inteira de sugestões e uma a uma comparando as strings.

Para tanto vamos utilizar a estrutura de dados Trie, que é uma árvore onde cada nó é representado por um caractere e um valor, que determina se o nó é final de alguma busca já realizada ou não.

Dessa forma, a busca é muito mais rápida e a estrutura é muito mais amigável para armazenar sugestões, uma vez que o espaço que seria gasto para armazenar o prefixo de uma sugestão não cresce conforme novas buscas. 

