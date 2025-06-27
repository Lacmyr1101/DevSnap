import { useState } from "react";
import CVProjectsProject from "./cv-projects-project";
import HoverButton from "../hover-button";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useFormValidation } from "../../hooks/useFormValidation";


export default function CVProjects() {
    const [projectList, setProjectList] = useLocalStorage('cv-projects', []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        pName: '',
        technologies: '',
        description: '',
        link: '',
        message: ''
    });

    const validationRules = {
        pName: { required: true, minLength: 3 },
        technologies: { required: true, minLength: 3 },
        description: { required: true, minLength: 10 },
        link: { minLength: 13 },
        message: { minLength: 6 }
    };

    const { errors, isTouched, validateField, validateForm, handleBlur: validateBlur } = useFormValidation(formData, validationRules);



    const openModal = () => {
        setFormData({
            pName: '',
            technologies: '',
            description: '',
            link: '',
            message: ''
        });
        setIsModalOpen(true);
        document.getElementById('overlay').style.display = 'block'
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.getElementById('overlay').style.display = 'none'
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (isTouched[name]) {
                validateField(name, value, newData);
            }
            return newData;
        });
    };

    const handleBlur = (e) => {
        validateBlur(e);
    };


    const handleAddProject = () => {
        const finalData = {
            ...formData,
        };

        if (validateForm(finalData)) {
            const newProject = { id: Date.now(), ...finalData };
            setProjectList(prev => [...prev, newProject]);
            closeModal();
        }
    };

    const isSaveDisabled = Object.values(errors).some(error => error !== null);


    const handleDeleteProject = (idToDelete) => {
        setProjectList((prev) => prev.filter((project) => project.id !== idToDelete));
    };

    const handleUpdateProject = (updatedProject) => {
        setProjectList(prev =>
            prev.map(project =>
                project.id === updatedProject.id ? updatedProject : project
            )
        );
    };


    return (
        <section className="cv-projects">
            <h2>Personal Projects</h2>
            <hr />

            <div className="cv-projects-list">
                {projectList.map((project) => (
                    <CVProjectsProject
                        key={project.id}
                        defaultProject={project}
                        onDelete={() => handleDeleteProject(project.id)}
                        onUpdate={handleUpdateProject}
                    />
                ))}

            </div>

            <HoverButton
                clase='cv-projects-add'
                iconName="add-outline"
                text='Add Project'
                onClick={openModal}
            />

            {isModalOpen && (
                <div className="modal">
                    <h2>Add a New Project</h2>

                    <div className="input-group">
                        <input
                            type="text"
                            name="pName"
                            value={formData.pName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Project's Name"
                            className={errors.pName ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.pName ? 'show' : ''}`}>
                            {errors.pName && errors.pName[0]}
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Technologies you used to make the project"
                            className={errors.technologies ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.technologies ? 'show' : ''}`}>
                            {errors.technologies && errors.technologies[0]}
                        </div>
                    </div>

                    <div className="input-group">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Description of the Project"
                            className={errors.description ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.description ? 'show' : ''}`}>
                            {errors.description && errors.description[0]}
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Share the link you deployed the project or the GitHub Repository"
                            className={errors.link ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.link ? 'show' : ''}`}>
                            {errors.link && errors.link[0]}
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Message for the project's link you wanna show"
                            className={errors.message ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.message ? 'show' : ''}`}>
                            {errors.message && errors.message[0]}
                        </div>
                    </div>



                    <div className="modal-buttons">
                        <button onClick={closeModal} className="cancel-btn">Cancel</button>
                        <button
                            onClick={handleAddProject}
                            className="save-btn"
                            disabled={isSaveDisabled}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
