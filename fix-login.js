const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'features', 'auth', 'pages', 'LoginPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix first navigation (onSubmit)
content = content.replace(
  `      toast.success('Connexion réussie! Bienvenue dans Ma'a yegue');
      navigate('/dashboard');`,
  `      toast.success('Connexion réussie! Bienvenue dans Ma\\'a yegue');
      
      // Navigate based on user role
      const roleToPath: Record<string, string> = {
        visitor: '/dashboard/guest',
        apprenant: '/dashboard/apprenant',
        teacher: '/dashboard/teacher',
        admin: '/dashboard/admin',
      };
      
      const targetPath = roleToPath[user.role] || '/dashboard/apprenant';
      
      // Small delay to ensure state is fully updated
      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 100);`
);

// Fix second navigation (onGoogle)
content = content.replace(
  `      toast.success('Connecté avec Google avec succès!');
      navigate('/dashboard');`,
  `      toast.success('Connecté avec Google avec succès!');
      
      // Navigate based on user role
      const roleToPath: Record<string, string> = {
        visitor: '/dashboard/guest',
        apprenant: '/dashboard/apprenant',
        teacher: '/dashboard/teacher',
        admin: '/dashboard/admin',
      };
      
      const targetPath = roleToPath[user.role] || '/dashboard/apprenant';
      
      // Small delay to ensure state is fully updated
      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 100);`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ LoginPage.tsx has been fixed successfully!');
