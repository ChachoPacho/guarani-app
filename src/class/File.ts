import fs from "fs";
import path from "path";

export class File {
  private static cacheDir = path.join(__dirname, "..", "..", "cache");

  /**
   * Escribe en cache el archivo con el nombre y la información pasada
   * @param {string} name Nombre del archivo a escribir
   * @param {string} data Información a escribir
   */
  public static write(name: string, data: string) {
    if (!fs.existsSync(this.cacheDir)) fs.mkdirSync(this.cacheDir);

    fs.writeFileSync(path.join(this.cacheDir, name), data);
  }

  /**
   * Revisa si existe el archivp
   * @param {string} name Nombre del archivo
   */
  public static exist(name: string) {
    return fs.existsSync(path.join(this.cacheDir, name));
  }

  /**
   * Devuelve la información del archivo solicitado en cache
   * @param {string} name Nombre del archivo a leer
   */
  public static read(name: string) {
    return fs.readFileSync(path.join(this.cacheDir, name), "utf-8");
  }
}
