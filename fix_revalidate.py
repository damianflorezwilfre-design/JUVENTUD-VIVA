import os

def fix_revalidate():
    for root, dirs, files in os.walk('src/app'):
        for f in files:
            if f.endswith('.ts') or f.endswith('.tsx'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                needs_fix = False
                lines = content.split('\n')
                new_lines = []
                
                is_client = any('use client' in line for line in lines[:5])
                uses_cookies = 'cookies(' in content or 'cookies()' in content

                for line in lines:
                    if 'export const revalidate = 60;' in line:
                        if is_client:
                            needs_fix = True
                            continue # Remove it
                        if uses_cookies and 'api' in path:
                            needs_fix = True
                            continue # Remove it
                    new_lines.append(line)
                
                if needs_fix:
                    with open(path, 'w', encoding='utf-8') as file:
                        file.write('\n'.join(new_lines))
                    print(f"Fixed {path}")

fix_revalidate()
