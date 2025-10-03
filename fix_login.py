import os

file_path = os.path.join('src', 'features', 'auth', 'pages', 'LoginPage.tsx')

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace first navigation
old_text1 = "      navigate('/dashboard');"
new_text1 = """      
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
      }, 100);"""

# Count occurrences
count = content.count(old_text1)
print(f"Found {count} occurrences of '{old_text1}'")

# Replace all occurrences
content = content.replace(old_text1, new_text1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ LoginPage.tsx has been fixed successfully!")
