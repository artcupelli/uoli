# Uoli - Arduino

# 👋 Introdução

Esse diretório apresenta a montagem do projeto em arduino

O app foi desenvolvido com linguagem **C** utilizando de algumas bibliotecas disponíveis na internet.

---

# 🚗 Componentes Principais
O carrinho é composto por 3 partes principais:

1. Controlador de motores/rodas
2. Câmera wireless
3. Display LCD

## Controlador de motor
Vamos começar com o controlador de motores.
 ![image](https://http2.mlstatic.com/D_NQ_NP_909088-MLB31066652496_062019-O.webp)
 
 Este componente é chamado de Driver Motor Ponte H e serve para controlar os motores do carrinho.
 Esse módulo trabalho basicamente com 4 portas de saída e 4 portas de entrada. Cada dupla de portas de entrada é resposável por controlar um dos motores, onde colocar um dos pinos em high e o outro em low resultará em um movimento para traz ou para frente.
  ![image]( https://i2.wp.com/randomnerdtutorials.com/wp-content/uploads/2018/05/L298N-label.jpg?w=750&quality=100&strip=all&ssl=1)
Em nosso projeto, estamos apenas fazendo o carro ir para frente, trás, direita e esquerda, sem controle de velocidade. Por isso, as portas ENABLE A e B não estão sendo utilizadas. A energia é conectada na entrada +5v e GND e os motores são conectados nas portas OUT1 e OUT2 (Motor direita) e OUT3 e OUT4 (Motor esquerda). 
**Quanto a programação do módulo, ela é feita juntamente com a Câmera Wireless**
## Câmera Wireless ESP-CAM
A ESP-CAM é um tipo de arduino que já vem equipado com conexão sem fio Wi-Fi e uma câmera, capaz de tirar fotos, gravar vídeos e, o objeto de interesse para o projeto, fazer trasmissão em rede das imagens captadas pela câmera.
  ![image](https://images.tcdn.com.br/img/img_prod/650361/esp32_cam_wifi_bluetooth_com_camera_inclusa_2465_11_20200205161931.jpg)
Toda a montagem da câmera, incluindo código-fonte para streaming e controle dos motores, pode ser encontrada no link abaixo.
https://randomnerdtutorials.com/esp32-cam-car-robot-web-server/
A montagem desse circuito, que integra o Driver do motor e a ESP-CAM pode ser vista abaixo:
  ![image](https://i0.wp.com/randomnerdtutorials.com/wp-content/uploads/2021/01/ESP32-CAM-Remote-Controlled-Robot-Diagram.png?resize=1024%2C780&quality=100&strip=all&ssl=1)
## Display LCD
Por último, e realmente menos importante, temos o Display LCD Tft 2.4 Touch Screen, que em nosso projeto tem a missão apenas deixar o robô mais agradável e amigável.
  ![image](https://http2.mlstatic.com/D_NQ_NP_717788-MLB31359661286_072019-O.webp)
Todavia, enxergamos que há uma infinidade de possibilidades que podem ser atribuídas a esse módulo, visto que poderiamos transmitir expressões, textos, imagens, entre outras coisas diretamente para a tela. Porém, não fizemos nenhuma dessas opções por conta do cronograma do projeto e essa possibilidade só ter sido aberta no fim do projeto, mas recomendamos para próximos projetos um aprovaitamente melhor do dispositivo.
O módulo pode ser acoplado diretamente em um arduino UNO ou MEGA e seu funcionamento é um pouco complexo, mas é possível programá-lo sem tantos problemas com auxílio de alguns tutoriais. 
**Em breve irei descrever mais detalhadamente como usar o componente**
