import CVEducation from "./cv-education";
import CVExperience from "./cv-experience";
import CVInfo from "./cv-info";
import '../../styles/cv.css'
import CVProjects from "./cv-projects";

export default function CV({ selectedSections }) {


    return (
        <div className="cv-panel">
            <div className="overlay-modal" id="overlay"></div>

            <CVInfo />
            {selectedSections.projects && <CVProjects />}
            {selectedSections.experience && <CVExperience />}
            {selectedSections.education && <CVEducation />}

            

        </div>

    )

}