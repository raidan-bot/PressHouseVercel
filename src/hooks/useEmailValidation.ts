import { useState, useCallback } from 'react';

export interface UseEmailValidationReturn {
  email: string;
  setEmail: (email: string) => void;
  isValid: boolean;
  error: string | null;
  validate: (emailToValidate?: string) => boolean;
  reset: () => void;
  isDirty: boolean;
}

/**
 * A highly reusable custom hook for validating user email inputs with multilingual support.
 * @param isRtl boolean indicating whether Arabic translations should be prioritized
 */
export function useEmailValidation(isRtl: boolean = false): UseEmailValidationReturn {
  const [email, setEmailState] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const getValidationError = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) {
      return isRtl ? 'يرجى إدخال البريد الإلكتروني.' : 'Email address is required.';
    }

    if (trimmed.length > 100) {
      return isRtl 
        ? 'عنوان البريد الإلكتروني طويل جداً (الحد الأقصى 100 حرف).' 
        : 'Email is too long (maximum is 100 characters).';
    }

    // Classic comprehensive check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      if (!trimmed.includes('@')) {
        return isRtl ? 'البريد الإلكتروني يفتقد لرمز @.' : 'Email is missing the "@" symbol.';
      }
      
      const parts = trimmed.split('@');
      if (parts.length > 2) {
        return isRtl ? 'يجب أن يحتوي البريد على رمز @ واحد فقط.' : 'Email must contain only one "@" symbol.';
      }
      
      const domain = parts[1] || '';
      if (!domain) {
        return isRtl ? 'يرجى إدخال النطاق بعد رمز @.' : 'Please specify a domain after the "@" symbol.';
      }

      if (!domain.includes('.')) {
        return isRtl ? 'نطاق البريد الإلكتروني يفتقد للنقطة (.) وامتداد النطاق.' : 'Email domain is missing a dot (.) and extension.';
      }

      return isRtl ? 'صيغة البريد الإلكتروني غير صالحة.' : 'Please enter a valid email address.';
    }

    return null;
  };

  const validate = useCallback((emailToValidate?: string): boolean => {
    const target = emailToValidate !== undefined ? emailToValidate : email;
    const validationError = getValidationError(target);
    setError(validationError);
    return validationError === null;
  }, [email, isRtl]);

  const setEmail = useCallback((newEmail: string) => {
    setEmailState(newEmail);
    setIsDirty(true);
    // Clear or update error message in real time for a superior UX
    if (isDirty) {
      setError(getValidationError(newEmail));
    }
  }, [isDirty, isRtl]);

  const reset = useCallback(() => {
    setEmailState('');
    setError(null);
    setIsDirty(false);
  }, []);

  return {
    email,
    setEmail,
    isValid: email ? getValidationError(email) === null : false,
    error,
    validate,
    reset,
    isDirty
  };
}
