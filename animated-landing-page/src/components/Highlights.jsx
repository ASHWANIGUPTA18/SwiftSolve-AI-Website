import {useMediaQuery} from "react-responsive";
import {useGSAP} from "@gsap/react";
import gsap from "gsap";

const Highlights = () => {
    const isMobile = useMediaQuery({  query: '(max-width: 1024px)' });

    useGSAP(() => {
        gsap.to(['.left-column', '.right-column'], {
            scrollTrigger: {
                trigger: '#highlights',
                start: isMobile ? 'bottom bottom' : 'top center'
            },
            y: 0,
            opacity: 1,
            stagger: 0.5,
            duration: 1,
            ease: 'power1.inOut'
        });
    })

    return (
        <section id="highlights">
            <h2>Why Businesses Choose SwiftSolve AI</h2>
            <h3>Here's what sets us apart.</h3>

            <div className="masonry">
                <div className="left-column">
                    <div>
                        <img src="/laptop.png" alt="Fast Delivery" />
                        <p>We build and deliver your project on time, every time — without cutting corners.</p>
                    </div>
                    <div>
                        <img src="/sun.png" alt="Affordable Pricing" />
                        <p>Premium quality <br />
                            digital solutions at <br/>
                            prices that make sense.</p>
                    </div>
                </div>
                <div className="right-column">
                    <div className="apple-gradient">
                        <img src="/ai.png" alt="Custom Built" />
                        <p>No templates. <br />
                            <span>Everything custom built for you.</span></p>
                    </div>
                    <div>
                        <img src="/battery.png" alt="Support" />
                        <p>We don't disappear
                            <span className="green-gradient">{' '}after launch.{' '}</span>
                            Our team is always available to help you grow.
                            <span className="text-dark-100">{' '}(24/7 support.)
                            </span></p>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Highlights
