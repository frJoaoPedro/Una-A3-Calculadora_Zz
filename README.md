# Calculadora A3

Calculadora web feita em **HTML, CSS e JavaScript puro**, com visual inspirado

Projeto A3 da UC **Matemática Computacional** · Una Contagem.

---

##  Integrantes

| Nome |
|------|
| Carlos Antonio |
| Lucas Eduardo Correia |
| João Pedro Franco |

---

## ✨ Funcionalidades

- Operações básicas: soma `+`, subtração `-`, multiplicação `X` e divisão `÷`
- Números decimais com vírgula (`,`)
- Botão `C` para limpar o visor
- Botão `⌫` para apagar o último caractere
- Botão `=` para calcular o resultado (mostra `Erro` se a conta for inválida)
- Visor bloqueado para digitação manual: tudo é feito pelos botões
- Layout em grade (CSS Grid) tematizado

---

##  Como usar

1. Baixe ou clone a pasta do projeto
2. Abra o arquivo `index.html` em qualquer navegador
3. Clique nos botões para montar a conta e aperte `=`

Não precisa instalar nada nem ter servidor.

---

## 📁 Estrutura

```
calculadora/
├── index.html   # estrutura da página, visor e botões, com o CSS no <style>
├── script.js    # lógica da calculadora
└── README.md    # este arquivo
```

---

## 🧠 Como funciona

| Função | O que faz |
|--------|-----------|
| `adicionar(valor)` | Cola o valor do botão clicado no fim do texto do visor |
| `apagar()` | Remove o último caractere do visor com `.slice(0, -1)` |
| `limpar()` | Deixa o visor vazio |
| `calcular()` | Troca `X` por `*`, `÷` por `/` e `,` por `.`, calcula com `eval()` e mostra o resultado (ou `Erro`, via `try/catch`) |

---

## 🛠️ Tecnologias

- **HTML5**: estrutura
- **CSS3**: estilo, Grid, `skew`, `rotate` e pseudo-elementos (`::before` e `::after`)
- **JavaScript**: lógica e manipulação do DOM

---

## 🔭 Próximos passos

- [ ] Separar os parênteses em dois botões, `(` e `)`
- [ ] Botão `±` para trocar o sinal
- [ ] Calculadora científica: Funções, Matrizes e Análise Combinatória
- [ ] Substituir o `eval()` por um interpretador de expressões próprio
- [ ] Deixar a interface responsiva para celular

---

## 📌 Observações

- Projeto acadêmico, feito para fins de estudo.
- O visual é inspirado em Persona 5, mas é um trabalho feito por fãs, sem fins comerciais.
