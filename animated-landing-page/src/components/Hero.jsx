import {useEffect, useRef} from "react";

const Hero = () => {
    const videoRef = useRef();

    useEffect(() => {
        if(videoRef.current) videoRef.current.playbackRate = 2;
    }, []);

    return (
        <section id="hero">
            <div>
                <h1>Welcome to SwiftSolve AI</h1>
                <p>We Turn Ideas Into Powerful Digital Products</p>
            </div>

            <video ref={videoRef} src="/videos/hero.mp4" autoPlay muted playsInline />
        </section>
    )
}
export default Hero
