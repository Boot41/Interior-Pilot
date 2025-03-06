from django.db import migrations

def add_default_design_styles(apps, schema_editor):
    DesignStyle = apps.get_model('api', 'DesignStyle')
    default_styles = [
        {'name': 'Modern Minimalist', 'description': 'Clean lines, minimal decoration, and a focus on functionality.'},
        {'name': 'Scandinavian', 'description': 'Light, airy spaces with natural materials and white walls.'},
        {'name': 'Industrial', 'description': 'Raw and unfinished look with exposed brick and metal.'},
        {'name': 'Contemporary', 'description': 'Current design trends with a sophisticated feel.'},
        {'name': 'Mid-Century Modern', 'description': 'Retro style from the 1950s featuring organic shapes.'},
        {'name': 'Traditional', 'description': 'Classic design with rich color palettes and elegant furnishings.'},
    ]
    
    for style in default_styles:
        DesignStyle.objects.get_or_create(
            name=style['name'],
            defaults={'description': style['description']}
        )

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),  # Adjust this to your latest migration
    ]

    operations = [
        migrations.RunPython(add_default_design_styles),
    ]