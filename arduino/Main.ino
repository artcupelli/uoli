

// Definindo as credencias da rede (neste caso Wi-Fi)
const char* name = "caverna do batman";
const char* password = "churrasqueiraeletrica";


void setup() {
  Motor motor([14, 15, 13, 12);

}

void loop() {
  // put your main code here, to run repeatedly:

}

class Motor{
    private:
        int[] portsInESPCAM;

    public:
        Motor(int[] ports) {
            this->portsInESPCAM = ports;
        }
}