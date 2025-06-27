import { useState, useEffect } from "react"
import HoverButton from "../hover-button";
import { useFormValidation } from "../../hooks/useFormValidation";
import { formatDateForDisplay } from '../../utils/dateFormatter';

export default function CVEducationStudy({ defaultStudy, onDelete, onUpdate }) {
    const [study, setStudy] = useState(defaultStudy)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(defaultStudy);
    const [isCurrent, setIsCurrent] = useState(false);


    const openModal = () => {
        setFormData(defaultStudy);
        setIsModalOpen(true);
        document.getElementById('overlay').style.display = 'block'
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.getElementById('overlay').style.display = 'none'
    };

    const validationRules = {
        title: { required: true, minLength: 3 },
        school: { required: true, minLength: 3 },
        start: { required: true, date: true },
        finish: { date: true }
    };



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'isCurrent') {
            const newCurrent = checked;
            setIsCurrent(newCurrent);
            setFormData(prev => {
                const newData = newCurrent ? { ...prev, finish: '' } : prev;
                // Forzamos validación del campo finish
                validateField('finish', newData.finish, newData, newCurrent);
                return newData;
            });
            return;
        }

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
        handleBlur: validateBlur
    } = useFormValidation(formData, validationRules);

    useEffect(() => {
        setIsCurrent(!formData.finish);
    }, [formData.finish]);

    const handleBlur = (e) => {
        validateBlur(e); // Usamos el handleBlur del hook
        const { name, value } = e.target;
        if (name === 'finish' && value) {
            setIsCurrent(false);
        }
    };

    const handleSave = () => {
        // Creamos datos finales considerando el checkbox
        const finalData = {
            ...formData,
            finish: isCurrent ? '' : formData.finish
        };

        if (validateForm(finalData, isCurrent)) {
            setStudy(finalData);
            onUpdate(finalData);
            closeModal();
        }
    };

    const isSaveDisabled = Object.values(errors).some(error => error !== null);

    return (
        <div className="cv-education-list-study">
            <div className="cv-education-list-study-header">
                <h3 className="cv-education-list-study-header-title">{study.title}</h3>
                <div className="cv-education-list-study-header-buttons">
                    <HoverButton
                        clase='cv-education-list-study-header-buttons-edit'
                        iconName="create-outline"
                        text='Edit Study'
                        onClick={openModal}
                    />

                    <HoverButton
                        clase='cv-education-list-study-header-buttons-delete'
                        iconName="trash-outline"
                        text='Delete Study'
                        onClick={onDelete}
                    />
                </div>
            </div>
            <div className="cv-education-list-study-data">
                <span className="cv-education-list-study-data-school">{study.school}</span>
                <div className="cv-education-list-study-data-time">
                    <span>
                        {formatDateForDisplay(study.start)} - {study.finish ? formatDateForDisplay(study.finish) : 'Present'}
                    </span>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <h2>Edit Study</h2>
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
                            placeholder="School, University, etc"
                            className={errors.school ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.title ? 'show' : ''}`}>
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
