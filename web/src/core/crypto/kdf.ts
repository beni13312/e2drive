import loadArgon2idWasm from "argon2id";

export async function generateKDF(inputPassword:string, inputSalt:Uint8Array): Promise<Uint8Array> {
    const argon2id = await loadArgon2idWasm();
    //const generatedSalt = crypto.getRandomValues(new Uint8Array(32));

    return argon2id({
        password: new TextEncoder().encode(inputPassword),
        salt: inputSalt,
        parallelism: 4,
        passes: 2,
        memorySize: 2 ** 16,
        tagLength: 32
    });
}