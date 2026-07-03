import { NavLink } from "react-router-dom";

import {

    ShieldCheck,

    House,

    Code2,

    Globe,

    Settings,

    Sparkles,

    Cpu,

    ChevronRight,

} from "lucide-react";



const navigation = [

    {

        name: "Dashboard",

        path: "/",

        icon: House,

    },

    {

        name: "Code Analysis",

        path: "/code-analysis",

        icon: Code2,

    },

    {

        name: "Website Testing",

        path: "/website-testing",

        icon: Globe,

    },

    {

        name: "Settings",

        path: "/settings",

        icon: Settings,

    },

];



function Sidebar({ isOpen, onClose }) {

    return (

        <aside className={`sidebar ${isOpen ? "open" : ""}`}>



            {/* ---------------- LOGO ---------------- */}



            <div className="sidebar-header">



                <NavLink

                    to="/"

                    className="logo"

                    onClick={onClose}

                >



                    <div className="logo-icon">



                        <ShieldCheck size={22} />



                    </div>



                    <div className="logo-content">



                        <span className="logo-title">



                            AutoNalyst



                        </span>



                        <span className="logo-subtitle">



                            AI Security Platform



                        </span>



                    </div>



                </NavLink>



            </div>



            {/* ---------------- AI STATUS ---------------- */}



            <div className="sidebar-status">



                <Sparkles size={18} />



                <div>



                    <h4>AI Engine</h4>



                    <p>Online & Offline Ready</p>



                </div>



            </div>



            {/* ---------------- NAVIGATION ---------------- */}



            <nav className="sidebar-nav">



                {navigation.map((item) => {



                    const Icon = item.icon;



                    return (



                        <NavLink

                            key={item.path}

                            to={item.path}

                            end={item.path === "/"}

                            onClick={onClose}

                            className={({ isActive }) =>

                                `nav-item ${isActive ? "active" : ""}`

                            }

                        >



                            <div className="nav-left">



                                <Icon size={20} />



                                <span>



                                    {item.name}



                                </span>



                            </div>



                            <ChevronRight size={16} />



                        </NavLink>



                    );



                })}



            </nav>

            {/* ---------------- FOOTER ---------------- */}



            <div className="sidebar-footer">



                <div className="system-card">



                    <div className="system-top">



                        <Cpu size={18} />



                        <div>



                            <h4>System Status</h4>



                            <span>Operational</span>



                        </div>



                    </div>



                    <div className="status-indicator">



                        <span className="status-dot"></span>



                        All Services Online



                    </div>



                </div>



                <div className="version-badge">



                    AutoNalyst v2.0



                </div>



            </div>



        </aside>

    );

}



export default Sidebar;