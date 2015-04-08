# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SpotMe', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='area',
            name='curr_occupancy',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='area',
            name='curr_tables_used',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='area',
            name='curr_whiteboards_used',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='area',
            name='last_updated',
            field=models.DateTimeField(verbose_name='last updated'),
            preserve_default=True,
        ),
    ]
