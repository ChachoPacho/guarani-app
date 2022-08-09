import { File } from "./class/File";
import { GuaraniPage } from "./class/GuaraniPage";

export async function loadStudyData(subjects: boolean = false, correlatives: boolean = false) {
  require('dotenv').config();

  const guaraniPage = new GuaraniPage();

  await guaraniPage.init();
  await guaraniPage.login();
  await guaraniPage.goToCareer();
  await guaraniPage.goToStudyPlan();
  
  if (subjects) {
    const subjectsData = await guaraniPage.getSubjects();
    File.write("Subjects.json", JSON.stringify(subjectsData));
  }

  if (correlatives) {
    const correlativesData = await guaraniPage.getCorrelatives();
    File.write("Correlatives.json", JSON.stringify(correlativesData));
  }

  await guaraniPage.close();
  process.exit();
}
