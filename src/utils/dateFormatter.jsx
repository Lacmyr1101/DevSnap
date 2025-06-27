export const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const options = { month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options)
              .replace(',', '') // Elimina la coma
              .replace(/^(\w{3})(\d)/, '$1 $2'); // Asegura espacio entre mes y año
};