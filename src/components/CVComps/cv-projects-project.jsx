import { useState } from "react"
import HoverButton from "../hover-button";
import { useFormValidation } from "../../hooks/useFormValidation";

export default function CVProjectsProject({ defaultProject, onDelete, onUpdate }) {
    const [project, setProject] = useState(defaultProject)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(defaultProject);
    // const [isCurrent, setIsCurrent] = useState(false);


    const openModal = () => {
        setFormData(defaultProject);
        setIsModalOpen(true);
        document.getElementById('overlay').style.display = 'block'
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.getElementById('overlay').style.display = 'none'
    };

    const validationRules = {
        pName: { required: true, minLength: 3 },
        technologies: { required: true, minLength: 3 },
        description: { required: true, minLength: 10 },
        link: { minLength: 13 },
        message: { minLength: 6 }
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

    const {
        errors,
        isTouched,
        validateField,
        validateForm,
        handleBlur
    } = useFormValidation(formData, validationRules);


    const handleSave = () => {
        const finalData = {
            ...formData
        };

        if (validateForm(finalData)) {
            setProject(finalData);
            onUpdate(finalData);
            closeModal();
        }
    };

    const isSaveDisabled = Object.values(errors).some(error => error !== null);

    return (
        <div className="cv-projects-list-project">
            <div className="cv-projects-list-project-header">
                <h3 className="cv-projects-list-project-header-name">{project.pName}</h3>
                <div className="cv-projects-list-project-header-buttons">
                    <HoverButton
                        clase='cv-projects-list-project-header-buttons-edit'
                        iconName="create-outline"
                        text='Edit Project'
                        onClick={openModal}
                    />

                    <HoverButton
                        clase='cv-projects-list-project-header-buttons-delete'
                        iconName="trash-outline"
                        text='Delete Project'
                        onClick={onDelete}
                    />
                </div>
            </div>
            <div className="cv-projects-list-project-data">
                <span className="cv-projects-list-project-data-technologies"><i>{project.technologies}</i> <br /></span>
                <span className="cv-projects-list-project-data-description">{project.description}</span>
                <span className="cv-projects-list-project-data-link">
                    <span>Link of the Project: </span><a target="_blank" href={project.link}>{project.message ? project.message : project.link}</a>
                </span>
            </div>

            {isModalOpen && (
                <div className="modal">

                    <h2>Edit Project</h2>

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
                            onClick={handleSave}
                            className="save-btn"
                            disabled={isSaveDisabled}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
