import { useState } from "react";

export default function HoverButton({ iconName, text, onClick, clase }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            className={clase}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            
            {isHovered ? <span>{text}</span> : <ion-icon name={iconName}></ion-icon>}
        </button>
    );
}
