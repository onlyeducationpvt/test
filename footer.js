// footer.js

const footer = {
  init: function () {
    // Create and append styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
            .footer {
                background-color:rgb(152 44 0);
                color: white;
                padding: 1rem;
                width: 100%;
            }

            .footer-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .copyright {
                color: #a8a8a8;
            }

            .footer-links {
                display: flex;
                gap: 1rem;
                align-items: center;
            }

            .footer-links a {
                color: white;
                text-decoration: none;
                transition: opacity 0.3s ease;
            }

            .footer-links a:hover {
                opacity: 0.8;
            }

            .footer-links .separator {
                color: white;
                font-size: 0.8rem;
            }

            @media (max-width: 768px) {
                .footer-content {
                    flex-direction: column-reverse;
                    text-align: center;
                    gap: 1rem;
                }

                .footer-links {
                    flex-wrap: wrap;
                    justify-content: center;
                }
            }

            @media (max-width: 480px) {
                .footer-links {
                    font-size: 14px;
                    gap: 0.4rem;
                }
                .footer-content{
                    font-size: 14px;
                }
            }
        `;
    document.head.appendChild(styleSheet);

    // Create footer HTML
    const footerHTML = `
            <footer class="footer">
                <div class="footer-content">
                
                    <div class="copyright">
                        Copyright © 2024 OnlyEngineering. All rights reserved.
                    </div>
                    
                    <div class="footer-links">
                       
                        <a href="/privacy-policy.html">Privacy Policy</a>
                        <span class="separator">|</span>
                        <a href="/terms-condition.html">Terms & Conditions</a>
                    </div>


                    <div>
                     <a href="tel:+916262929248">+91 6262929248</a>
                   
                    </div>
                </div>
            </footer>
        `;

    // Add footer to the page
    document.body.insertAdjacentHTML("beforeend", footerHTML);
  },
};
