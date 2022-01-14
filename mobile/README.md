# Uoli - Mobile

# 👋 Introdução

Neste diretório contém a aplicação mobile desenvolvida para a comunicação com o carrinho.

O app foi desenvolvido com linguagem **Typescript** utilizando a biblioteca **React Native.**

---

# 🚗 Como rodar

Verifique se você possui o ambiente de desenvolvimento necessário [aqui](https://reactnative.dev/docs/environment-setup).

1. Primeiro clone o repositório para sua máquina.

2. Baixe as dependências necessárias, com o Yarn, utilizando o comando:

```bash
yarn
```

3. Rode o projeto em um dispositivo Android utilizando o seguinte comando:

```bash
yarn run android
```

**Dica #01:** Verifique se seu emulador ou dispositivo está conectado utilizando o comando `adb devices`

**Dica #02:** Se estiver utilizando um dispositivo físico, lembre-se: além de conectá-lo com o cabo, é necessário permitir a depuração via USB.

---

# ⚛️ Principais componentes

Nos tópicos abaixo serão colocados alguns detalhes da implementação dos principais componentes do app, assim como bibliotecas utilizadas e lógica de funcionamento.

## 01. Exibição da câmera do carrinho

A exibição do vídeo captado ao vivo da câmera acoplada ao carrinho é feito através de uma **WebView**. 

O código da câmera gera um Access Point em que o dispositivo do usuário deve-se conectar. Com esta conexão estabelecida o usuário pode acessar na URL [`http://192.168.4.1:81/stream`](http://192.168.4.1:81/stream) a transmissão da câmera do carrinho. Você pode entender como a câmera transmite a vídeo para esta URL no repositório do carrinho.

Portanto, no app, o que fazemos é criar uma WebView que exibe esta transmissão. 

A WebView é implementada com a biblioteca `react-native-webview` que pode ser encontrada [aqui](https://github.com/react-native-webview/react-native-webview). A implementação é bem simples, o único atributo necessário para o funcionamento é a definição da URL que deve ser exibida.

O código deste componente pode ser encontrado no diretório `src/components/organisms/camera_display/index.tsx`

## 02. Simulador de joystick

Este componente foi um pouco mais complexo. Tentamos encontrar alguma biblioteca que já implementasse algo parecido mas não encontramos nenhuma que fosse em **Typescript** e tivesse o mesmo comportamento que queríamos.

A solução foi utilizar uma biblioteca de Draggable, que permite a criação de componentes que podem ser arrastados. Com esse componente arrastável, foram colocados limites, para que ele só pudesse ser arrastado por uma região restrita, e toda vez que o usuário soltar o componente ele volta para o ponto inicial, dando este efeito de joystick. 

A biblioteca utilizada foi a `react-native-draggable` que pode ser encontrada [aqui](https://github.com/tongyy/react-native-draggable).

O código deste componente pode ser encontrado no diretório `src/components/organisms/game_pad/index.tsx`

## 03. Captura de tela

A implementação da captura de tela também foi bem simples com a utilização da biblioteca `react-native-view-shot`, que pode ser encontrada [aqui](https://github.com/gre/react-native-view-shot).

O botão chama a função `captureScreen` da biblioteca que captura a tela atual.

---

# 📁 Estrutura de pastas

Aqui está descrito como estamos estruturando as principais pastas do código fonte do projeto. As pastas geradas automaticamente com o `create-react-native-app` não serão descritas neste documento, você pode conhecer elas [aqui](https://medium.com/@menisck/react-native-organizando-o-projeto-20f141d587e4).

Todo o código produzido pelo time se encontra na pasta `src` (*source*), a seguir serão descritas cada uma das pastas dentro desta principal.

1. **Fonts**: Arquivos de fontes do aplicativo

### **Assets**

Nesta pasta ficarão arquivos úteis para a aplicação. Contém a seguinte subpasta:

### **Components**

Um grande objetivo desta maneira de organizar o projeto é reaproveitar código. Tudo que se repete deve ser isolado e somente instanciado onde necessário.

Na pasta ***Components*** teremos todos os componentes do projeto seguindo a estrutura do **Atomic Design.** Você pode encontrar mais sobre [neste livro](https://drive.google.com/file/d/1Ggbgm52L0MQ8UGAmWBlVAD1bPVQjXEOw/view?usp=sharing). Basicamente essa linha de pensamento compara a construção da interface de uma aplicação com a estrutura natural da matéria (átomos, moléculas, organismos, …). Cada um dos componentes do Atomic Design serão especificados na tabela abaixo.


![alt text for screen readers](/mobile/images/table.png "Text to show on mouseover")


Dentro de cada uma das pastas conterão subpastas com os componentes. A estrutura da subpasta será definida no tópico **Componentes**.

### **Screens**

Neste diretório contém as telas do aplicativo. A tela é composta pelos componentes já criados na pasta components.

### **Constants**

Aqui ficam arquivos de definição geral do estilo. Para cada grupo de estilo criar um arquivo novo.

Cada um dos arquivos contém um objeto constante com as definições de estilo. Neste caso temos apenas a definição geral das cores.

---

# 🧩 Componentes

A base e a grande facilidade do React, assim como de outras tecnologias front-end, é uso de componentes. Isolar pequenos trechos de código funcional ajuda na modularização, escalabilidade, reprodutibilidade e testagem da aplicação.

Como citado anteriormente os componentes serão criados baseados no Atomic Design. Cada componente deve ser criado em uma das subpastas do diretório `components`, citado no tópico anterior.

Para cada novo componente deve ser criado uma nova pasta com nome em minúsculo, separado com `_` (underline) caso possua mais de uma palavra.

**Exemplos:** “icon_text_card”, “input“, “circle_button”, “button”

Dentro de cada uma das pastas terão quatro arquivos, explicados abaixo.

![alt text for screen readers](/mobile/images/table2.png "Text to show on mouseover")

A estrutura do componente deve ser feita com componentes funcionais, e não classes, para facilitar a leitura e evitar códigos extensos. A definição básica deve ser parecida com o código abaixo:

````javascript
import React from 'react';

import { View, Text } from 'react-native';



const RegisterMemberScreen: React.FC = () => {
  return (
      <View>
          <Text>Register Member Screen</Text>
      </View>
  );
}

export default RegisterMemberScreen;
