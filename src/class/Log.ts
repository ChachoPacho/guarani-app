import fs from "fs";
import path from "path";

export class Log {
  private filename: string;

  /**
   * Crea un Generador de Logs
   * @param dirName Nombre de la carpeta donde se guardaran estos logs
   */
  constructor(dirName: string) {
    let dir = path.join(__dirname, "..", "..", "logs", dirName);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    this.filename = path.join(dir, this.getDate() + ".txt");
  }

  /**
   * Escribe en una subcarpeta de logs, al final del archivo con la fecha actual, la información del log
   * @param data Información a anexar al Log
   */
  private _write(data: string) {
    fs.appendFileSync(this.filename, data + "\n");
  }

  /**
   * Normaliza un número a String en formato: 00 - 99
   * @param num Número a normalizar
   */
  private _normalizeNum(num: number): string {
    return num <= 9 ? "0" + num : String(num);
  }

  /**
   * Devuelve la fecha en formato YEAR-MONTH-DAY-HOUR
   */
  private getDate(): string {
    let today = new Date();

    let y = today.getFullYear().toString().substr(-2);
    let m = today.getMonth() + 1;
    let d = today.getDate();

    return `${y}-${this._normalizeNum(m)}-${this._normalizeNum(d)}`;
  }

  /**
   * Escribe en una subcarpeta de logs, al final del archivo con la fecha actual, la información del log. Especificando
   * hora y minuto
   * @param data Información a anexar al Log
   */
  public write(data: any) {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();

    this._write(`${this._normalizeNum(h)}:${this._normalizeNum(m)}:${this._normalizeNum(s)} - ${data}`);
  }
}
