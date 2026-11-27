import Config from "../config/config.js";
import path from "node:path";
import {FileHandle, open, mkdir, stat} from "node:fs/promises";

export default class Filesystem {
  private file: FileHandle | null = null;

  public async open(filepath:string, operation:string){
    const validatedPath = this.validatePath(filepath);
    this.file = await open(validatedPath, operation);
    return this.file;
  }

  public async read(length:number, position:number = 0){
    if(!this.file) throw new Error("file is not open");
      const buffer:Uint8Array = new Uint8Array(length);
      const {bytesRead} = await this.file?.read(buffer, 0, length, position);
      return buffer.subarray(0, bytesRead);
  }

  public async write(bytes:Uint8Array){
    if(!this.file) throw new Error("file is not open");
    return this.file.write(bytes);
  }

  public async close(){
    if(!this.file) throw new Error("file is not open");
    await this.file.close();
    this.file = null;
  }
  public async isExists(filepath:string){
    const validatedPath = this.validatePath(filepath);
    try{
      const stats = await stat(validatedPath);
      return stats.isDirectory() || stats.isFile();
    }catch (error){
      return false;
    }
  }

  public async mkdir(filepath:string){
    const validatedPath = this.validatePath(filepath);
    await mkdir(validatedPath);

  }
  private validatePath(requestedPath: string){
    const root = path.resolve(Config.DATA_STORAGE);
    const target = path.resolve(requestedPath);

    if (target !== root && !target.startsWith(root + path.sep)){
      throw Error(`Invalid storage path: ${root + path.sep}`);
    }
    return target;
  }
};