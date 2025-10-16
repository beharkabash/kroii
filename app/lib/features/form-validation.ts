import { z } from 'zod';

// Finnish error messages for form validation
const finnishMessages = {
  required: 'Tämä kenttä on pakollinen',
  email: 'Sähköpostiosoite ei ole kelvollinen',
  phone: 'Puhelinnumero ei ole kelvollinen',
  minLength: (min: number) => `Vähintään ${min} merkkiä`,
  maxLength: (max: number) => `Enintään ${max} merkkiä`,
  onlyLetters: 'Vain kirjaimet sallittu',
  invalidCharacters: 'Sisältää kiellettyjä merkkejä',
};

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, finnishMessages.required)
    .min(2, finnishMessages.minLength(2))
    .max(100, finnishMessages.maxLength(100))
    .regex(/^[a-zA-ZäöåÄÖÅ\s-]+$/, finnishMessages.onlyLetters),
  email: z
    .string()
    .min(1, finnishMessages.required)
    .email(finnishMessages.email)
    .max(255, finnishMessages.maxLength(255)),
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      // Finnish phone number validation (various formats)
      const phoneRegex = /^(\+358|0)?[\s-]?[4-9][0-9][\s-]?[0-9]{3}[\s-]?[0-9]{4}$|^(\+358|0)?[\s-]?[4-9][0-9][\s-]?[0-9]{6,7}$/;
      return phoneRegex.test(val.replace(/[\s-]/g, ''));
    }, finnishMessages.phone),
  message: z
    .string()
    .min(1, finnishMessages.required)
    .min(10, finnishMessages.minLength(10))
    .max(2000, finnishMessages.maxLength(2000)),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Real-time validation function
export const validateField = (field: keyof ContactFormData, value: string) => {
  try {
    switch (field) {
      case 'name':
        contactFormSchema.shape.name.parse(value);
        break;
      case 'email':
        contactFormSchema.shape.email.parse(value);
        break;
      case 'phone':
        contactFormSchema.shape.phone.parse(value);
        break;
      case 'message':
        contactFormSchema.shape.message.parse(value);
        break;
    }
    return null; // No error
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Virhe kentässä';
    }
    return 'Virhe kentässä';
  }
};

// Debounced validation hook
export const useFieldValidation = () => {
  const validateWithDelay = (
    field: keyof ContactFormData,
    value: string,
    callback: (error: string | null) => void,
    delay = 300
  ) => {
    const timeoutId = setTimeout(() => {
      const error = validateField(field, value);
      callback(error);
    }, delay);

    return () => clearTimeout(timeoutId);
  };

  return { validateWithDelay };
};

// Form validation state management
export interface FormFieldState {
  value: string;
  error: string | null;
  touched: boolean;
  isValidating: boolean;
}

export interface FormState {
  name: FormFieldState;
  email: FormFieldState;
  phone: FormFieldState;
  message: FormFieldState;
}

export const initialFormState: FormState = {
  name: { value: '', error: null, touched: false, isValidating: false },
  email: { value: '', error: null, touched: false, isValidating: false },
  phone: { value: '', error: null, touched: false, isValidating: false },
  message: { value: '', error: null, touched: false, isValidating: false },
};

// Validate entire form
export const validateForm = (data: ContactFormData) => {
  try {
    contactFormSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Lomakkeessa on virheitä' } };
  }
};

// Format phone number as user types
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters except + at the beginning
  const cleaned = value.replace(/[^\d+]/g, '');

  // If starts with +358, format as +358 XX XXX XXXX
  if (cleaned.startsWith('+358')) {
    const number = cleaned.slice(4);
    if (number.length <= 2) return `+358 ${number}`;
    if (number.length <= 5) return `+358 ${number.slice(0, 2)} ${number.slice(2)}`;
    return `+358 ${number.slice(0, 2)} ${number.slice(2, 5)} ${number.slice(5, 9)}`;
  }

  // If starts with 0, format as 0XX XXX XXXX
  if (cleaned.startsWith('0')) {
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  }

  return cleaned;
};