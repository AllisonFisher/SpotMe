# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SpotMe', '0002_auto_20150407_0924'),
    ]

    operations = [
        migrations.AddField(
            model_name='area',
            name='directions',
            field=models.CharField(max_length=500, default=''),
            preserve_default=True,
        ),
    ]
