from django.db import models

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
    last_updated = models.DateTimeField('last updated')
    
    def max_occupancy(self):
        return self.chairs + self.comfy_chairs
