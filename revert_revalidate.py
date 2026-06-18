import os

def revert_revalidate():
    for root, dirs, files in os.walk('src/app'):
        for f in files:
            if f.endswith('.ts') or f.endswith('.tsx'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                if 'export const revalidate = 60;' in content:
                    # Revert to force-dynamic
                    new_content = content.replace('export const revalidate = 60;', 'export const dynamic = "force-dynamic";')
                    with open(path, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    print(f"Reverted {path}")

revert_revalidate()
