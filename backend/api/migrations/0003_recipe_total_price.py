# Generated by Django 3.2.5 on 2024-05-23 21:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20240523_2128'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='total_price',
            field=models.DecimalField(decimal_places=2, default='1', editable=False, max_digits=10),
            preserve_default=False,
        ),
    ]
