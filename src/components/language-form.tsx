import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useResumeStore } from '@/store/useResumeStore';
import { Language } from '@/types/resume';
import { languageSchema } from '@/lib/validations/resume';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

type FormData = Omit<Language, 'id'>;

export function LanguageForm() {
  const { languages, addLanguage, removeLanguage } = useResumeStore();

  const { control, handleSubmit, register, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      language: '',
      proficiency: 'basic',
    },
  });

  const onSubmit = (data: FormData) => {
    addLanguage(data);
    reset();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Input 
            id="language"
            placeholder="e.g. English" 
            {...register('language')} 
          />
          {errors.language && (
            <p className="text-sm text-red-500">{errors.language.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Proficiency Level</Label>
          <Controller
            control={control}
            name="proficiency"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="proficient">Proficient</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                  <SelectItem value="native">Native</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.proficiency && (
            <p className="text-sm text-red-500">{errors.proficiency.message}</p>
          )}
        </div>

        <Button type="submit">Add Language</Button>
      </form>

      <div className="grid gap-4">
        {languages.map((language) => (
          <Card key={language.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{language.language}</p>
                <p className="text-sm text-muted-foreground">{language.proficiency}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLanguage(language.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 