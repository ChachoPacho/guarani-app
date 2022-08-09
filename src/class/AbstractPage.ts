import { ElementHandle, launch, MouseButton, Page } from "puppeteer";
import { CONFIG } from "../config";
import { Log } from "./Log";

const ARGS = ["--lang=en-US,en"];

export abstract class AbstractPage {
  protected page!: Page;
  protected pageUrl!: string;
  protected log!: Log;

  /**
   * @param {string} pagenNme - the name of the Page. Logs porpouses.
   */
  constructor(pageName: string) {
    this.log = new Log(`pages/${pageName}`);
  }

  /**
   * Inicio el navegador y abro la url
   */
  public async init() {
    try {
      const browser = await launch({
        headless: !CONFIG.DEBUG,
        args: ARGS,
        defaultViewport: null,
      });

      this.log.write("Browser iniciado");

      this.page = (await browser.pages())[0];

      await this.page.setUserAgent(CONFIG.USER_AGENT);
      await this.goToSubpage();
    } catch (error) {
      this.unexpectedEnd("No se pudo iniciar la página", error);
    }
  }

  /**
   * Escribe una serie de mensajes en los logs y cierra la página.
   */
  protected unexpectedEnd(...messages: any[]) {
    for (const msg of messages) this.log.write(msg);

    return this.close();
  }

  private prepareNav(cb: Promise<any>) {
    return Promise.all([
      this.page.waitForNavigation({ waitUntil: "networkidle0" }),
      cb,
    ]);
  }

  protected async clickAndNav(
    selector: string,
    config: {
      button?: MouseButton;
      delay?: number;
      clickCount?: number;
    } = {}
  ) {
    await this.prepareNav(this.page.click(selector, config));
  }

  /**
   * Emula clickear una etiqueta html \<a href={href}\>.
   * @param {string} href - debe empezar con \/.
   * @default "" - No pasar ningún parámetro equivale a ir a Home
   */
  protected goToSubpage(href: string = "") {
    this.log.write(`Yendo a ${this.pageUrl + href}`);
    return this.page.goto(this.pageUrl + href, { waitUntil: "networkidle0" });
  }

  protected clickElementAndNav(elem: ElementHandle<Element>) {
    return this.prepareNav(elem.click());
  }

  protected evaluateAndNav(script: string) {
    return this.prepareNav(this.page.evaluate(script));
  }

  /**
   * Cierra la conexión
   */
  public close() {
    return this.page.close();
  }
}
