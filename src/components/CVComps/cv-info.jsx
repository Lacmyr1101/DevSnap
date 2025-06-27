import { useState } from "react"
import '../../styles/modals.css'
import HoverButton from "../hover-button";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useFormValidation } from "../../hooks/useFormValidation";


function CVInfo() {

    const [user, setUser] = useLocalStorage('cv-user', {
        name: 'Default Name',
        email: 'default@email.com',
        phone: '123-456-7890',
        github: '',
        portfolio: ''        
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(user);

    const openModal = () => {
        setFormData(user);
        setIsModalOpen(true);
        document.getElementById('overlay').style.display = 'block'
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.getElementById('overlay').style.display = 'none'
    };


    const validationRules = {
        name: { required: true, minLength: 3 },
        email: { required: true, email: true },
        phone: { required: true, minLength: 8 },
        github: {minLength: 0},
        portfolio: {minLength: 0}
    };

    const { errors, isTouched, validateField, validateForm, handleBlur } = useFormValidation(user, validationRules);

    const handleSave = () => {
        if (validateForm(formData)) {
            setUser(formData);
            closeModal();
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (isTouched[name]) {
            validateField(name, value);
        }
    };

    const isSaveDisabled = Object.values(errors).some(error => error !== null);

    return (
        <section className="cv-contact">
            <h2 className="cv-contact-name">{user.name}</h2>
            <hr />
            <p>
                <span >{user.email} | {user.phone} {user.github ? <span> | <a href={user.github} target="_BLANK">GitHub</a></span> : ''} {user.portfolio ? <span> | <a href={user.portfolio} target="_BLANK">Portfolio</a></span> : ''}</span>
            </p>

            <HoverButton
                clase='cv-contact-edit'
                iconName="create-outline"
                text='Edit Header'
                onClick={openModal} />

            {isModalOpen && (
                <div className="modal">
                    <h2>Fullname & Contact Info</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Fullname"
                            className={errors.name ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.name ? 'show' : ''}`}>
                            {errors.name && errors.name[0]}
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Email"
                            className={errors.email ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.email ? 'show' : ''}`}>
                            {errors.email && errors.email[0]}
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Phone Number"
                            className={errors.phone ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.phone ? 'show' : ''}`}>
                            {errors.phone && errors.phone[0]}
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Your Github's link"
                            className={errors.github ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.github ? 'show' : ''}`}>
                            {errors.github && errors.github[0]}
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            name="portfolio"
                            value={formData.portfolio}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Your Portfolio's link"
                            className={errors.portfolio ? 'input-error' : ''}
                        />
                        <div className={`error-message ${errors.portfolio ? 'show' : ''}`}>
                            {errors.portfolio && errors.portfolio[0]}
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


        </section>


    )
}

export default CVInfo