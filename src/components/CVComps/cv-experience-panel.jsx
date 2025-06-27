import { useState, useEffect } from "react";
import CVExperiencePanelData from "./cv-experience-panel-data";
import HoverButton from "../hover-button";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useFormValidation } from "../../hooks/useFormValidation";
import { formatDateForDisplay } from "../../utils/dateFormatter";

export default function CVExperiencePanel({ defaultCompany, onDeleteCompany, onUpdateCompany }) {
    // Estado para la compañía
    const [company, setCompany] = useState(defaultCompany);
    const [isModalOpenTwo, setIsModalOpenTwo] = useState(false);
    const [formDataTwo, setFormDataTwo] = useState(company);

    // Validación para editar compañía
    const validationRulesCompany = {
        name: { required: true, minLength: 3 }
    };

    const {
        errors: errorsCompany,
        isTouched: isTouchedCompany,
        validateField: validateFieldCompany,
        validateForm: validateFormCompany,
        handleBlur: handleBlurCompany
    } = useFormValidation(formDataTwo, validationRulesCompany);

    // Estado para las posiciones (con localStorage)
    const [positionList, setPositionList] = useLocalStorage(
        `cv-experience-positions-${company.id}`,
        []
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        position: '',
        description: '',
        start: '',
        finish: ''
    });
    const [isCurrentPosition, setIsCurrentPosition] = useState(false);

    // Validación para agregar posición
    const validationRulesPosition = {
        position: { required: true, minLength: 3 },
        description: { required: true, minLength: 10 },
        start: { required: true, date: true },
        finish: { date: true } // Sin required
    };

    const {
        errors,
        isTouched,
        validateField,
        validateForm,
        handleBlur: validateBlur
    } = useFormValidation(formData, validationRulesPosition);

    // Efecto para sincronizar isCurrentPosition con finish
    useEffect(() => {
        setIsCurrentPosition(!formData.finish);
    }, [formData.finish]);

    // Funciones para manejar la compañía
    const openModalTwo = () => {
        setFormDataTwo(company);
        setIsModalOpenTwo(true);
        document.getElementById('overlay').style.display = 'block';
    };

    const closeModalTwo = () => {
        setIsModalOpenTwo(false);
        document.getElementById('overlay').style.display = 'none';
    };

    const handleChangeTwo = (e) => {
        const { name, value } = e.target;
        setFormDataTwo(prev => ({ ...prev, [name]: value }));
        if (isTouchedCompany[name]) {
            validateFieldCompany(name, value, formDataTwo);
        }
    };

    const handleSaveTwo = () => {
        if (validateFormCompany(formDataTwo)) {
            const updatedCompany = { ...company, ...formDataTwo };
            setCompany(updatedCompany);
            onUpdateCompany(updatedCompany);
            closeModalTwo();
        }
    };

    const isSaveDisabledCompany = Object.values(errorsCompany).some(error => error !== null);

    // Funciones para manejar las posiciones
    const openModal = () => {
        setFormData({
            position: '',
            description: '',
            start: '',
            finish: ''
        });
        setIsCurrentPosition(false);
        setIsModalOpen(true);
        document.getElementById('overlay').style.display = 'block';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.getElementById('overlay').style.display = 'none';
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'isCurrent') {
            setIsCurrentPosition(checked);
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
                validateField(name, value, newData, isCurrentPosition);
            }
            return newData;
        });
    };

    const handleBlur = (e) => {
        validateBlur(e);
        const { name, value } = e.target;
        if (name === 'finish' && value) {
            setIsCurrentPosition(false);
        }
    };

    const handleAddPosition = () => {
        const finalData = {
            ...formData,
            finish: isCurrentPosition ? '' : formData.finish
        };

        if (validateForm(finalData, isCurrentPosition)) {
            const newPosition = {
                id: Date.now(),
                ...finalData,
            };
            setPositionList((prev) => [...prev, newPosition]);
            closeModal();
        }
    };

    const handleUpdatePosition = (updatedPosition) => {
        setPositionList(prev =>
            prev.map(position =>
                position.id === updatedPosition.id ? updatedPosition : position
            )
        );
    };

    const handleDeletePosition = (idToDelete) => {
        setPositionList(prev => prev.filter(position => position.id !== idToDelete));
    };

    const isSaveDisabled = Object.values(errors).some(error => error !== null);

    return (
        <div className="cv-experience-list-panel">
            <div className="cv-experience-list-panel-head">
                <h3 className="cv-experience-list-panel-head-company">{company.name}</h3>
                <div className="cv-experience-list-panel-head-buttons">
                    <HoverButton
                        clase='cv-experience-list-panel-head-buttons-edit'
                        iconName="create-outline"
                        text='Edit Company'
                        onClick={openModalTwo}
                    />
                    <HoverButton
                        clase='cv-experience-list-panel-head-buttons-edit'
                        iconName="trash-outline"
                        text='Delete Company'
                        onClick={onDeleteCompany}
                    />
                    <HoverButton
                        clase='cv-experience-list-panel-head-buttons-add'
                        iconName="add-outline"
                        text='Add Position'
                        onClick={openModal}
                    />
                </div>
            </div>

            <div className="cv-experience-list-panel-list">
                {positionList.map((data) => (
                    <CVExperiencePanelData
                        key={data.id}
                        defaultData={data}
                        onDelete={() => handleDeletePosition(data.id)}
                        onUpdate={handleUpdatePosition}
                    />
                ))}
            </div>

            {/* Modal para agregar posición */}
            {isModalOpen && (
                <div className="modal">
                    <h2>Add Position</h2>

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
                            disabled={isCurrentPosition}
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
                                checked={isCurrentPosition}
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
                            onClick={handleAddPosition}
                            className="save-btn"
                            disabled={isSaveDisabled}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

            {/* Modal para editar compañía */}
            {isModalOpenTwo && (
                <div className="modal">
                    <h2>Edit Company</h2>

                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            value={formDataTwo.name}
                            onChange={handleChangeTwo}
                            onBlur={handleBlurCompany}
                            placeholder="Company"
                            className={errorsCompany.name ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errorsCompany.name ? 'show' : ''}`}>
                            {errorsCompany.name && errorsCompany.name[0]}
                        </div>
                    </div>

                    <div className="modal-buttons">
                        <button onClick={closeModalTwo} className="cancel-btn">Cancel</button>
                        <button
                            onClick={handleSaveTwo}
                            className="save-btn"
                            disabled={isSaveDisabledCompany}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}