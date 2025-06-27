import { useState } from "react";
import CVExperiencePanel from "./cv-experience-panel";
import HoverButton from "../hover-button";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useFormValidation } from "../../hooks/useFormValidation";


export default function CVExperience() {

    const [companyList, setCompanyList] = useLocalStorage('cv-experience', []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
    });

    const openModal = () => {
        setFormData({ name: '' });
        setIsModalOpen(true);
        document.getElementById('overlay').style.display = 'block'
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.getElementById('overlay').style.display = 'none'
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validationRules = {
        name: { required: true, minLength: 3 }
    };

    const { errors, isTouched, validateField, validateForm, handleBlur } = useFormValidation(formData, validationRules);


    const handleAddCompany = () => {
        if (validateForm(formData)) {
            const newCompany = {
                id: Date.now(),
                ...formData,
            };
            setCompanyList((prev) => [...prev, newCompany]);
            closeModal();
        }
    };

    const isSaveDisabled = Object.values(errors).some(error => error !== null);

    const handleDeleteCompany = (idToDelete) => {
        setCompanyList((prev) => prev.filter((company) => company.id !== idToDelete));
    };

    const handleUpdateCompany = (updatedCompany) => {
        setCompanyList(prev =>
            prev.map(company =>
                company.id === updatedCompany.id ? updatedCompany : company
            )
        );
    };


    return (
        <section className="cv-experience">
            <h2>Practical Experience</h2>
            <hr />

            <div className="cv-experience-list">
                {companyList.map((company) => (
                    <CVExperiencePanel
                        key={company.id}
                        defaultCompany={company}
                        onDeleteCompany={() => handleDeleteCompany(company.id)}
                        onUpdateCompany={handleUpdateCompany}

                    />
                ))}
            </div>

            <HoverButton
                clase='cv-experience-add'
                iconName="add-outline"
                text='Add Company'
                onClick={openModal}
            />

            {isModalOpen && (
                <div className="modal">
                    <h2>Add the company's name</h2>

                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Company"
                            className={errors.name ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.name ? 'show' : ''}`}>
                            {errors.name && errors.name[0]}
                        </div>
                    </div>

                    <div className="modal-buttons">
                        <button onClick={closeModal} className="cancel-btn">Cancel</button>
                        <button
                            onClick={handleAddCompany}
                            className="save-btn"
                            disabled={isSaveDisabled}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}