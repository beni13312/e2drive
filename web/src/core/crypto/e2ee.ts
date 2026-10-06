export default class E2EE{
    private key:Uint8Array;

    constructor(inputKey:Uint8Array){
        this.key = inputKey;
    }
    public static async new(inputKey:Uint8Array){
        const hashedKey = await crypto.subtle.digest("sha-256", inputKey.buffer as ArrayBuffer);
        return new E2EE(new Uint8Array(hashedKey));

    }

    public async encrypt(inputData:Uint8Array){
        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            this.key.buffer as ArrayBuffer,
            {name: "aes-gcm"},
            false,
            ["encrypt"]
            );

        const generatedIV = crypto.getRandomValues(new Uint8Array(12));

        const encryptData = new Uint8Array(await crypto.subtle.encrypt(
            {name: "aes-gcm", iv: generatedIV},
            cryptoKey,
            inputData.buffer as ArrayBuffer
        ));

        const buffer = new Uint8Array(generatedIV.length + encryptData.length);
        buffer.set(generatedIV, 0);
        buffer.set(encryptData, 12);

        return buffer

    }

    public async decrypt(inputData:Uint8Array){

        const inputIV = inputData.buffer.slice(0,12);
        const encryptedData = inputData.buffer.slice(12);

        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            this.key.buffer as ArrayBuffer,
            {name: "aes-gcm"},
            false,
            ["encrypt"]
        );

        return new Uint8Array(await crypto.subtle.decrypt(
            {name: "aes-gcm", iv: inputIV as ArrayBuffer},
            cryptoKey,
            encryptedData as ArrayBuffer
        ))
    }

}

