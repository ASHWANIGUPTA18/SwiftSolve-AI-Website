import {useMediaQuery} from "react-responsive";
import {useGSAP} from "@gsap/react";
import gsap from 'gsap';

const Showcase = () => {
    const isTablet = useMediaQuery({ query: '(max-width: 1024px)'});

    useGSAP(() => {
        if(!isTablet) {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: '#showcase',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true,
                    pin: true,
                }
            });

            timeline
                .to('.mask img', {
                    transform: 'scale(1.1)'
                }).to('.content', { opacity: 1, y: 0, ease: 'power1.in' });
        }
    }, [isTablet])

    return (
        <section id="showcase">
<div className="content">
                <div className="wrapper">
                    <div className="lg:max-lg">
                        <h2>SwiftSolve AI — Built for Modern Business</h2>

                        <div className="space-y-5 mt-7 pe-10">
                            <p>
                                Powered by {" "}
                                <span className="text-white">
                                    cutting-edge AI and modern web technologies
                                </span>
                                , SwiftSolve AI delivers
                            </p>
                            <p>
                                High-performance websites, intuitive UI/UX designs, and intelligent automation tools — all built specifically around your business goals.
                            </p>
                            <p>
                                From WhatsApp bots to full AI integrations, we combine creativity and technology to help businesses grow faster, work smarter, and stand out from the competition.
                            </p>
                            <p className="text-primary">Explore what we build</p>
                        </div>
                    </div>

                    <div className="max-w-3xs space-y-14">
                        <div className="space-y-2">
                            <p>Over</p>
                            <h3>50+</h3>
                            <p>projects delivered successfully</p>
                        </div>
                        <div className="space-y-2">
                            <p>Rated</p>
                            <h3>100%</h3>
                            <p>client satisfaction rate</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Showcase
