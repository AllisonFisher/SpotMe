from django.db import models
from rest_framework import serializers

class Area(models.Model):
    chairs = models.IntegerField(default=0)
    comfy_chairs = models.IntegerField(default=0)
    tables = models.IntegerField(default=0)
    whiteboard_tables = models.IntegerField(default=0)
    whiteboards = models.IntegerField(default=0)
    outlets = models.IntegerField(default=0)
    floor = models.IntegerField(default=6)
    quiet = models.BooleanField(default=False)
    name = models.CharField(max_length=200)
    directions = models.CharField(max_length=500,default='')
    last_updated = models.DateTimeField('last updated')
    curr_occupancy = models.IntegerField(default=0);
    curr_whiteboards_used = models.IntegerField(default=0);
    curr_tables_used = models.IntegerField(default=0);

    def max_occupancy(self):
        return self.chairs + self.comfy_chairs

    def is_full(self):
        return curr_occupancy >= self.max_occupancy()

    def table_free(self):
        return tables + whiteboard_tables > curr_tables_used

    def whiteboard_free(self):
        return whiteboards + whiteboard_tables > curr_whiteboards_used

    def __str__(self):
        withchairs = "chairs: " + str(self.chairs) + "\n"
        withwhiteboards = withchairs + "whiteboards: " + str(self.whiteboards) + "\n"
        withtables = withwhiteboards + "tables: " + str(self.tables) + "\n"
        withfloor = withtables + "floor: " + str(self.floor) + "\n"
        return withfloor

class AreaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Area
        fields = ('chairs', 'comfy_chairs', 'tables', 'whiteboard_tables',
                  'whiteboards', 'outlets', 'floor', 'quiet', 'name', 'last_updated',
                  'curr_occupancy', 'curr_whiteboards_used', 'curr_tables_used')

