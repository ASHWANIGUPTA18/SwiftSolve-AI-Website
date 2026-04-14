import {footerLinks} from "../constants/index.js";

const Footer = () => {
    return (
        <footer>
            <div className="info">
<img src="/logo.jpeg" alt="SwiftSolve AI logo"/>
            </div>

            <hr />

            <div className="links">
                <p>Copyright © 2026 SwiftSolve AI. All rights reserved.</p>

                <ul>
                    {footerLinks.map(({label, link }) => (
                        <li key={label}>
                            <a href={link}>{label}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    )
}
export default Footer
