import { TemplateField } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ScheduleEditor from './ScheduleEditor';
import ImageUpload from './ImageUpload';

interface FieldRendererProps {
  field: TemplateField;
  value: any;
  onChange: (key: string, value: any) => void;
}

const FieldRenderer = ({ field, value, onChange }: FieldRendererProps) => {
  const handleChange = (val: any) => onChange(field.key, val);

  switch (field.type) {
    case 'text':
      return (
        <div className="space-y-1.5">
          <Label className="font-body text-sm">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            value={value || ''}
            onChange={e => handleChange(e.target.value)}
            placeholder={field.placeholder || field.label}
            maxLength={field.maxLength}
            className="text-sm"
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-1.5">
          <Label className="font-body text-sm">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Textarea
            value={value || ''}
            onChange={e => handleChange(e.target.value)}
            placeholder={field.placeholder || field.label}
            maxLength={field.maxLength}
            rows={4}
            className="text-sm resize-none"
          />
        </div>
      );

    case 'date':
      return (
        <div className="space-y-1.5">
          <Label className="font-body text-sm">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            type="date"
            value={value || ''}
            onChange={e => handleChange(e.target.value)}
            className="text-sm"
          />
        </div>
      );

    case 'time':
      return (
        <div className="space-y-1.5">
          <Label className="font-body text-sm">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            type="time"
            value={value || ''}
            onChange={e => handleChange(e.target.value)}
            className="text-sm"
          />
        </div>
      );

    case 'number':
      return (
        <div className="space-y-1.5">
          <Label className="font-body text-sm">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            type="number"
            value={value ?? ''}
            onChange={e => handleChange(e.target.value ? Number(e.target.value) : '')}
            placeholder={field.placeholder || field.label}
            className="text-sm"
          />
        </div>
      );

    case 'url':
      return (
        <div className="space-y-1.5">
          <Label className="font-body text-sm">
            {field.label}
            {field.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          <Input
            type="url"
            value={value || ''}
            onChange={e => handleChange(e.target.value)}
            placeholder={field.placeholder || 'https://...'}
            className="text-sm"
          />
        </div>
      );

    case 'toggle':
      return (
        <div className="flex items-center justify-between py-2">
          <Label className="font-body text-sm">{field.label}</Label>
          <Switch
            checked={!!value}
            onCheckedChange={handleChange}
          />
        </div>
      );

    case 'image':
      return (
        <div className="space-y-1.5">
          <Label className="font-body text-sm">{field.label}</Label>
          <ImageUpload
            value={value || null}
            onChange={handleChange}
          />
        </div>
      );

    case 'images':
      return (
        <div className="space-y-1.5">
          <Label className="font-body text-sm">
            {field.label}
            {field.max && <span className="text-muted-foreground ml-1">(max {field.max})</span>}
          </Label>
          <ImageUpload
            value={value || []}
            onChange={handleChange}
            multiple
            max={field.max || 10}
          />
        </div>
      );

    case 'schedule-list':
      return (
        <div className="space-y-1.5">
          <Label className="font-body text-sm">{field.label}</Label>
          <ScheduleEditor
            value={value || []}
            onChange={val => handleChange(val)}
          />
        </div>
      );

    default:
      return null;
  }
};

export default FieldRenderer;
