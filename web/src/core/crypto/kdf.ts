import argon2 from "argon2-browser/dist/argon2-bundled.min.js"

export async function generateKDF(inputPassword:string, inputSalt:Uint8Array): Promise<Uint8Array> {
    const result =  await argon2.hash({
        type: argon2.ArgonType.Argon2id,
        pass: inputPassword,
        salt: inputSalt,
        parallelism: 4,
        mem: 2 ** 16,
        time: 3,
        hashLen: 32
    });
    return result.hash;
}