import { CONFIG } from "../config";
import { Subject } from "../types/Subject";
import { AbstractPage } from "./AbstractPage";

const LOGIN_BTN_SELECTOR = "#login div.well.well-small.text-center a.btn.btn-info.no-ajax";
const FORM_USER_SELECTOR = "#username";
const FORM_PASSWORD_SELECTOR = "#password";
const FORM_SUBMIT_SELECTOR = "input.btn";

const CAREER_BTN_SELECTOR = "#js-dropdown-toggle-carreras";
const CAREERS_SELECTOR = "#js-dropdown-menu-carreras > li > a";

const SUBJECTS_SELECTOR = ".accordion div > table > tbody > tr:not(.correlatividades)";
const CORRELATIVES_SELECTOR = ".accordion div > table > tbody > tr.correlatividades";
const CORRELATIVES_BTN_SELECTOR = "div > table > tbody > tr > td > a";

const DATA_QUARTER_REGEX = /\d/;
const DATA_GRADE_REGEX = /\d/;
const DATA_COND_REGEX = /\((.*)\)/;
const DATA_CORRELATIVES_REGEX = /data-correlatividades-id="(.*)"/g;

export class GuaraniPage extends AbstractPage {
  pageUrl: string = CONFIG.G_URL;
  
  constructor() {
    super("guarani");
  }

  /**
   * Seteo credenciales y me logueo
   */
  public async login() {
    try {
      // Open login
      await this.clickAndNav(LOGIN_BTN_SELECTOR);

      // Set credentials
      await this.page.type(FORM_PASSWORD_SELECTOR, process.env.UNC_PASSWORD!)
      await this.page.type(FORM_USER_SELECTOR, process.env.UNC_USER!),

      // Send Form
      await this.clickAndNav(FORM_SUBMIT_SELECTOR);
    } catch (error) {
      return this.unexpectedEnd("Logueo fallido", error);
    }
  }
  
  /**
   * Setea la carrera que se quiere scrapear
   */
  public async goToCareer() {
    try {
      await this.page.click(CAREER_BTN_SELECTOR);
      await this.clickAndNav(`${CAREERS_SELECTOR}[title="${CONFIG.CAREER}"]`);
    } catch (error) {
      await this.unexpectedEnd("No se pudo setear la carrera", error);
    }
  }

  /**
   * Va al plan de estudio de la carrera en la que se encuentre
   */
  public async goToStudyPlan() {
    try {
      await this.goToSubpage("/plan_estudio");
    } catch (error) {
      await this.unexpectedEnd("No se pudo ir al plan de estudios", error);
    }
  }

  public async getCorrelatives() {
    try {
      await this.page.$$eval(CORRELATIVES_BTN_SELECTOR, (elems: any) => {
        for (const elem of elems) {
          elem.click();
        }
      });
      
      const elems = await this.page.$$eval(CORRELATIVES_SELECTOR, elems => {
        let texts = [];

        for (const elem of elems) {
          let plainData = elem.innerHTML.replace(/<td>\s*/g, "").split(/\s*<\/td>/g);

          texts.push(plainData);
        }

        return texts;
      })

      const dataObjectArray = [];

      for (const elem of elems) {
        let dataObject: Subject = <any>{};

        let nameAndCode = elem[0].split(/\s*\(/);
        dataObject.name = nameAndCode[0];
        dataObject.code = nameAndCode[1].replace(")", "");
        dataObject.year = +elem[2];

        let quarter = DATA_QUARTER_REGEX.exec(elem[3]) || ["0"];
        dataObject.quarter = +quarter[0];

        let cond = DATA_COND_REGEX.exec(elem[4]);
        if (!cond) {
          dataObject.grade = null;
          dataObject.cond = elem[5][0] || null;
        } else {
          let grade = DATA_GRADE_REGEX.exec(elem[4]);
          dataObject.grade = grade ? +grade[0] : null;
          dataObject.cond = cond[1][0];
        }

        let correlatives = DATA_CORRELATIVES_REGEX.exec(elem[8]);
        dataObject.correlativesId = correlatives ? correlatives[1] : null;

        dataObjectArray.push(dataObject);
      }

      return dataObjectArray;
    } catch (error) {
      return this.unexpectedEnd("No se pudieron obtener las materias", error);
    }
  }

  public async getSubjects() {
    try {
      const elems = await this.page.$$eval(SUBJECTS_SELECTOR, elems => {
        let texts = [];

        for (const elem of elems) {
          let plainData = elem.innerHTML.replace(/<td>\s*/g, "").split(/\s*<\/td>/g);

          texts.push(plainData);
        }

        return texts;
      })

      const dataObjectArray = [];

      for (const elem of elems) {
        let dataObject: Subject = <any>{};

        let nameAndCode = elem[0].split(/\s*\(/);
        dataObject.name = nameAndCode[0];
        dataObject.code = nameAndCode[1].replace(")", "");
        dataObject.year = +elem[2];

        let quarter = DATA_QUARTER_REGEX.exec(elem[3]) || ["0"];
        dataObject.quarter = +quarter[0];

        let cond = DATA_COND_REGEX.exec(elem[4]);
        if (!cond) {
          dataObject.grade = null;
          dataObject.cond = elem[5][0] || null;
        } else {
          let grade = DATA_GRADE_REGEX.exec(elem[4]);
          dataObject.grade = grade ? +grade[0] : null;
          dataObject.cond = cond[1][0];
        }

        let correlatives = DATA_CORRELATIVES_REGEX.exec(elem[8]);
        dataObject.correlativesId = correlatives ? correlatives[1] : null;

        dataObjectArray.push(dataObject);
      }

      return dataObjectArray;
    } catch (error) {
      return this.unexpectedEnd("No se pudieron obtener las materias", error);
    }
  }
}
