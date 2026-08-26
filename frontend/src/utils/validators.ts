import { z } from 'zod';

export const emailSchema = z.string().email('Adresse email invalide.');
export const passwordSchema = z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères.');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Prénom trop court.'),
    lastName: z.string().min(2, 'Nom trop court.'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
