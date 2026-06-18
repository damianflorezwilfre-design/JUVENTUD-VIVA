import os

def fix_revalidate_api():
    for root, dirs, files in os.walk('src/app/api'):
        for f in files:
            if f.endswith('.ts') or f.endswith('.tsx'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                if 'export const revalidate = 60;' in content:
                    new_content = content.replace('export const revalidate = 60;', '')
                    with open(path, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f"Fixed API {path}")

fix_revalidate_api()
