import { Textarea } from '@/components/ui/textarea';

export const TextareaWithCounter = ({ 
  value, 
  onChange, 
  maxLength = 600,
  label,
  placeholder,
  error,
  ...props 
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  label?: string;
  placeholder?: string;
  error?: string;
}) => {
  const remaining = maxLength - value.length;
  const isNearLimit = remaining < 50;
  const isOverLimit = remaining < 0;
  
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Textarea 
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`
          ${isOverLimit ? 'border-red-500 focus:ring-red-500' : ''}
          ${error ? 'border-red-500' : ''}
        `}
        {...props} 
      />
      <div className="flex justify-between items-center">
        {error && <span className="text-sm text-red-600">{error}</span>}
        <span className={`text-sm ml-auto ${
          isOverLimit ? 'text-red-600 font-semibold' : 
          isNearLimit ? 'text-orange-600' : 
          'text-gray-500'
        }`}>
          {value.length}/{maxLength}
          {isNearLimit && !isOverLimit && ' (nearly at limit)'}
          {isOverLimit && ' (over limit!)'}
        </span>
      </div>
    </div>
  );
};
