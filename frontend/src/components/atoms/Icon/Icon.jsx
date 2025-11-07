import PropTypes from 'prop-types';
import * as PhosphorIcons from 'phosphor-react';

const Icon = ({ name, size = 24, weight = 'regular', color, className, ...props }) => {
  // Map FontAwesome icon names to Phosphor icons
  const iconMap = {
    'fa-plus': 'Plus',
    'fa-edit': 'PencilSimple',
    'fa-trash': 'Trash',
    'fa-search': 'MagnifyingGlass',
    'fa-user': 'User',
    'fa-home': 'House',
    'fa-cog': 'Gear',
    'fa-bell': 'Bell',
    'fa-envelope': 'Envelope',
    'fa-heart': 'Heart',
    'fa-star': 'Star',
    'fa-check': 'Check',
    'fa-times': 'X',
    'fa-arrow-left': 'ArrowLeft',
    'fa-arrow-right': 'ArrowRight',
    'fa-download': 'Download',
    'fa-upload': 'Upload',
    'fa-eye': 'Eye',
    'fa-eye-slash': 'EyeSlash',
    'fa-lock': 'Lock',
    'fa-unlock': 'LockOpen',
  };

  // Get the Phosphor icon name
  const phosphorName = iconMap[name] || name;
  
  // Get the icon component from Phosphor
  const IconComponent = PhosphorIcons[phosphorName];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Using default icon.`);
    return <PhosphorIcons.Circle size={size} weight={weight} color={color} className={className} {...props} />;
  }

  return <IconComponent size={size} weight={weight} color={color} className={className} {...props} />;
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  weight: PropTypes.oneOf(['thin', 'light', 'regular', 'bold', 'fill', 'duotone']),
  color: PropTypes.string,
  className: PropTypes.string,
};

export default Icon;
