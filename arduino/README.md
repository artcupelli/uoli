# Uoli - Arduino

# 👋 Introdução

Esse diretório apresenta a montagem do projeto em arduino

O app foi desenvolvido com linguagem **C** utilizando de algumas bibliotecas disponíveis na internet.

---

# 🚗 Componentes Principais
O carrinho é composto por 4 componentes principais:

1. Driver Motor de ponte H (Controlador de motores/rodas)
2. ESP32-CAM (Câmera Wireless)
3. Display LCD TFT 2.4 touchscreen shield (Tela/Rosto robô)
4. Arduino Mega

## Controlador de motor
 
 Este componente é chamado de Driver Motor Ponte H e serve para controlar os motores do carrinho.
 Esse módulo trabalho basicamente com 4 portas de saída e 4 portas de entrada. Cada dupla de portas de entrada é resposável por controlar um dos motores, onde colocar um dos pinos em high e o outro em low resultará em um movimento para traz ou para frente.
 
  ![image]( https://i2.wp.com/randomnerdtutorials.com/wp-content/uploads/2018/05/L298N-label.jpg?w=750&quality=100&strip=all&ssl=1)
  
Em nosso projeto, estamos apenas fazendo o carro ir para frente, trás, direita e esquerda, sem controle de velocidade. Por isso, as portas ENABLE A e B não estão sendo utilizadas. A energia é conectada na entrada +5v e GND e os motores são conectados nas portas OUT1 e OUT2 (Motor direita) e OUT3 e OUT4 (Motor esquerda). 
**Quanto a programação do módulo, ela é feita juntamente com o arduino mega

## ESP32-CAM
A ESP32-CAM é um tipo de arduino que já vem equipado com conexão sem fio Wi-Fi e uma câmera, capaz de tirar fotos, gravar vídeos e, o objeto de interesse para o projeto, fazer trasmissão em rede das imagens captadas pela câmera.

  ![image](https://images.tcdn.com.br/img/img_prod/650361/esp32_cam_wifi_bluetooth_com_camera_inclusa_2465_11_20200205161931.jpg)

Em nosso projeto, a câmera é responsável por:
1. Gerar uma rede wi-fi para conexão do usuário
2. Captar e transmitir a imagem na rede criada
3. Receber e enviar as requisições de rede dadas pelo usuário para o Arduino Mega, via conexão Serial.

O autor código consultado para criar o programa carregada na ESP32-CAM foi o Rui Santos e o site com o código original pode ser encontrada no link abaixo.
https://randomnerdtutorials.com/esp32-cam-car-robot-web-server/

O código carregado na ESP32-CAM também pode ser visto abaixo, em seguida, explicaremos as principais partes do código.
```c
/*********
  Rui Santos
  Complete instructions at https://RandomNerdTutorials.com/esp32-cam-projects-ebook/
  
  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*********/

#include "esp_camera.h"
#include <WiFi.h>
#include "esp_timer.h"
#include "img_converters.h"
#include "Arduino.h"
#include "fb_gfx.h"
#include "soc/soc.h"             // disable brownout problems
#include "soc/rtc_cntl_reg.h"    // disable brownout problems
#include "esp_http_server.h"

#define PART_BOUNDARY "123456789000000000000987654321"

#define CAMERA_MODEL_AI_THINKER
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27

#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

// Replace with your network credentials
const char* ssid = "UoLi";
const char* password = "Carrinho";

static const char* _STREAM_CONTENT_TYPE = "multipart/x-mixed-replace;boundary=" PART_BOUNDARY;
static const char* _STREAM_BOUNDARY = "\r\n--" PART_BOUNDARY "\r\n";
static const char* _STREAM_PART = "Content-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n";

httpd_handle_t camera_httpd = NULL;
httpd_handle_t stream_httpd = NULL;
static const char PROGMEM INDEX_HTML[] = R"rawliteral(
<html>
  <head>
    <title>ESP32-CAM Robot</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: Arial; text-align: center; margin:0px auto; background-color: #1b1b1b;}
      table { margin-left: auto; margin-right: auto; }
      td { padding: 8 px; }
      .button {
        background-color: #8969fb;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 18px;
        margin: 6px 3px;
        cursor: pointer;
        width: 100%;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        
      }
      .button::placeholder{
          color: white;
      }
      img {  
        width: 100% ;
        height: auto ; 
        border: 1px solid #8969fb;
        border-radius: 10px;
        margin-bottom: 100px;
        margin-right: 50px;
      }
    </style>
  </head>
  <body>
    <img src="" id="photo" >
    <table>
      <tr><td colspan="3" align="center"><button class="button" ontouchstart="toggleCheckbox('forward');" ontouchend="toggleCheckbox('stop');" >Forward</button></td></tr>
      <tr><td align="center"><button class="button" ontouchstart="toggleCheckbox('left');" ontouchend="toggleCheckbox('stop');">Left</button></td><td align="center"><button class="button" ontouchstart="toggleCheckbox('stop');">Stop</button></td><td align="center"><button class="button" ontouchstart="toggleCheckbox('right');"  ontouchend="toggleCheckbox('stop');">Right</button></td></tr>
      <tr><td colspan="3" align="center"><button class="button" ontouchstart="toggleCheckbox('backward');" ontouchend="toggleCheckbox('stop');">Backward</button></td></tr>                   
    <tr><td colspan="2" align="center"><button class="button" ontouchstart="toggleCheckbox('l');">Light</button></td><td colspan="1" align="center"><button class="button" ontouchstart="toggleCheckbox('M'+document.getElementById('texto').value);">Send</button></td></tr>
    <tr><td colspan="3" align="center"><input id="texto" class="button" placeholder="Mensagem"></td></tr>
    </table>
    
   <script>
   function toggleCheckbox(x) {
     var xhr = new XMLHttpRequest();
     xhr.open("GET", "/action?go=" + x, true);
     xhr.send();
   }
   window.onload = document.getElementById("photo").src = window.location.href.slice(0, -1) + ":81/stream";
  </script>
  </body>
</html>
)rawliteral";

static esp_err_t index_handler(httpd_req_t *req){
  httpd_resp_set_type(req, "text/html");
  return httpd_resp_send(req, (const char *)INDEX_HTML, strlen(INDEX_HTML));
}

static esp_err_t stream_handler(httpd_req_t *req){
  camera_fb_t * fb = NULL;
  esp_err_t res = ESP_OK;
  size_t _jpg_buf_len = 0;
  uint8_t * _jpg_buf = NULL;
  char * part_buf[64];

  res = httpd_resp_set_type(req, _STREAM_CONTENT_TYPE);
  if(res != ESP_OK){
    return res;
  }

  while(true){
    fb = esp_camera_fb_get();
    if (!fb) {
      res = ESP_FAIL;
    } else {
      if(fb->width > 400){
        if(fb->format != PIXFORMAT_JPEG){
          bool jpeg_converted = frame2jpg(fb, 80, &_jpg_buf, &_jpg_buf_len);
          esp_camera_fb_return(fb);
          fb = NULL;
          if(!jpeg_converted){
            res = ESP_FAIL;
          }
        } else {
          _jpg_buf_len = fb->len;
          _jpg_buf = fb->buf;
        }
      }
    }
    if(res == ESP_OK){
      size_t hlen = snprintf((char *)part_buf, 64, _STREAM_PART, _jpg_buf_len);
      res = httpd_resp_send_chunk(req, (const char *)part_buf, hlen);
    }
    if(res == ESP_OK){
      res = httpd_resp_send_chunk(req, (const char *)_jpg_buf, _jpg_buf_len);
    }
    if(res == ESP_OK){
      res = httpd_resp_send_chunk(req, _STREAM_BOUNDARY, strlen(_STREAM_BOUNDARY));
    }
    if(fb){
      esp_camera_fb_return(fb);
      fb = NULL;
      _jpg_buf = NULL;
    } else if(_jpg_buf){
      free(_jpg_buf);
      _jpg_buf = NULL;
    }
    if(res != ESP_OK){
      break;
    }
    //Serial.printf("MJPG: %uB\n",(uint32_t)(_jpg_buf_len));
  }
  return res;
}

static esp_err_t cmd_handler(httpd_req_t *req){
  char*  buf;
  size_t buf_len;
  char variable[200] = {0,};
  
  buf_len = httpd_req_get_url_query_len(req) + 1;
  if (buf_len > 1) {
    buf = (char*)malloc(buf_len);
    if(!buf){
      httpd_resp_send_500(req);
      return ESP_FAIL;
    }
    if (httpd_req_get_url_query_str(req, buf, buf_len) == ESP_OK) {
      if (httpd_query_key_value(buf, "go", variable, sizeof(variable)) == ESP_OK) {
      } else {
        free(buf);
        httpd_resp_send_404(req);
        return ESP_FAIL;
      }
    } else {
      free(buf);
      httpd_resp_send_404(req);
      return ESP_FAIL;
    }
    free(buf);
  } else {
    httpd_resp_send_404(req);
    return ESP_FAIL;
  }

  sensor_t * s = esp_camera_sensor_get();

  Serial.println(variable);
  
 

  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  return httpd_resp_send(req, NULL, 0);
}

void startCameraServer(){
  httpd_config_t config = HTTPD_DEFAULT_CONFIG();
  config.server_port = 80;
  httpd_uri_t index_uri = {
    .uri       = "/",
    .method    = HTTP_GET,
    .handler   = index_handler,
    .user_ctx  = NULL
  };

  httpd_uri_t cmd_uri = {
    .uri       = "/action",
    .method    = HTTP_GET,
    .handler   = cmd_handler,
    .user_ctx  = NULL
  };
  httpd_uri_t stream_uri = {
    .uri       = "/stream",
    .method    = HTTP_GET,
    .handler   = stream_handler,
    .user_ctx  = NULL
  };
  if (httpd_start(&camera_httpd, &config) == ESP_OK) {
    httpd_register_uri_handler(camera_httpd, &index_uri);
    httpd_register_uri_handler(camera_httpd, &cmd_uri);
  }
  config.server_port += 1;
  config.ctrl_port += 1;
  if (httpd_start(&stream_httpd, &config) == ESP_OK) {
    httpd_register_uri_handler(stream_httpd, &stream_uri);
  }
}

void setup() {
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); //disable brownout detector
  
 
  
  Serial.begin(115200);
  Serial.setDebugOutput(false);
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG; 
  
  if(psramFound()){
    config.frame_size = FRAMESIZE_VGA;
    config.jpeg_quality = 10;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_SVGA;
    config.jpeg_quality = 12;
    config.fb_count = 1;
  }
  
  // Camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    return;
  }
 
  // Wi-Fi connection
  WiFi.softAP(ssid, password);
  // Start streaming web server
  startCameraServer();
}

void loop() {
  
}
```

A primeira parte do código diz respeito a configuração inicial da câmera, onde são incluídas as bibliotecas necessárias para o funcionamento do componente e também algumas definições de portas. Atenção: A depender do projeto, a definição das portas pode mudar, sendo que a definição atual é para projetos CAMERA_MODEL_AI_THINKER.

````c
const char* ssid = "UoLi";
const char* password = "Carrinho";
````
Essa parte do código se refere às credenciais do Wifi que será gerado pelo Carrinho.
Logo em seguida é montado o html da página que será criada no IP da câmera. (Como em nosso projeto a ESP-32 irá gerar o wifi, o IP será sempre estático em 192.168.4.1)
Note que na página, incluímos uma imagem (que é a visualização da câmera) e uma série de botões, que fazem requisições GET para o servidor da ESP32-CAM no caminho IP/action?go=
É baseado nisso que fizemos as requisições também no aplicativo, sendo que o mesmo segue a mesma lógica da requisição GET.

````html
static const char PROGMEM INDEX_HTML[] = R"rawliteral(
<html>
  <head>
    <title>ESP32-CAM Robot</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: Arial; text-align: center; margin:0px auto; padding-top: 30px; background-color: #1b1b1b;}
      table { margin-left: auto; margin-right: auto; }
      td { padding: 8 px; }
      .button {
        background-color: #8969fb;
        border: none;
        color: white;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 18px;
        margin: 6px 3px;
        cursor: pointer;
        width: 100%;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        
      }
      .button::placeholder{
          color: white;
      }
      img {  width: auto ;
        max-width: 100% ;
        height: auto ; 
      }
    </style>
  </head>
  <body>
    <img src="" id="photo" >
    
    <table>
      <tr><td colspan="3" align="center"><button class="button" ontouchstart="toggleCheckbox('forward');" ontouchend="toggleCheckbox('stop');" >Forward</button></td></tr>
      <tr><td align="center"><button class="button" ontouchstart="toggleCheckbox('left');" ontouchend="toggleCheckbox('stop');">Left</button></td><td align="center"><button class="button" ontouchstart="toggleCheckbox('stop');">Stop</button></td><td align="center"><button class="button" ontouchstart="toggleCheckbox('right');"  ontouchend="toggleCheckbox('stop');">Right</button></td></tr>
      <tr><td colspan="3" align="center"><button class="button" ontouchstart="toggleCheckbox('backward');" ontouchend="toggleCheckbox('stop');">Backward</button></td></tr>                   
    <tr><td colspan="2" align="center"><button class="button" ontouchstart="toggleCheckbox('l');">Light</button></td><td colspan="1" align="center"><button class="button" ontouchstart="toggleCheckbox('M'+document.getElementById('texto').value);">Send</button></td></tr>
    <tr><td colspan="3" align="center"><input id="texto" class="button" placeholder="Mensagem"></td></tr>
    </table>
    
   <script>
   function toggleCheckbox(x) {
     var xhr = new XMLHttpRequest();
     xhr.open("GET", "/action?go=" + x, true);
     xhr.send();
   }
   window.onload = document.getElementById("photo").src = window.location.href.slice(0, -1) + ":81/stream";
  </script>
  </body>
</html>
)rawliteral";
````
Já a função abaixo é responsável por receber as requisições de rede. Pode-se ajustar o tamanho da variable, que diz respeito ao tamanho máximo da mensagem que pode ser recebeda. Nessa caso, se uma requisição tiver mais que 200 caracteres. 
Essas requisições serão mensagens enviadas do usuário para a câmera, que podem fazer os mais diversos efeitos. No projeto, a câmera irá receber, por exemplo, comandos de direção (forward, backward, left and right), mensagem para serem exibidas na tela do dispositivo e também comando para ligar/desligar a lanterna.
Para enviar as mensagens por comunicação serial, a câmera faz simplesmente println da variable recebida, o que será recebido pelo Mega, processado e executado. Os detalhes da conexão serial entre os arduinos serão colocados mais para frente.

````c
static esp_err_t cmd_handler(httpd_req_t *req){
  char*  buf;
  size_t buf_len;
  char variable[200] = {0,};
  
  buf_len = httpd_req_get_url_query_len(req) + 1;
  if (buf_len > 1) {
    buf = (char*)malloc(buf_len);
    if(!buf){
      httpd_resp_send_500(req);
      return ESP_FAIL;
    }
    if (httpd_req_get_url_query_str(req, buf, buf_len) == ESP_OK) {
      if (httpd_query_key_value(buf, "go", variable, sizeof(variable)) == ESP_OK) {
      } else {
        free(buf);
        httpd_resp_send_404(req);
        return ESP_FAIL;
      }
    } else {
      free(buf);
      httpd_resp_send_404(req);
      return ESP_FAIL;
    }
    free(buf);
  } else {
    httpd_resp_send_404(req);
    return ESP_FAIL;
  }

  sensor_t * s = esp_camera_sensor_get();
  
  //ENVIANDO A REQUISIÇÃO RECEBIDA DIRETAMENTE PARA O ARDUINO MEGA VIA CONEXÃO SERIAL
  Serial.println(variable);
  
 

  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  return httpd_resp_send(req, NULL, 0);
}
````

Por fim, dentro da função setup, além de ter mais algumas configurações da câmera, temos também a instância da comunicação serial e também a inicialização do ponto de acesso Wifi, onde é passado o ssid e password da rede, e também o servidor da câmera.

````c
// Wi-Fi connection
  WiFi.softAP(ssid, password);
  // Start streaming web server
  startCameraServer();
````

### Comunicação Serial Esp32-CAM 
Como a câmera é independente, sua ligação basicamente consiste em ligar os pinos GND e 5V. Todavia, para fazer a comunicação serial entre a câmera e o Arduino Mega, foi necessário fazer uma ligação dos Seriais da câmera com os do arduino Mega. 
A imagem abaixo mostra os pinos da ESP32-CAM, onde pode-se observar que os pinos GPIO 1 e 3 são, respectivamente, os pinos TX e RX. Assim, quando a câmera faz comunicação serial, como println(), os dados serão transmitidos por essas portas. 

  ![image](https://lobodarobotica.com/blog/wp-content/uploads/2020/08/ESP32-CAM-pinout-new.png)
  
Já o arduino Mega possui mais de um conjunto de portas seriais, o que torna possível o projeto. Isso porque, no Mega, o primeiro conjunto de portas seriais estará sendo usado pela display LCD. Assim, não bastaria um arduino Uno, por exemplo, pois este não conseguiria controlar o display e receber mensagens da ESP32-CAM.

A montagem da circuito que possibilita essa comunicação pode ser vista abaixo. Destaca-se que os pinos TX e RX sempre devem ficar invertidos entre si, ou seja, pino TX conectado com RX e o contrário. 

  ![image](https://i.ibb.co/pwQXzxv/ESP-MEGA.png)
  
## Display LCD
Por último, e realmente menos importante, temos o Display LCD TFT 2.4 Touch Screen, que em nosso projeto tem a missão apenas deixar o robô mais agradável e amigável.

  ![image](https://http2.mlstatic.com/D_NQ_NP_717788-MLB31359661286_072019-O.webp)
  
O componente foi desenvolvido para ser encaixado diretamente na placa no arduíno, por isso, sua ligação é facilitada. Veja abaixo como deve ser feita a ligação. Recomenda-se fortemente pesquisas adicionais.

  ![image](https://i.ibb.co/19CVYmL/TFT-MEGA.png)
  
Após o encaixe, é possível programar a display a partir do arduino. 
A seguinte referência mostra como funciona toda a programação do módulo utilizando-se da biblioteca MCUFRIEND_kbv, que possibilita manipular diversos displays distintos, incluindo o modelo usado no projeto.
https://portal.vidadesilicio.com.br/primeiros-passos-shield-lcd-tft-24-touchscreen/

O funcionamento é muito simples. Temos algumas funções que podem ser usadas, como drawFastHLine(), setTextColor, setTextSize, fillScreen(), etc.
Para começar, precisa-se fazer o include da biblioteca e instanciar o objeto.
````c
#include <MCUFRIEND_kbv.h>
MCUFRIEND_kbv tft;
````
Depois, basta usar as funções do objeto tft. Abaixo um exemplo simples de uso:

````c
#include <MCUFRIEND_kbv.h>
MCUFRIEND_kbv tft;

void setup() {
  Serial.begin(115200);
  uint16_t ID = tft.readID();
  //assim pode-se descobrir qual o driver do display
  Serial.print("Identificador do display: ");
  Serial.println(ID, HEX);
  
  //iniciando serial do display
  tft.begin(ID);
  //girando a tela no sentido correto
  tft.setRotation(3);
  //pintando tudo de preto
  tft.fillScreen(TFT_BLACK);
  //trocando cor do texto para roxo e tamanho para 10 (isso é bem grande para a tela)
  tft.setTextColor(ROXO);
  tft.setTextSize(10);
  //ajustando o cursor para escrever o texto centralizado
  tft.setCursor(20, 90);
  //escrevendo texto de boas vindas
  tft.print("UoLi!");
  delay(3000);
}
````
Vamos explicar agora algumas das decisões de projeto e também explicar as funções criadas a partir disso.

### Divisão da tela
A resolução do display TFT é de 320x240. Para facilitar o trabalho com a tela, simplificamos a proporção da mesma por 16
![image](https://i.ibb.co/ng1zf05/Display-divis-o-1.png)
Assim, sempre trabalhamos com números menores e facilitamos a lógica para construir imagens. 
Fizemos uma função para converter as proporções. Como sempre cada divisão tem 16px, então basta simplesmente multiplicar a proporção desejada por 16 e teremos o valor real da posição do pixel. 
```c
int getPosi(int prop){
  return 16*prop;
}
```

### Desenhando um retângulo
A biblioteca utilizada não tem muitas funções nativas, assim, fez-se necessário criar algumas delas para facilitar o trabalho.
Existem duas funções criadas para desenhar um retângulo na tela: retangulo() e retanguloDelay().
Basicamente as duas fazem a mesma função, ambas recebem como parâmetro a posição x e y que deseja-se começar a desenhar a forma, a altura e largura que a mesma deve ter e a sua cor. A diferença é que a função retanguloDelay irá desenhar o retângulo de modo que cada linha horizontal renderizada para criar a figura irá demorar x tempo de delay para desenhar a próxima, assim o retângulo é formado com uma espécie de animação (a função recebe como último parâmetro o speed, que é o valor do delay a ser aplicado entre as linhas).
```c
void retangulo(int x, int y, int altura, int largura, uint16_t cor){
  for(int i = y; i<y+altura; i++){
     tft.drawFastHLine(x, i, largura, cor);
  }
}

void retanguloDelay(int x, int y, int altura, int largura, uint16_t cor, int speed){
  for(int i = y; i<y+altura; i++){
     tft.drawFastHLine(x, i, largura, cor);
     delay(speed);
  }
}
```

### Desenhando os olhos
Para desenhar os olhos, criamos uma função predeterminada para essa tarefa. Nela, basicamente é colocado um retângulo branco e no seu centro um outro retângulo menor com a cor do olho do robo (definida no inicio do código). Para a função é necessário passar apenas a posição x do olho, assim, para criar os dois olhos é necessário chamar a função duas vezes e indicar as posições de cada um.
````c
void olho(int x){
  for(int i = getPosi(2); i<getPosi(7); i++){
    tft.drawFastHLine(getPosi(x), i, 80, TFT_WHITE);
  }
  for(int i = getPosi(3)+10; i<getPosi(6)-10; i++){
    tft.drawFastHLine(getPosi(x)+25+olhoDir, i, 30, OLHO);
  }
  
}
````

### Construindo o rosto
Para fazer o rosto do robo, também fizemos uma função, onde a tela é preenchida de preto (para limpar o conteúdo) depois uma série de pequenos retângulos são colocados lado a lado, onde a posição do eixo y é alterada para dar a impressão de um sorriso/linha curva para o desenho. Depois é adicionado os dois olhos nas posições 2 e 13.
````c
void makeFace(){
  tft.fillScreen(TFT_BLACK);
  retangulo(getPosi(2), getPosi(10), getPosi(1), getPosi(2), TFT_WHITE);
  retangulo(getPosi(4), getPosi(10)+10, getPosi(1), getPosi(2), TFT_WHITE);
  retangulo(getPosi(6), getPosi(10)+20, getPosi(1), getPosi(2), TFT_WHITE);
  retangulo(getPosi(8), getPosi(10)+30, getPosi(1), getPosi(2), TFT_WHITE);
  retangulo(getPosi(10), getPosi(10)+30, getPosi(1), getPosi(2), TFT_WHITE);
  retangulo(getPosi(12), getPosi(10)+20, getPosi(1), getPosi(2), TFT_WHITE);
  retangulo(getPosi(14), getPosi(10)+10, getPosi(1), getPosi(2), TFT_WHITE);
  retangulo(getPosi(16), getPosi(10), getPosi(1), getPosi(2), TFT_WHITE);
  //320 x 240 
  olho(2);
  olho(13);
}
````

E essas são as funções desenvolvidas para a parte gráfica do processamento do Arduino Mega. Resta agora mostrar o funcionamento completo  do mesmo, que incluir controlar os motores, receber mensagens da câmera e, é claro, controlar as animações do display. 

## Arduino Mega
