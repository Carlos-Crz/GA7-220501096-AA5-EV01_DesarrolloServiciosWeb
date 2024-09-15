import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../App.css';

function Layout({children}) {
    const [isSidebarHidden, setIsSidebarHidden] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para autenticación
    const navigate = useNavigate();

    // Función para ocultar el sidebar
    const toggleSidebar = () => {
        setIsSidebarHidden(!isSidebarHidden);
    };

    // Función para colapsar el sidebar
    const toggleSidebarCollapse = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

     // Verificar autenticación
  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('http://localhost:3001/auth/status', {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        navigate('/login'); // Redirige al login si no está autenticado
      }
    };

    checkAuth();
  }, [navigate]);

    const location = useLocation();

    useEffect(() => {
      // Cambiar el título de la página según la ruta actual
    switch (location.pathname) {
        case '/':
            document.title = 'Login';
            break;
        case '/Dashboard':
            document.title = 'Dashboard';
            break;
        case '/Gestioncategorias':
            document.title = 'Gestión de Categorias';
            break;
        case '/Gestionproductos':
            document.title = 'Gestión de Productos';
            break;
        case '/Gestionproveedores':
            document.title = 'Gestión de Proveedores';
            break;
        case '/Gestioncajas':
            document.title = 'Gestión de Cajas';
            break;
        case '/Gestionclientes':
            document.title = 'Gestión de Clientes';
            break;
        case '/Gestionusuarios':
            document.title = 'Gestión de Usuarios';
            break;
            default:
        document.title = 'SuperMarket';
        break;
    }
    }, [location]);

    if (!isAuthenticated) {
        return <div>Cargando...</div>; // Mostrar un estado de carga mientras se verifica la autenticación
      }

    return (
    <div>
        {/* Componente Header */}
        <Header toggleSidebar={toggleSidebar} />
        <div class="mainContainer">
            {/* Componente Sidebar */}
            <Sidebar isSidebarHidden={isSidebarHidden} isSidebarCollapsed={isSidebarCollapsed} toggleSidebarCollapse={toggleSidebarCollapse} />
            <main className={`conteiner ${isSidebarHidden ? 'expanded' : ''} ${isSidebarCollapsed ? 'expand' : ''}`}>
                {/* Contenido que se renderiza en el layout */}
                {children}
            </main>
        </div>
    </div>
    );
}

export default Layout;
