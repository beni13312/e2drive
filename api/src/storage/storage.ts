import Config from "../config/config.js";
import path from "node:path";

export default class Storage {
  public static read(){

  }
  public static write(){

  }
  private validatePath(requestedPath: string){
    const root = path.resolve(Config.DATA_STORAGE);
    const target = path.resolve(root, path.join(root, requestedPath));

    if (target !== root && !target.startsWith(root + path.sep)){
      return "";
    }
    return target;
  }
};