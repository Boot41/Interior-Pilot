from django.db import migrations

def add_default_design_styles(apps, schema_editor):
    DesignStyle = apps.get_model('api', 'DesignStyle')
    default_styles = [
        {
            'name': 'Modern Minimalist',
            'description': 'Clean lines, minimal decoration, and a focus on functionality. Features neutral colors, simple furniture, and uncluttered spaces.'
        },
        {
            'name': 'Scandinavian',
            'description': 'Light, airy spaces with natural materials, white walls, and wooden elements. Emphasizes comfort and simplicity.'
        },
        {
            'name': 'Industrial',
            'description': 'Raw and unfinished look with exposed brick, metal, and wood. Features high ceilings and open spaces.'
        },
        {
            'name': 'Contemporary',
            'description': 'Current design trends with a sophisticated feel. Combines comfort with clean lines and subtle elegance.'
        },
        {
            'name': 'Mid-Century Modern',
            'description': 'Retro style from the 1950s-60s featuring organic shapes, clean lines, and minimal ornamentation.'
        },
        {
            'name': 'Traditional',
            'description': 'Classic design with rich color palettes, elegant furnishings, and sophisticated decor elements.'
        },
    ]
    
    for style in default_styles:
        DesignStyle.objects.get_or_create(
            name=style['name'],
            defaults={'description': style['description']}
        )

def remove_default_design_styles(apps, schema_editor):
    DesignStyle = apps.get_model('api', 'DesignStyle')
    DesignStyle.objects.all().delete()

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0005_alter_designpreference_color_scheme'),
    ]

    operations = [
        migrations.RunPython(add_default_design_styles, remove_default_design_styles),
    ]