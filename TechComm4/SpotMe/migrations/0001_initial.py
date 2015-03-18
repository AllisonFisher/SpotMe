# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Area',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('chairs', models.IntegerField(default=0)),
                ('comfy_chairs', models.IntegerField(default=0)),
                ('tables', models.IntegerField(default=0)),
                ('whiteboard_tables', models.IntegerField(default=0)),
                ('whiteboards', models.IntegerField(default=0)),
                ('outlets', models.IntegerField(default=0)),
                ('floor', models.IntegerField(default=6)),
                ('quiet', models.BooleanField(default=False)),
                ('name', models.CharField(max_length=200)),
                ('last_updated', models.DateTimeField(verbose_name=b'last updated')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
