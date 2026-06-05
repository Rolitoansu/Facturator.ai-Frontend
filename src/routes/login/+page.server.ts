import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const MOCK_USERS = [
  { email: 'admin@acme.com', password: 'password123', name: 'Admin' }
];

export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) {
    redirect(302, '/app/dashboard');
  }
  return {};
};

export const actions: Actions = {
  signInEmail: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString() ?? '';
    const password = data.get('password')?.toString() ?? '';

    const user = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return fail(400, { message: 'Credenciales incorrectas' });
    }

    cookies.set('mock_session', JSON.stringify({ email: user.email, name: user.name }), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24
    });

    redirect(302, '/app/dashboard');
  },

  signUpEmail: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString() ?? '';
    const password = data.get('password')?.toString() ?? '';
    const name = data.get('name')?.toString() ?? 'Usuario';

    if (!email || !password) {
      return fail(400, { message: 'Email y password requeridos' });
    }

    cookies.set('mock_session', JSON.stringify({ email, name }), {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24
    });

    redirect(302, '/app/dashboard');
  }
};