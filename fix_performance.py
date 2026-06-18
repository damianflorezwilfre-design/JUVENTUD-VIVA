import os

def process_dir(d):
    for root, dirs, files in os.walk(d):
        if 'admin' in root or 'auth' in root:
            continue
        for f in files:
            if f.endswith('.ts') or f.endswith('.tsx'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                if 'export const dynamic = "force-dynamic";' in content:
                    new_content = content.replace('export const dynamic = "force-dynamic";', 'export const revalidate = 60;')
                    with open(path, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f"Updated {path}")

process_dir('src/app')
