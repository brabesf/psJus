# Log

Aqui descreverei etapa por etapa do que está sendo desenvolvido no projeto, à medida que cada etapa ocorre. 

## Esboço da solução

Front-end em React com caixa de input text, envia requisição para o GraphQL (ainda não sei como funciona) a cada mudança no input (sempre que o usuário digita algum caractere).

GraphQL manda requisição com texto até então escrito pelo usuário para o back-end. Este usa o texto até então escrito para criar as sugestões e as devolve pelo GraphQL ao front-end. 

## Entender como fazer o autocomplete

Procurei por algumas fontes de como fazer o autocomplete. No início me deparei com algumas fontes pagas, depois encontrei um vídeo da Google mostrando que eles usam as buscas já executadas por outros usuários no Google Search para realizar essa recomendação. Portanto, fui em busca de datasets de dados sobre as buscas realizadas. Não encontrei nenhum dataset pronto, acho que gastarei muito tempo procurando por um, tenho a ideia de gerar um sinteticamente com o llama3 pelo Groq, e a ideia será popular à medida com que cada busca é feita.

## Criar o frontend com ReactJs


# Decisões

## Criar dataset para autocomplete sinteticamente com o LLama-3 e Groq. 

**Motivação:** procurei por algum tempo por datasets abertos de queries de search, todos os resultados que encontrei foram em inglês. A ideia é que o dataset seja populado à medida que as buscas são feitas, mas para não começar com uma base vazia vou popular algumas buscas iniciais com LLM's. 