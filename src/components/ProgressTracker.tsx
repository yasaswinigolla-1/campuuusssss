import { Check } from 'lucide-react';

interface Step {
  label: string;
  description: string;
  state: 'done' | 'current' | 'upcoming';
}

export function ProgressTracker({ steps }: { steps: Step[] }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          {/* Dot + line column */}
          <div className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                step.state === 'done'
                  ? 'border-sage-500 bg-sage-500 text-white'
                  : step.state === 'current'
                    ? 'border-amber-500 bg-amber-50 text-amber-600'
                    : 'border-cream-300 bg-cream-50 text-cream-300'
              }`}
            >
              {step.state === 'done' ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-xs font-bold">{i + 1}</span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`my-1 w-0.5 flex-1 ${step.state === 'done' ? 'bg-sage-300' : 'bg-cream-200'}`}
                style={{ minHeight: '2rem' }}
              />
            )}
          </div>
          {/* Text */}
          <div className={`pb-6 ${i === steps.length - 1 ? 'pb-0' : ''}`}>
            <p
              className={`text-sm font-semibold ${
                step.state === 'upcoming' ? 'text-navy-300' : 'text-navy-700'
              }`}
            >
              {step.label}
            </p>
            <p className="mt-0.5 text-sm text-navy-400">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
