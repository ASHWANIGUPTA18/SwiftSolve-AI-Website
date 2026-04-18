import { features } from "../constants/index.js";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Features = () => {
    useGSAP(() => {
        features.forEach((_, index) => {
            gsap.to(`.box${index + 1}`, {
                scrollTrigger: {
                    trigger: `.box${index + 1}`,
                    start: "top 85%",
                },
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: index * 0.1,
                ease: "power2.out",
            });
        });
    }, []);

    return (
        <section id="features">
            <h2>We Build What Your Business Needs Next</h2>

            <div className="features-grid">
                {features.map((feature, index) => (
                    <div key={feature.id} className={`feature-card box box${index + 1}`}>
                        <img src={feature.icon} alt={feature.highlight} />
                        <p>
                            <span className="text-white">{feature.highlight}</span>
                            {" "}{feature.text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
