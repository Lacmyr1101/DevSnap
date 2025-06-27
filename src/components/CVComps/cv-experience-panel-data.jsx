import { useState, useEffect } from "react"
import HoverButton from "../hover-button";
import { useFormValidation } from "../../hooks/useFormValidation";
import { formatDateForDisplay } from '../../utils/dateFormatter';

export default function CVExperiencePanelData({ defaultData, onDelete, onUpdate }) {
    const [data, setData] = useState(defaultData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(defaultData);
    const [isCurrent, setIsCurrent] = useState(!formData.finish);

    const validationRules = {
        position: { required: true, minLength: 3 },
        description: { required: true, minLength: 10 },
        start: { required: true, date: true },
        finish: { date: true } // Sin required
    };

    const { errors, isTouched, validateField, validateForm, handleBlur: validateBlur } =
        useFormValidation(formData, validationRules);



    const openModal = () => {
        setFormData(data);
        setIsModalOpen(true);
        document.getElementById('overlay').style.display = 'block'
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.getElementById('overlay').style.display = 'none'
    };

    useEffect(() => {
        setIsCurrent(!formData.finish);
    }, [formData.finish]);

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

    const handleSave = () => {
        const finalData = {
            ...formData,
            finish: isCurrent ? '' : formData.finish
        };

        if (validateForm(finalData, isCurrent)) {
            setData(finalData);
            onUpdate(finalData);
            closeModal();
        }
    };

    const isSaveDisabled = Object.values(errors).some(error => error !== null);

    return (
        <div className="cv-experience-list-panel-list-data">
            <div className="cv-experience-list-panel-list-data-head">
                <span className="cv-experience-list-panel-list-data-head-position"><i>{data.position}</i></span>
                <span className="cv-experience-list-panel-list-data-head-time">
                    {formatDateForDisplay(data.start)} - {data.finish ? formatDateForDisplay(data.finish) : 'Present'}
                </span>
            </div>
            <span className="cv-experience-list-panel-list-data-description">{data.description}</span>
            <div className="cv-experience-list-panel-list-data-buttons">
                <HoverButton
                    clase='cv-experience-list-panel-list-data-buttons-edit'
                    iconName="create-outline"
                    text='Edit Position'
                    onClick={openModal}
                />

                <HoverButton
                    clase='cv-experience-list-panel-list-data-buttons-delete'
                    iconName="trash-outline"
                    text='Delete Position'
                    onClick={onDelete}
                />
            </div>

            {isModalOpen && (

                <div className="modal">
                    <h2>Edit Position</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Position"
                            className={errors.position ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.position ? 'show' : ''}`}>
                            {errors.position && errors.position[0]}
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

                    <div className="input-group">
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Description"
                            className={errors.description ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.description ? 'show' : ''}`}>
                            {errors.description && errors.description[0]}
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


    )
}
