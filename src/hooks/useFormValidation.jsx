import { useState } from "react";


export const useFormValidation = (initialState, validationRules) => {
    const [errors, setErrors] = useState({});
    const [isTouched, setIsTouched] = useState({});

    const validateField = (name, value, allValues, isCurrent = false) => {
        const rules = validationRules[name];
        if (!rules) return true;

        let isValid = true;
        const newErrors = [];

        if (name === 'finish' && isCurrent) {
            setErrors(prev => ({ ...prev, [name]: null }));
            return true;
        }

        if (rules.required && !value.trim()) {
            newErrors.push("Este campo es obligatorio");
            isValid = false;
        }

        if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            newErrors.push("Ingrese un email válido");
            isValid = false;
        }

        if (rules.date && isNaN(new Date(value).getTime())) {
            newErrors.push("Fecha inválida");
            isValid = false;
        }

        if (rules.minLength && value.length < rules.minLength) {
            newErrors.push(`Mínimo ${rules.minLength} caracteres`);
            isValid = false;
        }

        // Nueva validación para fecha de fin posterior a inicio
        if (name === 'finish' && allValues?.start && new Date(value) < new Date(allValues.start)) {
            newErrors.push("La fecha de fin debe ser posterior a la de inicio");
            isValid = false;
        }


        setErrors(prev => ({
            ...prev,
            [name]: newErrors.length > 0 ? newErrors : null
        }));

        return isValid;
    };

    const validateForm = (formData, isCurrent = false) => {
        let isValid = true;
        Object.keys(validationRules).forEach(name => {
            // No validamos finish si está en curso
            if (name === 'finish' && isCurrent) {
                setErrors(prev => ({ ...prev, [name]: null }));
                return;
            }
            isValid = validateField(name, formData[name], formData, isCurrent) && isValid;
        });
        return isValid;
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setIsTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, value, { [name]: value });
    };

    return { errors, isTouched, validateField, validateForm, handleBlur };
};