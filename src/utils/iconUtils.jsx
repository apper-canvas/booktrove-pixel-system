import * as Icons from 'lucide-react';
import { Smile } from 'lucide-react';

export function getIcon(iconName) {
  // Check if the icon exists directly
  if (Icons[iconName]) return Icons[iconName];
  
  // Try to convert kebab-case to PascalCase (e.g., 'arrow-right' to 'ArrowRight')
  const pascalCaseName = iconName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  if (Icons[pascalCaseName]) return Icons[pascalCaseName];
  
  // Special handling for sun/moon icons (theme toggle)
  if (iconName === 'sun') {
    // Return a component that renders a sun emoji character
    return (props) => <span {...props}>☀️</span>;
  }
  
  if (iconName === 'moon') {
    // Return a component that renders a moon emoji character
    return (props) => <span {...props}>🌙</span>;
  }
  
  // Return a default fallback icon
  return Smile;
}