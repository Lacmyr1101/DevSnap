import { useState } from "react";
import CVEducationStudy from "./cv-education-study";
import HoverButton from "../hover-button";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useFormValidation } from "../../hooks/useFormValidation";


export default function CVEducation() {
    const [educationList, setEducationList] = useLocalStorage('cv-education', []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        school: '',
        start: '',
        finish: '',
    });
    const [isCurrent, setIsCurrent] = useState(false);

    const validationRules = {
        title: { required: true, minLength: 3 },
        school: { required: true, minLength: 3 },
        start: { required: true, date: true },
        finish: { date: true }
    };

    const { errors, isTouched, validateField, validateForm, handleBlur: validateBlur } = useFormValidation(formData, validationRules);



    const openModal = () => {
        setFormData({ title: '', school: '', start: '', finish: '' });
        setIsModalOpen(true);
        document.getElementById('overlay').style.display = 'block'
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.getElementById('overlay').style.display = 'none'
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'isCurrent') {
            setIsCurrent(checked);
            setFormData(prev => {
                const newData = checked ? { ...prev, finish: '' } : prev;
                if (isTouched['finish']) {
                    validateField('finish', newData.finish, newData, checked);
                }
                return newData;
            });
            return;
        }

        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (isTouched[name]) {
                validateField(name, value, newData, isCurrent);
            }
            return newData;
        });
    };

    const handleBlur = (e) => {
        validateBlur(e);
        const { name, value } = e.target;
        if (name === 'finish' && value) {
            setIsCurrent(false);
        }
    };






    const handleAddStudy = () => {
        const finalData = {
            ...formData,
            finish: isCurrent ? '' : formData.finish
        };

        if (validateForm(finalData, isCurrent)) {
            const newStudy = { id: Date.now(), ...finalData };
            setEducationList(prev => [...prev, newStudy]);
            closeModal();
        }
    };

    const isSaveDisabled = Object.values(errors).some(error => error !== null);


    const handleDeleteStudy = (idToDelete) => {
        setEducationList((prev) => prev.filter((study) => study.id !== idToDelete));
    };

    const handleUpdateStudy = (updatedStudy) => {
        setEducationList(prev =>
            prev.map(study =>
                study.id === updatedStudy.id ? updatedStudy : study
            )
        );
    };


    return (
        <section className="cv-education">
            <h2>Education</h2>
            <hr />

            <div className="cv-education-list">
                {educationList.map((study) => (
                    <CVEducationStudy
                        key={study.id}
                        defaultStudy={study}
                        onDelete={() => handleDeleteStudy(study.id)}
                        onUpdate={handleUpdateStudy}
                    />
                ))}

            </div>

            <HoverButton
                clase='cv-education-add'
                iconName="add-outline"
                text='Add Study'
                onClick={openModal}
            />

            {isModalOpen && (
                <div className="modal">
                    <h2>Add a New Study</h2>

                    <div className="input-group">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Title or Degree"
                            className={errors.title ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.title ? 'show' : ''}`}>
                            {errors.title && errors.title[0]}
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            name="school"
                            value={formData.school}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="School, University, etc."
                            className={errors.school ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.school ? 'show' : ''}`}>
                            {errors.school && errors.school[0]}
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="date"
                            name="start"
                            value={formData.start}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Start Date"
                            className={errors.start ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.start ? 'show' : ''}`}>
                            {errors.start && errors.start[0]}
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="date"
                            name="finish"
                            value={formData.finish}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Finish Date"
                            className={errors.finish ? 'input-error' : ''}
                            disabled={isCurrent}
                        />
                        <div className={`error-message ${errors.finish ? 'show' : ''}`}>
                            {errors.finish && errors.finish[0]}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>
                            <input
                                type="checkbox"
                                name="isCurrent"
                                checked={isCurrent}
                                onChange={handleChange}
                            />
                            En curso / Actualidad
                        </label>
                    </div>

                    <div className="modal-buttons">
                        <button onClick={closeModal} className="cancel-btn">Cancel</button>
                        <button
                            onClick={handleAddStudy}
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
