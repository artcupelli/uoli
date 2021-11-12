import axios from "axios";

export class CarControlService {
    baseUrl: string;

    constructor() {
        this.baseUrl = "http://192.168.4.1";
    }

    async goFoward() {

        await axios.get(`${this.baseUrl}/action?go=forward`);

    }

    async goBack() {

        await axios.get(`${this.baseUrl}/action?go=backward`);

    }

    async goLeft() {

        await axios.get(`${this.baseUrl}/action?go=left`);

    }

    async goRight() {

        await axios.get(`${this.baseUrl}/action?go=right`);

    }

    async stop() {

        await axios.get(`${this.baseUrl}/action?go=stop`);

    }
}