import React from 'react';
import { getIcon } from '../utils/iconUtils';

const ServiceFeatures = () => {
  // Define the features with their icons, titles, and descriptions
  const features = [
    {
      icon: 'truck',
      title: 'Fast Shipping',
      description: 'Get your books delivered to your doorstep within 3-5 business days'
    },
    {
      icon: 'refresh-ccw',
      title: 'Easy Returns',
      description: 'Change your mind? Return within 30 days for a full refund'
    },
    {
      icon: 'credit-card',
      title: 'Secure Payments',
      description: 'Multiple payment options with secure processing'
    }
  ];

  return (
    <section className="py-12 bg-white dark:bg-surface-800 border-y border-surface-200 dark:border-surface-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = getIcon(feature.icon);
            
            return (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-6 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="bg-primary/10 dark:bg-primary/20 p-4 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-primary dark:text-primary-light" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-surface-800 dark:text-surface-100">
                  {feature.title}
                </h3>
                
                <p className="text-surface-600 dark:text-surface-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceFeatures;