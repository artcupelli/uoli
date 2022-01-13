import axios from "axios";

export class CarControlService {
    baseUrl: string;

    constructor() {
        this.baseUrl = "http://192.168.4.1";
    }

    async goFoward() {

        console.log("FRENTE")
        await axios.get(`${this.baseUrl}/action?go=forward`);

    }

    async goBack() {

        console.log("TRÁS")
        await axios.get(`${this.baseUrl}/action?go=backward`);

    }

    async goLeft() {

        console.log("ESQUERDA")
        await axios.get(`${this.baseUrl}/action?go=left`);

    }

    async goRight() {

        console.log("DIRETA")
        await axios.get(`${this.baseUrl}/action?go=right`);

    }

    async stop() {

        console.log("PARO")
        await axios.get(`${this.baseUrl}/action?go=stop`);

    }

    async toogleLight() {

        await axios.get(`${this.baseUrl}/action?go=l`);

    }

    async message(message: string) {

        await axios.get(`${this.baseUrl}/action?go=M:${message}`);

    }
}