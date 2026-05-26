import google.generativeai as genai

# Aqui você coloca a chave que você gerou entre as aspas
CHAVE_API = "AIzaSyDV8f0SyYh_9m83KpWYFmk1kMHCfRc9FwE"

# 1. Configura a biblioteca com a sua chave
genai.configure(api_key=AIzaSyDV8f0SyYh_9m83KpWYFmk1kMHCfRc9FwE)

# 2. Escolhe o modelo (o "cérebro" que você quer usar)
# O 'gemini-flash-latest' é ótimo porque é rápido e mapeia para a versão mais recente
model = genai.GenerativeModel('gemini-flash-latest')

# 3. Faz a pergunta
pergunta = "Explique como funciona um buraco negro para uma criança de 5 anos."
resposta = model.generate_content(pergunta)

# 4. Exibe a resposta na tela
print(resposta.text)