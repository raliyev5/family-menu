# Generated by Django 3.2.5 on 2024-05-23 21:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='recipe',
            name='total_price',
        ),
        migrations.AddField(
            model_name='dish',
            name='image',
            field=models.ImageField(default='default/default.jpg', upload_to='dishes/'),
        ),
        migrations.AddField(
            model_name='dish',
            name='name',
            field=models.CharField(default='old_name', max_length=255),
            preserve_default=False,
        ),
    ]
