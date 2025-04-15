'use client';

import { CountUp } from '@/components/animations/count-up';

interface StatItemProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
}

function StatItem({ value, label, prefix = '', suffix = '', delay = 0 }: StatItemProps) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <h3 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
        <CountUp
          end={value}
          prefix={prefix}
          suffix={suffix}
          delay={delay}
          duration={1.5}
        />
      </h3>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function StatsSection() {
  return (
    <div className="py-12 px-4 bg-card/30 backdrop-blur-sm border-y">
      <div className="container mx-auto">
        <h2 className="text-xl font-semibold text-center mb-8">Trusted by thousands of health-conscious individuals</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatItem 
            value={10000} 
            suffix="+" 
            label="Calculations Performed" 
          />
          <StatItem 
            value={95} 
            suffix="%" 
            label="User Satisfaction" 
            delay={0.2} 
          />
          <StatItem 
            value={25} 
            suffix="%" 
            label="Average TDEE Accuracy Improvement" 
            delay={0.4} 
          />
          <StatItem 
            value={8} 
            suffix=" factors" 
            label="Advanced Metabolic Inputs" 
            delay={0.6} 
          />
        </div>
      </div>
    </div>
  );
} 