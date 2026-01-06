import { CV } from '@/types/cv';
import { useMemo } from 'react';

export const useValidation = (cv: CV) => {
  const errors = useMemo(() => {
    const err: Record<string, string> = {};

    // Personal Info
    if (!cv.personalInfo.fullName.trim()) {
      err.fullName = 'Name is required';
    }

    if (!cv.personalInfo.email.trim()) {
      err.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cv.personalInfo.email)) {
      err.email = 'Invalid email format';
    }

    if (!cv.personalInfo.phone.trim()) {
      err.phone = 'Phone is required';
    }
    
    if (!cv.personalInfo.location.trim()) {
      err.location = 'Location is required';
    }

    // URL Validation
    const urlPattern = /^https?:\/\/.+/;
    if (cv.personalInfo.website && !urlPattern.test(cv.personalInfo.website)) {
      err.website = 'Invalid website URL (must start with http:// or https://)';
    }
    if (cv.personalInfo.linkedin && !urlPattern.test(cv.personalInfo.linkedin)) {
      err.linkedin = 'Invalid LinkedIn URL (must start with http:// or https://)';
    }

    // Experience validation
    cv.experience.forEach((exp, index) => {
      if (!exp.company.trim()) {
        err[`experience_${index}_company`] = 'Company name is required';
      }
      if (!exp.role.trim()) {
        err[`experience_${index}_role`] = 'Role is required';
      }
    });

    // Education validation
    cv.education.forEach((edu, index) => {
      if (!edu.institution.trim()) {
        err[`education_${index}_institution`] = 'Institution is required';
      }
      if (!edu.degree.trim()) {
        err[`education_${index}_degree`] = 'Degree is required';
      }
    });

    return err;
  }, [cv]);

  const isValid = Object.keys(errors).length === 0;
  const hasErrors = !isValid;

  return { errors, isValid, hasErrors };
};
