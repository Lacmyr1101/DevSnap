import logoTitle from '../../assets/logo-title.png'
import '../../styles/spaces.css'

export default function LandingSpace() {
    return (
        <aside className="landing-space">

            <div className="presentation">
                <div className="title">
                    <div className="icon">
                        <img src={logoTitle} alt='DevSnap Logo'/>
                    </div>
                    <div className="subtitle-bg">
                        <span className='subtitle'>By Lacmyr</span><span className='write'>_</span>

                    </div>
                    <a href="#workSpace" className='btn-start'>START BUILDING YOUR CV</a>
                </div>
                <div className="info">
                    <p>
                        Hi everyone, my name is Leonardo, I'm a 21-years-old Frontend Developer, and I created this app to help all code lovers build their own CVs, so they can work and make a living in this world. <br /> <br />
                        It's optimized with all Google-approved formatting recommendations for better ranking within recruitment algorithms and later human searches. You can download the CV below in the Work-Section. This project was developed with React. Any suggestions for improvements, please let me know. <br /> <br />
                        My goal is to help as many people as possible through code, so if you're looking for someone to work on or want to collaborate on a project, don't hesitate to contact me through my social media below.
                    </p>
                    
                </div>
            </div>

            <div className="social">
                <a href="https://www.instagram.com/its_lacmyr/" target='_BLANK'>
                    <ion-icon name="logo-instagram"></ion-icon>
                </a>
                <a href="https://www.tiktok.com/@lacmyr1101" target='_BLANK'>
                    <ion-icon name="logo-tiktok"></ion-icon>
                </a>
                <a href="https://github.com/Lacmyr1101" target='_BLANK'>
                    <ion-icon name="logo-github"></ion-icon>
                </a>
                <a href="https://www.facebook.com/leonardo.500735?locale=es_LA" target='_BLANK'>
                    <ion-icon name="logo-facebook"></ion-icon>
                </a>
                <a href="https://www.linkedin.com/in/leonardo-a-cornieles-78b9b5207/" target='_BLANK'>
                    <ion-icon name="logo-linkedin"></ion-icon>
                </a>
            </div>
        </aside>
    )
}