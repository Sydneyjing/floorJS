import React from 'react';
import './NavbarRenderer.css';

const NavbarRenderer = ({ floor }) => {
    const navbarConfig = floor.navbarConfig;

    if (!navbarConfig) {
        return null;
    }

    const { position, height, backgroundColor, backgroundImage, textColor, activeColor, iconSize, items } = navbarConfig;

    const navbarStyle = {
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        boxShadow: position === 'top' ? '0 2px 8px rgba(0,0,0,0.1)' : '0 -2px 8px rgba(0,0,0,0.1)',
    };

    return (
        <div className="navbar-renderer" style={navbarStyle}>
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className="navbar-item"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        color: index === 0 ? activeColor : textColor, // 模拟第一个为选中态
                    }}
                >
                    <img
                        src={index === 0 && item.activeIcon ? item.activeIcon : item.icon}
                        alt={item.text}
                        style={{
                            width: `${iconSize}px`,
                            height: `${iconSize}px`,
                            objectFit: 'contain',
                        }}
                    />
                    <span style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {item.text}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default NavbarRenderer;
