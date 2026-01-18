import { useTranslations } from 'next-intl';
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
    const t = useTranslations('common');
    const year = new Date().getFullYear();

    return (
        <footer className="w-full py-8 mt-12 border-t border-surface/50 text-center text-muted">
            <div className="flex justify-center gap-6 mb-4 text-xl">
                <a
                    href="https://github.com/SpidySamurai"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="hover:text-secondary transition-colors"
                >
                    <FaGithub />
                </a>
                <a
                    href="https://www.linkedin.com/in/javier-fernando-chi-ortiz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="hover:text-secondary transition-colors"
                >
                    <FaLinkedin />
                </a>
                <a
                    href="https://www.instagram.com/javi_spidy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-secondary transition-colors"
                >
                    <FaInstagram />
                </a>
                <a
                    href="https://wa.me/5219994875155"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="hover:text-secondary transition-colors"
                >
                    <FaWhatsapp />
                </a>
            </div>
            <p className="text-sm">
                © {year} Javier Chi Ortíz. {t('footer_rights', { defaultMessage: 'All rights reserved.' })}
            </p>
        </footer>
    );
};

export default Footer;
