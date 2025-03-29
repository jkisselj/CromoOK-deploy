import { Link } from "react-router-dom";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t py-8 px-4 md:px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {/* Company Info */}
                    <div className="flex flex-col">
                        <h2 className="font-semibold text-lg mb-4">SceneHunter</h2>
                        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                            Find the perfect location for your photo or video shoot with our curated collection of unique spaces.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-medium mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/locations" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Locations
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-medium mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="font-medium mb-4">Connect</h3>
                        <div className="flex space-x-4 mb-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                </svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                </svg>
                            </a>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Subscribe to our newsletter for the latest updates
                        </p>
                    </div>
                </div>

                <div className="border-t mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-xs text-muted-foreground mb-4 md:mb-0">
                        © {currentYear} SceneHunter. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <span>Powered by</span>
                        <a href="#" className="font-medium hover:underline">SceneHunter Technologies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}