import * as Icons from 'lucide-react';

export const getIcon = (iconName) => {
  // If the icon is specifically for the theme toggle, use appropriate fallbacks
  if (name === 'sun' && !LucideIcons[name]) {
    // Return a component that renders a sun emoji character
    return (props) => <span {...props}>☀️</span>;
  }
  
  if (name === 'moon' && !LucideIcons[name]) {
    // Return a component that renders a moon emoji character
    return (props) => <span {...props}>🌙</span>;
  }
  
  return LucideIcons[name] || LucideIcons.Smile;
  if (Icons[iconName] && typeof Icons[iconName] === 'function') {
    return Icons[iconName];
  }
  
  // Convert kebab-case to PascalCase
  if (typeof iconName === 'string' && iconName.includes('-')) {
    const pascalCase = iconName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    if (Icons[pascalCase] && typeof Icons[pascalCase] === 'function') {
      return Icons[pascalCase];
    }
  }
  
  // Fallback to Smile icon
  return Icons.Smile;
};